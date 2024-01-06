from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from .api.v1.endpoints import postos, coletas

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

## allow cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(postos.router)
app.include_router(coletas.router)


def on_startup():
    """Função executada no startup da aplicação"""
    print("API is working :)")


@app.on_event("startup")
async def startup():
    """Função executada no startup da aplicação"""
    on_startup()


@app.get("/", tags=[""])
async def health_check():
    """Endpoint para verificar se a API está funcionando"""
    return {"message": "API is working :)"}
