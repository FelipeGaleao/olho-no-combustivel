from ..repositories.PostosRepository import PostosRepository
from ..repositories.PrecosRepository import PrecosRepository
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

def get_posto_by_cnpj(cnpj_posto):
    postosRepository = PostosRepository()
    precosRepository = PrecosRepository()

    posto_encontrado = postosRepository.get_by_cnpj(cnpj_posto)
    precos_encontrados = precosRepository.get_preco_by_cnpj(cnpj_posto)

    info_posto = {
        "detalhe_posto": posto_encontrado,
        "precos_posto": precos_encontrados
    }
    return info_posto
