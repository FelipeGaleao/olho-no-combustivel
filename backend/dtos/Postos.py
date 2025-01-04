from dataclasses import dataclass
from typing import Optional
from typing import TypedDict
from abc import ABC, abstractmethod
from bson import ObjectId
from pydantic.functional_validators import BeforeValidator
from pydantic import BaseModel
from typing_extensions import Annotated
from bson import ObjectId
from pydantic import BaseModel, Field
from typing import Optional, Union

PyObjectId = Annotated[str, BeforeValidator(str)]


class PostoResponseDTO(BaseModel):
    geometry: Optional[dict] = Field(
        alias="geometry", example={"type": "Point", "coordinates": [-54.646, -20.464]}
    )
    CnpjPosto: str = Field(alias="CNPJ", example="00000000000000")
    RazaoSocialPosto: str = Field(alias="RazaoSocialPosto", example="Posto Teste")
    Distribuidora: str = Field(alias="Distribuidora", example="Distribuidora Teste")
    Endereço: str = Field(alias="Endereço", example="Rua Teste, 123")
    Latitude: Optional[float] = Field(alias="Latitude", example=-20.464)
    Longitude: Optional[float] = Field(alias="Longitude", example=-54.646)
    Bairro: str = Field(alias="Bairro", example="Bairro Teste")
    Município: str = Field(alias="Município", example="Município Teste")
    Uf: str = Field(alias="Uf", example="MS")
    CnpjMatriz: int = Field(alias="CnpjMatriz", example=00000000000000)
    distancia: Optional[float] = Field(alias="distancia", example=0.0)


class PostoNaoEncontradoDTO(BaseModel):
    message: str = Field(alias="message", example="Posto não encontrado")
