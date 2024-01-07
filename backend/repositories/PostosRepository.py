from ..entities.Postos import Posto
from ..adapters.MongoAdapter import MongoAdapter
from bson import json_util
import json


class PostosRepository:
    def __init__(self):
        self.db = MongoAdapter().get_db()

    def get_all(self):
        return self.db.query(Posto).all()

    def get_by_id(self, id):
        return self.db["postos"].query(Posto).filter(Posto.id == id).first()

    def get_by_name(self, name):
        return self.db.query(Posto).filter(Posto.RazaoSocialPosto == name).first()

    def get_by_cnpj(self, cnpj):
        collection = self.db["postos"]
        postos = collection.find({"CnpjPosto": {"$regex": cnpj}})
        postos_encontrados = []
        for posto in postos:
            postos_encontrados.append(posto)
        response = json.loads(json_util.dumps(postos_encontrados))
        return response

    def get_by_lat_long(
        self,
        lat: str,
        long: str,
        max_distance: int = 1,
        page: int = 1,
        limit: int = 1,
        offset: int = 1,
    ):

        
        collection = self.db["postos"]
        if lat is not None and long is not None:
            lat = float(lat)
            long = float(long)

        # find postos with max distance of 50km, sorting by distance and custom column "distancia" in KM from lat and long to geometry column
        # show fist 200 results, with column distance
        postos = []

        if lat and long:
            postos = collection.aggregate(
                [
                    {
                        "$geoNear": {
                            "near": {"type": "Point", "coordinates": [long, lat]},
                            "distanceField": "distancia",
                            "maxDistance": max_distance * 1000,
                            "spherical": True,
                        }
                    },
                    {"$sort": {"distancia": 1}},
                    {"$skip": offset},
                    {"$limit": limit},
                ]
            )

        postos_encontrados = []
        for posto in postos:
            try:
                posto['distancia'] = posto['distancia'] / 1000
                posto = Posto(**posto)
                postos_encontrados.append(posto)
            except ValueError as e:
                # show details about error
                print(str(e))

        if len(postos_encontrados) == 0:
            return None

        if page > 1:
            offset = (page - 1) * limit
            postos_encontrados = postos_encontrados[offset : offset + limit]
        else:
            return postos_encontrados

    def get_by_mun_uf(self, municipio: str, uf: str, page: int = 1, limit: int = 25, offset: int = 1):
        collection = self.db["postos"]
        uf = uf.upper()
        municipio = municipio.upper()

        filtro = {"Município": municipio, "Uf": uf}
        postos = collection.find(filtro)

        postos_encontrados = []
        for posto in postos:
            posto = Posto(**posto)
            postos_encontrados.append(posto)
        
        if len(postos_encontrados) == 0:
            return None

        offset = (page - 1) * limit
        postos_encontrados = postos_encontrados[offset : offset + limit]
        return postos_encontrados

    def get_by_municipio(self, municipio: str, uf: str, page: int = 1, limit: int = 1):
        collection = self.db["postos"]
        filtro = {"Município": municipio, "Uf": uf}
        postos = collection.find(filtro)
        postos_encontrados = []
        for posto in postos:
            postos_encontrados.append(posto)
        response = json.loads(json_util.dumps(postos_encontrados))
        return response

    def create(self, data):
        posto = Posto(**data)
        self.db.add(posto)
        self.db.commit()
        self.db.refresh(posto)
        return posto

    def update(self, posto, data):
        for key, value in data.items():
            setattr(posto, key, value)
        self.db.commit()
        self.db.refresh(posto)
        return posto

    def delete(self, posto):
        self.db.delete(posto)
        self.db.commit()
        return True
