from ..repositories.ColetasRepository import ColetasRepository
from ..repositories.PostosRepository import PostosRepository

def get_coletas_by_cnpj(cnpj):
    coletaRepository = ColetasRepository()
    postoRepository = PostosRepository()
    coletas = coletaRepository.get_coletas_by_cnpj(cnpj)
    detalhe_posto = postoRepository.get_by_cnpj(cnpj)

    return {
        "detalhe_posto": detalhe_posto,
        "coletas_posto": coletas
    }