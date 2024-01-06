# Postos UseCase
from ..services import PostosServices
from ..repositories.PostosRepository import PostosRepository
from typing import Union



def get_posto(
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

def get_posto_by_cnpj(cnpj):
    return PostosServices.get_posto_by_cnpj(cnpj)