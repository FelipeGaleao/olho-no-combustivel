from ..repositories.RevisoesRepository import RevisoesRepository
from ..repositories.PostosRepository import PostosRepository
from ..repositories.PrecosRepository import PrecosRepository
from ..dtos.Revisoes import RevisoesRequestDTO, ListaPrecosAprovacaoDTO
from fastapi import HTTPException
import logging
from ..entities.Revisoes import StatusRevisaoEnum
from ..entities.Precos import Precos


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
