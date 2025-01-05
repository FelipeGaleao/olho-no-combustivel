from ..entities.Precos import Precos
from ..adapters.MongoAdapter import MongoAdapter
from bson import json_util
import json


class PrecosRepository:
    def __init__(self):
        self.db = MongoAdapter().get_db()

    def get_preco_by_cnpj(self, cnpj):
        collection = self.db["precos"]
        precos = collection.find({"cnpj": {"$regex": cnpj}})
        precos_encontrados = []
        for preco in precos:
            preco = Precos(**preco)
            precos_encontrados.append(preco)
        return precos_encontrados

    def create_preco(self, preco: Precos):
        collection = self.db["precos"]
        collection.insert_one(preco.to_dict())
