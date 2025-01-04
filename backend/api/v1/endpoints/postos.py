from fastapi import APIRouter
from ....dtos.Postos import PostoResponseDTO, PostoNaoEncontradoDTO
from typing import Union, List
from ....services import PostosServices

router = APIRouter()

@router.get(
    "/postos/",
    name="Listar todos os postos de combustíveis",
    description="Endpoint para listar todos os postos de combustíveis",
    tags=["postos"],
    responses={
        200: {"model": List[PostoResponseDTO]}, 
        400: {"model": PostoNaoEncontradoDTO}
    },
)
def get_postos(
    Municipio: Union[str, None] = None,
    Uf: str = "MS",
    limit: int = 100,
    page: int = 1,
    Latitude: Union[str, None] = None,
    Longitude: Union[str, None] = None,
):
    return PostosServices.get_posto(
        Municipio, Uf, limit, page, Latitude, Longitude
    )

@router.get(
    "/postos/getByCnpj/{posto_cnpj}",
    name="Buscar posto de combustível pelo CNPJ",
    description="Endpoint para buscar posto de combustível pelo CNPJ",
    tags=["postos"],
)
async def get_posto(posto_cnpj: str):
    if posto_cnpj is None:
        return {"error": "posto_cnpj is required"}
    return PostosServices.get_posto_by_cnpj(posto_cnpj)