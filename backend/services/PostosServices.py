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
    postosRepository = PostosRepository()
    postos_encontrados = []

    if Latitude and Longitude:
        postos_encontrados = postosRepository.get_by_lat_long(
            lat=Latitude, long=Longitude, max_distance=10, page=page, limit=limit
        )
        return postos_encontrados

    if Municipio or Uf:
        postos_encontrados = postosRepository.get_by_mun_uf(
            municipio=Municipio, uf=Uf, page=page, limit=limit
        )
        return postos_encontrados

    return postos_encontrados
