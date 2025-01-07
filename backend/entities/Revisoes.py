from typing import Optional
from pydantic.functional_validators import BeforeValidator
from enum import Enum
from typing_extensions import Annotated
from pydantic import BaseModel, Field

PyObjectId = Annotated[str, BeforeValidator(str)]


class StatusRevisaoEnum(str, Enum):
    criada = "CRIADA"
    aguardando_processamento = "AGUARDANDO_PROCESSAMENTO"
    processando_imagem = "PROCESSANDO_IMAGEM"
    aguardando_validacao = "AGUARDANDO_VALIDACAO"
    aguardando_revisao_manual = "AGUARDANDO_REVISAO_MANUAL"
    reprovada = "REPROVADA"
    aprovada = "APROVADA"


class Revisoes(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    posto_cnpj: str
    ip_usuario: str
    imagem: Optional[str] = None
    status: StatusRevisaoEnum = Field(default=StatusRevisaoEnum.criada)
    gasolina_comum: Optional[float] = None
    gasolina_aditivada: Optional[float] = None
    etanol: Optional[float] = None
    etanol_aditivado: Optional[float] = None
    diesel_s500: Optional[float] = None
    diesel_s10: Optional[float] = None
    observacoes: Optional[str] = Field(default=None)
    dt_criacao: str
    dt_atualizacao: str
    dt_delecao: Optional[str] = None

    def from_dict(cls, other: dict):
        return Revisoes(**other)
    
    def to_dict(self, include_id: bool = False):
        if include_id:
            return self.model_dump(by_alias=True)
        else:
            return self.model_dump(by_alias=True, exclude={"id"})
