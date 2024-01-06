from typing import Optional

from pydantic.functional_validators import BeforeValidator

from typing_extensions import Annotated
from pydantic import BaseModel, Field

PyObjectId = Annotated[str, BeforeValidator(str)]


class Coletas(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    DataColeta: str
    IdNumeric: int
    CnpjPosto: str
    Produto: str
    Ensaio: str
    Resultado: str
    UnidadeEnsaio: Optional[str] = None
    Conforme: str
    RazaoSocialPosto: str
    Distribuidora: str
    Endereço: str
    Latitude: float
    Longitude: float
    Bairro: str
    Município: str
    Uf: str
    CnpjMatriz: int

    def from_dict(cls, other: dict):
        return Coletas(**other)

    def to_dict(self):
        return {
            "CnpjPosto": self.CnpjPosto,
            "DataColeta": self.DataColeta,
            "IdNumeric": self.IdNumeric,
            "Produto": self.Produto,
            "Ensaio": self.Ensaio,
            "Resultado": self.Resultado,
            "UnidadeEnsaio": self.UnidadeEnsaio,
            "Conforme": self.Conforme,
            "RazaoSocialPosto": self.RazaoSocialPosto,
            "Distribuidora": self.Distribuidora,
            "Endereço": self.Endereço,
            "Latitude": self.Latitude,
            "Longitude": self.Longitude,
            "Bairro": self.Bairro,
            "Município": self.Município,
            "Uf": self.Uf,
            "CnpjMatriz": self.CnpjMatriz,
        }