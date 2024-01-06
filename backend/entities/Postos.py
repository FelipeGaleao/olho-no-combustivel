from typing import Optional

from pydantic.functional_validators import BeforeValidator

from typing_extensions import Annotated
from pydantic import BaseModel, Field

PyObjectId = Annotated[str, BeforeValidator(str)]


class Posto(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    geometry: Optional[dict]
    CnpjPosto: str
    RazaoSocialPosto: str
    Distribuidora: str
    Endereço: str
    Latitude: Optional[float]
    Longitude: Optional[float]
    Bairro: Optional[str] = None
    Município: str
    Uf: str
    CnpjMatriz: int
    geometry: Optional[dict]
    distancia: Optional[float] = None

    def from_dict(cls, other: dict):
        return Posto(**other)

    def to_dict(self):
        return {
            "CnpjPosto": self.CnpjPosto,
            "RazaoSocialPosto": self.RazaoSocialPosto,
            "Distribuidora": self.Distribuidora,
            "Endereço": self.Endereço,
            "Latitude": self.Latitude,
            "Longitude": self.Longitude,
            "Bairro": self.Bairro,
            "Município": self.Município,
            "Uf": self.Uf,
            "CnpjMatriz": self.CnpjMatriz,
            "geometry": self.geometry,
        }