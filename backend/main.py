from fastapi import Depends, FastAPI

from routers import postos, coletas

app = FastAPI(
    title="OlhoNoCombustivel",
    description="API para consulta de dados de postos de combustível e coletas de preços de combustíveis. Todos os dados foram obtidos através de Scrapping na ANP",
    version="0.0.1",
    openapi_tags=[
        {
            "name": "postos",
            "description": "Endpoints para consulta de dados de postos de combustível",
        },
        {
            "name": "coletas",
            "description": "Endpoints para consulta de dados do Programa de Monitoramento da Qualidade dos Combustíveis",
        },
    ],
)


app.include_router(postos.router)
app.include_router(coletas.router)


@app.get("/", tags=[""])
async def health_check():
    """Endpoint para verificar se a API está funcionando"""
    return {"message": "API is working :)"}