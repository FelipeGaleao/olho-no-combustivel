from fastapi import APIRouter
import os
import json
from typing import Union

router = APIRouter()


@router.get(
    "/postos/",
    name="Listar todos os postos de combustíveis",
    description="Endpoint para listar todos os postos de combustíveis conforme paginação",
    tags=["postos"],
)
async def get_postos(
    Municipio: Union[str, None] = None, Uf: str = "MS", limit: int = 100, page: int = 1
):
    print("get_postos called", Uf, limit, page)
    if limit is None:
        limit = 10
    else:
        limit = int(limit)

    if page is None:
        page = 1
    else:
        page = int(page)

    json_postos = json.load(
        open("..\scrapping_data\pmqc_processed\postos.json", "r", encoding="utf8")
    )
    # query json to get all postos from Uf
    postos = []
    for posto in json_postos:
        if Municipio is not None:
            if posto["Uf"] == Uf and posto["Município"] == Municipio:
                postos.append(posto)

        if posto["Uf"] == Uf:
            postos.append(posto)

    # paginate result
    postos = postos[(page - 1) * limit : page * limit]

    print("get_postos returned", len(postos), Uf, limit, page)
    return postos


@router.get(
    "/postos/getByCnpj/{posto_cnpj}",
    name="Buscar posto de combustível pelo CNPJ",
    description="Endpoint para buscar posto de combustível pelo CNPJ",
    tags=["postos"],
)
async def get_posto(posto_cnpj: str):
    if posto_cnpj is None:
        return {"error": "posto_cnpj is required"}
    json_postos = json.load(
        open("..\scrapping_data\pmqc_processed\postos.json", "r", encoding="utf8")
    )
    json_coletas = json.load(
        open("..\scrapping_data\pmqc_processed\coletas.json", "r", encoding="utf8")
    )

    data_posto = {"detalhe_posto": {}, "coletas_posto": []}
    # search posto by cnpj
    for posto in json_postos:
        if posto["CnpjPosto"] == posto_cnpj:
            data_posto["detalhe_posto"].update(posto)

    # search coletas by posto_id
    for coleta in json_coletas:
        if coleta["CnpjPosto"] == posto_cnpj:
            data_posto["coletas_posto"].append(coleta)

    if data_posto["detalhe_posto"] != {}:
        return data_posto
    return {"error": "posto not found"}
