from ..entities.Revisoes import Revisoes
from ..adapters.MongoAdapter import MongoAdapter
from bson import json_util
import json
from bson import ObjectId
from ..entities.Revisoes import StatusRevisaoEnum
class RevisoesRepository:
    def __init__(self):
        self.db = MongoAdapter().get_db()

    def get_all(self, filters: dict = {}):
        collection = self.db["revisoes"]
        revisoes = collection.find(filters)
        revisoes_encontradas = []
        for revisao in revisoes:
            revisao = Revisoes(**revisao)
            revisoes_encontradas.append(revisao)
        return revisoes_encontradas
    
    def get_by_id(self, revisao_id: str):
        collection = self.db["revisoes"]
        revisao = collection.find_one({"_id": ObjectId(revisao_id)})
        if revisao:
            revisao = Revisoes(**revisao)
        return revisao
    
    def create_revisao(self, revisao: Revisoes):
        collection = self.db["revisoes"]
        collection.insert_one(revisao.to_dict())
        
    def aprovar_revisao(self, revisao_id: str):
        collection = self.db["revisoes"]
        collection.update_one({"_id": ObjectId(revisao_id)}, {"$set": {"status": StatusRevisaoEnum.aprovada}})

    def reprovar_revisao(self, revisao_id: str):
        collection = self.db["revisoes"]
        collection.update_one({"_id": ObjectId(revisao_id)}, {"$set": {"status": StatusRevisaoEnum.reprovada}})
