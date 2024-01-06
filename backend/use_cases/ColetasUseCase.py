from ..services import ColetasServices


def get_coletas_by_cnpj(cnpj):
    return ColetasServices.get_coletas_by_cnpj(cnpj)
