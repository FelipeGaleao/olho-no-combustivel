from typing import Optional

from pydantic.functional_validators import BeforeValidator

from typing_extensions import Annotated
from pydantic import BaseModel, Field

PyObjectId = Annotated[str, BeforeValidator(str)]


class Precos(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    bairro: str
    cnpj: str
    municipio: str
    nome_fantasia: str
    cep: str
    numero: str
    preco: float
    complemento: str
    produto: str
    data_coleta: str
    endereco: str
    unidade_preco: str
    estado: str

    def from_dict(cls, other: dict):
        return Precos(**other)

    def to_dict(self):
        return {
            "cnpj": self.cnpj,
            "bairro": self.bairro,
            "municipio": self.municipio,
            "nome_fantasia": self.nome_fantasia,
            "cep": self.cep,
            "numero": self.numero,
            "preco": self.preco,
            "complemento": self.complemento,
            "produto": self.produto,
            "data_coleta": self.data_coleta,
            "endereco": self.endereco,
            "unidade_preco": self.unidade_preco,
            "estado": self.estado,
        }