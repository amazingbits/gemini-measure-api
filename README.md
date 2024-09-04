<p align="center">
    <img src="https://shopper.com.br/static/img/og-logo.png" width="120px" />
</p>
<br>
<div align="center" style="display: inline-flex; gap: 8px; text-align: center;">
    <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS" />
    <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
    <img src="https://img.shields.io/badge/google%20gemini-CF3C3C?style=for-the-badge&logo=google%20gemini&logoColor=white" alt="Google Gemini" />
</div>

## Desenvolvimento de um Serviço de Leitura de Imagens

#### O Projeto

Vamos desenvolver o back-end de um serviço que gerencia a leitura individualizada de consumo de água e gás. Para facilitar a coleta da informação, o serviço utilizará IA para obter a medição através da foto de um medidor.

<p align="center">
  <img src="https://iili.io/deVwfLv.png" width="100%" />
</p>

<br>

O back-end deverá conter os seguintes endpoints:

<b>POST /upload</b>

Responsável por receber uma imagem em base 64, consultar o Gemini e retornar a medida lida pela API

Esse endpoint deve:

- Validar o tipo de dados dos parâmetros enviados (inclusive o base64)
- Verificar se já existe uma leitura no mês naquele tipo de leitura.
- Integrar com uma API de LLM para extrair o valor da imagem

Ela irá retornar:

- Um link temporário para a imagem
- Um UUID
- O valor numérico reconhecido pela LLM

<b>Request Body</b>:

```json
{
 "image": "base64",
 "customer_code": "string",
 "measure_datetime": "datetime",
 "measure_type": "WATER" ou "GAS"
}
```

<b>Response Body</b>

<table>
  <tr>
    <th>Status Code</th>
    <th>Descrição</th>
    <th>Resposta</th>
  </tr>
  <tr>
    <td>200</td>
    <td>Operação realizada com sucesso</td>
    <td>
    {
      “image_url”: string,
      “measure_value”:integer,
      “measure_uuid”: string
    }
    </td>
  </tr>
  <tr>
    <td>400</td>
    <td>Os dados fornecidos no corpo da requisição são inválidos</td>
    <td>
    {
      "error_code": "INVALID_DATA",
      "error_description": < descrição do erro >
    }
    </td>
  </tr>
  <tr>
    <td>409</td>
    <td>Já existe uma leitura para este tipo no mês atual
  </td>
    <td>
    {
      "error_code": "DOUBLE_REPORT",
      "error_description": "Leitura do mês já realizada"
    }
    </td>
  </tr>
</table>

<br>

<b>Documentação técnica do Google Gemini (LLM):</b>

<p><a href="https://ai.google.dev/gemini-api/docs/api-key" target="_blank">https://ai.google.dev/gemini-api/docs/api-key</a></p>
<p><a href="https://ai.google.dev/gemini-api/docs/vision" target="_blank">https://ai.google.dev/gemini-api/docs/vision</a></p>

<br>

<p>ATENÇÃO: Você precisará obter uma chave de acesso para usar a funcionalidade. Ela é gratuita. Não realize despesas financeiras para realizar esse teste.</p>

<br>

<b>PATCH /confirm</b>

Responsável por confirmar ou corrigir o valor lido pelo LLM,
Esse endpoint deve:

- Validar o tipo de dados dos parâmetros enviados
- Verificar se o código de leitura informado existe
- Verificar se o código de leitura já foi confirmado
- Salvar no banco de dados o novo valor informado

Ele <b>NÃO</b> deve fazer:

- Fazer novas consultas ao LLM para validar o novo resultado recebido

Ela irá retornar:

- Resposta de OK ou ERRO dependendo do valor informado.

<b>Request Body</b>

```json
{
 "measure_uuid": "string",
 "confirmed_value": integer
}
```

<b>Response Body</b>:

<table>
  <tr>
    <th>Status Code</th>
    <th>Descrição</th>
    <th>Resposta</th>
  </tr>
  <tr>
    <td>200</td>
    <td>Operação realizada com sucesso</td>
    <td>
    {
      success: true
    }
    </td>
  </tr>
  <tr>
    <td>400</td>
    <td>Os dados fornecidos no corpo da requisição são inválidos</td>
    <td>
    {
      "error_code": "INVALID_DATA",
      "error_description": < descrição do erro >
    }
    </td>
  </tr>
  <tr>
    <td>404</td>
    <td>Leitura não encontrada
  </td>
    <td>
    {
      "error_code": "MEASURE_NOT_FOUND",
      "error_description": "Leitura do mês já realizada"
    }
    </td>
  </tr>
  <tr>
    <td>409</td>
    <td>Leitura já confirmada
  </td>
    <td>
    {
      "error_code": "CONFIRMATION_DUPLICATE",
      "error_description": "Leitura do mês já realizada"
    }
    </td>
  </tr>
</table>

<b>GET /< customer code >/list</b>

Responsável por listar as medidas realizadas por um determinado cliente

Esse endpoint deve:

- Receber o código do cliente e filtrar as medidas realizadas por ele
- Ele opcionalmente pode receber um query parameter “measure_type”, que deve ser “WATER” ou “GAS”
- A validação deve ser CASE INSENSITIVE
- Se o parâmetro for informado, filtrar apenas os valores do tipo especificado. Senão, retornar todos os tipos.

Ex. {base url}/< customer code >/list?measure_type=WATER

Ela irá retornar:

- Uma lista com todas as leituras realizadas.

<b>Response Body</b>:

<table>
  <tr>
    <th>Status Code</th>
    <th>Descrição</th>
    <th>Resposta</th>
  </tr>
  <tr>
    <td>200</td>
    <td>Operação realizada com sucesso</td>
    <td>
    {
      “customer_code”: string,
      “measures”: [
      {
      “measure_uuid”: string,
      “measure_datetime”: datetime,
      “measure_type”: string,
      “has_confirmed”:boolean,
      “image_url”: string
      },
      {
      “measure_uuid”: string,
      “measure_datetime”: datetime,
      “measure_type”: string,
      “has_confirmed”:boolean,
      “image_url”: string
      }
      ]
      }
    </td>
  </tr>
  <tr>
    <td>400</td>
    <td>Parâmetro measure type diferente de WATER ou GAS</td>
    <td>
    {
      "error_code": "INVALID_TYPE",
      "error_description": "Tipo de medição não permitida"
    }
    </td>
  </tr>
  <tr>
    <td>404</td>
    <td>Leitura não encontrada
  </td>
    <td>
    {
      "error_code": "MEASURE_NOT_FOUND",
      "error_description": "Nenhuma leitura encontrada"
    }
    </td>
  </tr>
</table>

#### Requisitos

- Docker;
- Uma chave válida para acesso à API do Google Gemini;

#### Como rodar o projeto

- Clone o projeto para a sua máquina;
- Modifique o nome do arquivo `.env.example` na raíz do projeto para `.env`;
- Insira o valor da chave da API do Google Gemini na variável de ambiente `GOOGLE_API_KEY`;
- No terminal, vá ao diretório do projeto e digite o comando `docker-compose up -d` para subir o ambiente no `Docker` e rodar o projeto;
