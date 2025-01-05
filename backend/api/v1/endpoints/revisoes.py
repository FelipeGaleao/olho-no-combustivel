from fastapi import APIRouter, Request, Query
from ....dtos.Revisoes import RevisoesRequestDTO, ListaPrecosAprovacaoDTO
from ....services import RevisoesServices
from ....entities.Revisoes import StatusRevisaoEnum
router = APIRouter()


@router.get(
    "/revisoes/",
    name="Listar revisões de preços",
    description="Endpoint para listar revisões de preços",
    tags=["revisoes"],
)
def get_revisoes(status: StatusRevisaoEnum = Query(None, required=False)):
    return RevisoesServices.get_all(status)


@router.post(
    "/revisoes/novo",
    name="Criar uma nova revisão de preços",
    description="Endpoint para criar uma nova revisão de preços",
    tags=["revisoes"],
)
def create_revisao(revisao: RevisoesRequestDTO, request: Request):
    ip_address = request.client.host
    revisao.ip_usuario = ip_address
    return RevisoesServices.create_revisao(revisao)


@router.post(
    "/revisoes/revisar",
    name="Revisar uma revisão de preços",
    description="Endpoint para revisar uma revisão de preços",
    tags=["revisoes"],
)
def revisar_revisao(revisao_id: str, 
                    lista_precos_aprovacao: ListaPrecosAprovacaoDTO,
                    status: StatusRevisaoEnum = None):
    return RevisoesServices.revisar_revisao(revisao_id, lista_precos_aprovacao, status)