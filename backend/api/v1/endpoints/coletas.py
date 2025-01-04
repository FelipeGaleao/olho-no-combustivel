from fastapi import APIRouter, HTTPException
from ....services import ColetasServices

router = APIRouter()

@router.get(
    "/coletas/getByCnpj/{CnpjPosto}",
    name="Buscar coletas do PMQC pelo CNPJ do posto",
    description="Endpoint para buscar coletas de qualidade de combustível",
    tags=["coletas"],
)
async def get_coletas_by_cnpj(CnpjPosto: str):
    if CnpjPosto == "undefined":
        raise HTTPException(
            status_code=400,
            detail="CnpjPosto is undefined"
        )

    if CnpjPosto is None:
        raise HTTPException(
            status_code=400,
            detail="CnpjPosto is required"
        )
    
    return ColetasServices.get_coletas_by_cnpj(CnpjPosto)
