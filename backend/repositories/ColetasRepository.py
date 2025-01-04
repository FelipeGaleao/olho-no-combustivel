
from ..adapters.MongoAdapter import MongoAdapter
from ..entities.Coletas import Coletas


class ColetasRepository:
    def __init__(self):
        self.db = MongoAdapter().get_db()
        
    def get_coletas_by_cnpj(self, cnpj):
        collection = self.db["coletas"]
        coletas = collection.find({"CnpjPosto": {"$regex": cnpj}})
        coletas_encontradas = []
        for coleta in coletas:
            coleta = Coletas(**coleta)
            coletas_encontradas.append(coleta)
        return coletas_encontradas