from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_check_api_health():
    """Teste para verificar se a API está funcionando"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "API is working :)"}


def test_get_postos():
    """Teste para verificar se o endpoint de listagem de postos está funcionando"""
    response = client.get("/postos/")
    assert response.status_code == 200
    assert len(response.json()) == 100


def test_get_posto_by_cnpj():
    """Teste para verificar se o endpoint de busca de posto por CNPJ está funcionando"""
    response = client.get("/postos/getByCnpj/06294288000130")
    assert response.status_code == 200
    assert response.json()["detalhe_posto"]["CnpjPosto"] == "06294288000130"


def test_get_posto_by_matriz():
    """Teste para verificar se o endpoint de busca de posto por CNPJ da matriz está funcionando"""
    response = client.get("/coletas/getByMatriz/27282982")
    assert response.status_code == 200
    assert response.json()["detalhe_posto"]["CnpjPosto"] == "27282982000108"
