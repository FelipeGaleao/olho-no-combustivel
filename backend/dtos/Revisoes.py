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
from ..entities.Revisoes import StatusRevisaoEnum
from datetime import datetime

PyObjectId = Annotated[str, BeforeValidator(str)]


class RevisoesRequestDTO(BaseModel):
    posto_cnpj: str = Field(alias="posto_cnpj", example="00000000000000")
    ip_usuario: Optional[str] = Field(
        alias="ip_usuario", example="192.168.1.1", default=None)
    imagem: Optional[str] = Field(
        alias="imagem", example="https://example.com/imagem.jpg", default=None)
    status: StatusRevisaoEnum = Field(default=StatusRevisaoEnum.criada)
    gasolina_comum: Optional[float] = None
    gasolina_aditivada: Optional[float] = None
    etanol: Optional[float] = None
    etanol_aditivado: Optional[float] = None
    diesel_s500: Optional[float] = None
    diesel_s10: Optional[float] = None
    observacoes: Optional[str] = Field(default="")
    dt_criacao: str = Field(default=datetime.now().isoformat())
    dt_atualizacao: str = Field(default=datetime.now().isoformat())
    dt_delecao: Optional[str] = None

    def to_dict(self):
        return self.model_dump(by_alias=True)


class ListaPrecosAprovacaoDTO(BaseModel):
    gasolina_comum: bool
    gasolina_aditivada: bool
    etanol: bool
    etanol_aditivado: bool
    diesel: bool
