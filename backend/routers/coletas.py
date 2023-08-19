from fastapi import APIRouter, HTTPException
import os
import json
from typing import Union

router = APIRouter()


@router.get(
    "/coletas/getByMatriz/{matriz_cnpj}",
    name="Buscar coletas do Programa de Monitoramento e Qualidade do Combustível pelo CNPJ da matriz",
    description="Endpoint para buscar coletas de qualidade de combustível pelo CNPJ da matriz",
    tags=["coletas"],
)
async def get_postos_by_matriz(matriz_cnpj: str):
    if matriz_cnpj is None:
        return {"error": "matriz_cnpj is required"}
    else:
        matriz_cnpj = int(matriz_cnpj)

    json_postos = json.load(
        open("/code/app/data/postos.json", "r", encoding="utf8")
    )
    json_coletas = json.load(
        open("/code/app/data/coletas.json", "r", encoding="utf8")
    )

    data_posto = {"detalhe_posto": {}, "coletas_posto": []}
    posto_matriz = None
    # search posto by cnpj
    for posto in json_postos:
        if posto["CnpjMatriz"] == matriz_cnpj:
            data_posto["detalhe_posto"].update(posto)
            posto_matriz = posto

    # search coletas by posto_id
    for coleta in json_coletas:
        if coleta["CnpjPosto"] == posto_matriz["CnpjPosto"]:
            data_posto["coletas_posto"].append(coleta)

    if data_posto["detalhe_posto"] != {}:
        return data_posto
    return {"error": "posto not found"}


@router.get(
    "/coletas/getByCnpj/{CnpjPosto}",
    name="Buscar coletas do Programa de Monitoramento e Qualidade do Combustível pelo CNPJ do posto",
    description="Endpoint para buscar coletas de qualidade de combustível pelo CNPJ do posto",
    tags=["coletas"],
)
async def get_coletas_by_cnpj(CnpjPosto: str):
    if CnpjPosto == "undefined":
        # return with response status code 500
        raise HTTPException(
            status_code=400,
            detail="CnpjPosto is undefined",
            headers={"X-Error": "There goes my error"},
        )

    if CnpjPosto is None:
        raise HTTPException(
            status_code=400,
            detail="CnpjPosto is required",
            headers={"X-Error": "There goes my error"},
        )
    # else:
    #     CnpjPosto = int(CnpjPosto)

    json_postos = json.load(
        open("/code/app/data/postos.json", "r", encoding="utf8")
    )
    json_coletas = json.load(
        open("/code/app/data/coletas.json", "r", encoding="utf8")
    )

    data_posto = {"detalhe_posto": {}, "coletas_posto": []}
    posto_matriz = None
    # search posto by cnpj
    for posto in json_postos:
        if posto["CnpjPosto"] == CnpjPosto:
            data_posto["detalhe_posto"].update(posto)
            posto_matriz = posto

    # print(posto_matriz)
    # search coletas by posto_id
    for coleta in json_coletas:
        if coleta["CnpjPosto"] == posto_matriz["CnpjPosto"]:
            data_posto["coletas_posto"].append(coleta)

    if data_posto["detalhe_posto"] != {}:
        return data_posto
    return {"error": "posto not found"}
