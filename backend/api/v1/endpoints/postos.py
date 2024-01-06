from fastapi import APIRouter
from ....dtos.Postos import PostoResponseDTO, PostoNaoEncontradoDTO
import os
import json
from typing import Union
from datetime import datetime
from ....use_cases import PostosUseCase
from typing import List

router = APIRouter()


@router.get(
    "/postos/",
    name="Listar todos os postos de combustíveis",
    description="Endpoint para listar todos os postos de combustíveis conforme paginação",
    tags=["postos"],
    # response to DTOs basing in the response of the endpoint
    responses={200: {"model": List[PostoResponseDTO]}, 400: {"model": PostoNaoEncontradoDTO}},
)
def get_postos(
    Municipio: Union[str, None] = None,
    Uf: str = "MS",
    limit: int = 100,
    page: int = 1,
    Latitude: Union[str, None] = None,
    Longitude: Union[str, None] = None,
):
    print("get_postos called", Uf, limit, page)
    if limit is None:
        limit = 10
    else:
        limit = int(limit)

    if page is None:
        page = 1
    else:
        page = int(page)

    if Municipio is None:
        Municipio = ""
    else:
        Municipio = str(Municipio)

    postos = PostosUseCase.get_posto(
        Municipio, Uf, limit, page, Latitude, Longitude
    )
    return postos


@router.get(
    "/postos/getByCnpj/{posto_cnpj}",
    name="Buscar posto de combustível pelo CNPJ",
    description="Endpoint para buscar posto de combustível pelo CNPJ",
    tags=["postos"],
)
async def get_posto(posto_cnpj: str):
    if posto_cnpj is None:
        return {"error": "posto_cnpj is required"}
    print("get_posto called", posto_cnpj)
    posto = PostosUseCase.get_posto_by_cnpj(posto_cnpj)
    return posto