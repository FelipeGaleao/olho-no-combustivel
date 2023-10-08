# [De olho no combustivel](https://www.olhonocombustivel.com)

<img src="./screenshots/127.0.0.1_5173_map.png" width="100px">

Você já se perguntou se o posto de combustível que você abastece possui uma qualidade de combustível boa? Ou se o preço que você paga é justo? Ou ainda, se o posto que você abastece é confiável?
Pensando nisso, resolvi elaborar o projeto "De olho no combustível", que tem como objetivo coletar dados de postos de combustível e disponibilizar para o usuário de forma simples e intuitiva.

## Origem das informações

Todas as informações são coletadas do site da [Agência Nacional do Petróleo, Gás Natural e Biocombustíveis](https://www.gov.br/anp/pt-br). Atualmente, estamos exibindo duas informações relevantes:

- [Programa de Monitoramento da Qualidade dos Combustíveis](https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos/arquivos/programa-de-monitoramento-da-qualidade-dos-combustiveis)
- [Pesquisa de Preço Bomba](https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos/arquivos/pesquisa-de-precos-e-de-margens-de-comercializacao-de-combustiveis)

Todas as informações são coletadas diariamente, processadas em .JSON e disponibilizado para consulta via API REST para que a aplicação frontend possa exibir as informações.

## Tecnologias

- [Polars](https://www.pola.rs/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Docker](https://www.docker.com/)
- [React](https://reactjs.org/)

## Como contribuir?
TBD
