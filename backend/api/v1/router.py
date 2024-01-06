from fastapi import APIRouter

from app.api.v1.endpoints.postos import router as postos
from app.api.v1.endpoints.coletas import router as coletas

routers = APIRouter()
router_list = [postos, coletas]

for router in router_list:
    routers.include_router(router)
