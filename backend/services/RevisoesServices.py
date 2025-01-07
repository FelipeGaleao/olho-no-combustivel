from ..repositories.RevisoesRepository import RevisoesRepository
from ..repositories.PostosRepository import PostosRepository
from ..repositories.PrecosRepository import PrecosRepository
from ..dtos.Revisoes import RevisoesRequestDTO, ListaPrecosAprovacaoDTO
from fastapi import HTTPException
import logging
from ..entities.Revisoes import StatusRevisaoEnum
from ..entities.Precos import Precos
from ..adapters.GeminiAdapter import GeminiAdapter
import requests
import base64
import uuid
from urllib.request import urlretrieve
from time import sleep
from urllib.error import HTTPError
import json
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
from concurrent.futures import ThreadPoolExecutor


def get_all(status: StatusRevisaoEnum = None):
    revisoesRepository = RevisoesRepository()
    if status:
        return revisoesRepository.get_all({"status": status})
    else:
        return revisoesRepository.get_all()


def create_revisao(revisao: RevisoesRequestDTO):
    revisoesRepository = RevisoesRepository()
    postosRepository = PostosRepository()

    # Verificar se o posto existe
    posto = postosRepository.get_by_cnpj(revisao.posto_cnpj)
    if len(posto) == 0:
        logging.error(f"Posto não encontrado: {revisao.posto_cnpj}")
        raise HTTPException(status_code=404, detail="Posto não encontrado")
    else:
        revisoesRepository.create_revisao(revisao)
        return revisao


def revisar_revisao(revisao_id: str, lista_precos_aprovacao: ListaPrecosAprovacaoDTO,
                    status: StatusRevisaoEnum):
    revisoesRepository = RevisoesRepository()
    postosRepository = PostosRepository()
    precosRepository = PrecosRepository()

    # Busca e valida a revisão
    revisao = revisoesRepository.get_by_id(revisao_id)
    if not revisao:
        logging.error(f"Revisão não encontrada: {revisao_id}")
        raise HTTPException(status_code=404, detail="Revisão não encontrada")

    if revisao.status == StatusRevisaoEnum.aprovada:
        raise HTTPException(status_code=400,
                            detail={"revisao_id": revisao_id,
                                    "status": "Revisão já aprovada"})

    # Busca e valida o posto
    posto = postosRepository.get_by_cnpj(revisao.posto_cnpj)
    if len(posto) == 0:
        logging.error(f"Posto não encontrado: {revisao.posto_cnpj}")
        raise HTTPException(status_code=404, detail="Posto não encontrado")

    if status == StatusRevisaoEnum.reprovada:
        revisoesRepository.reprovar_revisao(revisao_id)
        return {"revisao_id": revisao_id, "status": "Revisão reprovada com sucesso"}

    # Processa aprovação
    produtos_precos = {
        "gasolina_comum": (revisao.gasolina_comum, "GASOLINA COMUM"),
        "gasolina_aditivada": (revisao.gasolina_aditivada, "GASOLINA ADITIVADA"),
        "etanol": (revisao.etanol, "ETANOL"),
        "etanol_aditivado": (revisao.etanol_aditivado, "ETANOL ADITIVADO"),
        "diesel_s500": (revisao.diesel_s500, "DIESEL S500"),
        "diesel_s10": (revisao.diesel_s10, "DIESEL S10")
    }

    produtos_aprovados = {k: v for k, v in {
        "gasolina_comum": lista_precos_aprovacao.gasolina_comum,
        "gasolina_aditivada": lista_precos_aprovacao.gasolina_aditivada,
        "etanol": lista_precos_aprovacao.etanol,
        "etanol_aditivado": lista_precos_aprovacao.etanol_aditivado,
        "diesel_s500": lista_precos_aprovacao.diesel_s500,
        "diesel_s10": lista_precos_aprovacao.diesel_s10
    }.items() if v}

    for produto in produtos_aprovados:
        preco, nome = produtos_precos[produto]
        novo_preco = Precos(
            cnpj=revisao.posto_cnpj,
            bairro=posto[0]['Bairro'],
            municipio=posto[0]['Município'],
            nome_fantasia=posto[0]['RazaoSocialPosto'],
            cep="",
            numero="",
            endereco=posto[0]['Endereço'],
            complemento="",
            unidade_preco="R$ / litro",
            estado=posto[0]['Uf'],
            data_coleta=revisao.dt_criacao,
            produto=nome,
            preco=preco
        )
        precosRepository.create_preco(novo_preco)

    revisoesRepository.aprovar_revisao(revisao_id)
    return {"revisao_id": revisao_id, "status": "Revisão aprovada com sucesso"}


def download_image(url, save_path, max_retries=3):
    # Configurar headers
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    # Configurar sessão com retry
    session = requests.Session()
    retry_strategy = Retry(
        total=max_retries,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504]
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)

    try:
        response = session.get(url, headers=headers, stream=True)
        response.raise_for_status()

        with open(save_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        return True
    except Exception as e:
        print(f"Erro ao baixar imagem: {str(e)}")
        return False


def processar_imagem(revisao_id: str, max_retries: int = 3, delay: int = 1):
    geminiAdapter = GeminiAdapter()
    revisoesRepository = RevisoesRepository()
    revisao = revisoesRepository.get_by_id(revisao_id)

    # Tenta baixar a imagem com retry
    for attempt in range(max_retries):
        try:
            imagem_file = f"image_{uuid.uuid4()}.png"
            download_image(revisao.imagem, imagem_file)
            break
        except HTTPError as e:
            if e.code == 429:
                if attempt == max_retries - 1:
                    revisao.status = StatusRevisaoEnum.aguardando_revisao_manual
                    revisao.observacoes = "Limite de requisições atingido. Tente novamente mais tarde."
                    revisoesRepository.update_revisao(revisao)
                    raise HTTPException(
                        status_code=429,
                        detail="Limite de requisições atingido. Tente novamente mais tarde."
                    )
                logging.warning(
                    f"Tentativa {attempt + 1} falhou. Aguardando {delay} segundos.")
                sleep(delay * (attempt + 1))  # Backoff exponencial
            elif e.code == 404:
                revisao.status = StatusRevisaoEnum.aguardando_revisao_manual
                revisao.observacoes = "Imagem não encontrada"
                revisoesRepository.update_revisao(revisao)
                raise HTTPException(
                    status_code=404, detail="Imagem não encontrada")
            elif e.code == 403:
                revisao.status = StatusRevisaoEnum.aguardando_revisao_manual
                revisao.observacoes = "Acesso negado"
                revisoesRepository.update_revisao(revisao)
                raise HTTPException(status_code=403, detail="Acesso negado")
            else:
                raise e
        except Exception as e:
            logging.error(f"Erro ao baixar imagem: {e}")
            revisao.status = StatusRevisaoEnum.aguardando_revisao_manual
            revisoesRepository.update_revisao(revisao)
            raise HTTPException(
                status_code=500, detail="Erro ao baixar imagem")
    base64_imagem = base64.b64encode(
        open(imagem_file, "rb").read()).decode('utf-8')
    prompt = """
    Você é um analisador de preços de combustíveis. 
Você receberá fotos de placas que contém preços de combustíveis brasileiros, como Gasolina, Gasolina Aditivada (Grid, Podium, etc.), Etanol, Etanol Aditiviado, Diesel S500 e Diesel S10.
Você deverá estruturar os preços em um JSON, como por exemplo:

Débito: 
{ Gasolina: ...., Gasolina Aditivada: ....., Etanol: ....., Etanol Aditivado: .......}

Crédito: 
{ Gasolina: ...., Gasolina Aditivada: ....., Etanol: ....., Etanol Aditivado: .......}

Outras informações:
{
    "informacoes": [
    "texto_1": .....,
    "texto_2": .....,
    "texto_3": .....,
    ]
}
"""
    result = geminiAdapter.answer_with_image(prompt, [base64_imagem])
    processamento = json.loads(result)
    try:    
        revisao.gasolina_comum = processamento["debito"]["gasolina"]
    except KeyError:
        revisao.gasolina_comum = None
    try:
        revisao.gasolina_aditivada = processamento["debito"]["gasolina_aditivada"]
    except KeyError:
        revisao.gasolina_aditivada = None
    try:
        revisao.etanol = processamento["debito"]["etanol"]
    except KeyError:
        revisao.etanol = None
    try:
        revisao.etanol_aditivado = processamento["debito"]["etanol_aditivado"]
    except KeyError:
        revisao.etanol_aditivado = None
    try:
        revisao.diesel_s500 = processamento["debito"]["diesel_s500"]
    except KeyError:
        revisao.diesel_s500 = None
    try:
        revisao.diesel_s10 = processamento["debito"]["diesel_s10"]
    except KeyError:
        revisao.diesel_s10 = None
    revisao.status = StatusRevisaoEnum.aguardando_validacao
    revisoesRepository.update_revisao(revisao)
    return {"revisao_id": revisao_id, "status": "Revisão processada com sucesso"}


def processar_todas_revisoes():
    revisoesRepository = RevisoesRepository()
    revisoes = revisoesRepository.get_all(
        {"status": StatusRevisaoEnum.aguardando_processamento})
    with ThreadPoolExecutor(max_workers=10) as executor:
        executor.map(processar_imagem, [revisao.id for revisao in revisoes])
    return {"status": "Revisões processadas com sucesso"}
