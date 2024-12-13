

---
# Project Setup Requirements

To run the provided project setup effectively, ensure you have the following minimum requirements and configuration:

## Node.js Version
- **Node.js**: Use Node.js **22.12**.

## NPM Version
- **NPM**: Ensure you have a minimum of **NPM 6.x** or later, which typically comes bundled with Node.js versions 14.x and above. Alternatively, you can use Yarn.

## TypeScript
- **TypeScript**: The project uses TypeScript 5.1.3, which will be installed through the `devDependencies`.

## Config Nest
[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.


## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```



### **Colección Postman: Trading API**

#### **1\. Crear Orden**

- **Método**: `POST`
- **URL**: `http://localhost:3000/orders`
- **Descripción**: Crea una nueva orden de compra o venta de un instrumento financiero.
- **Headers**:
  - `Content-Type`: `application/json`

```json
{
  "userId": 1,
  "instrumentId": 2,
  "side": "SELL",
  "size": 399,
  "type": "MARKET"
}
```

- **Respuesta esperada**:
  - Código de estado: `200 OK` (ejemplo).
  - Respuesta: Dependerá de la implementación del servidor.

---

#### **2\. Consultar Portafolio**

- **Método**: `GET`
- **URL**: `http://localhost:3000/portfolio/1`
- **Descripción**: Obtiene información detallada del portafolio del usuario con ID `1`.
- **Headers**:
  - (No requiere headers adicionales).

```json
{
  "totalAccountValue": 1966411,
  "availableCash": 1691034,
  "assets": [
    {
      "instrumentId": 47,
      "ticker": "PAMP",
      "name": "Pampa Holding S.A.",
      "quantity": 80,
      "totalValue": 74068,
      "totalPerfomance": -0.45,
      "avgPrice": 930,
      "lastPrice": 925.85,
      "closePrice": 921.8
    },
    {
      "instrumentId": 2,
      "ticker": "CAPX",
      "name": "Capex S.A.",
      "quantity": 1,
      "totalValue": 1865,
      "totalPerfomance": -101.01,
      "avgPrice": -184635,
      "lastPrice": 1865,
      "closePrice": 1918
    },
    {
      "instrumentId": 54,
      "ticker": "METR",
      "name": "MetroGAS S.A.",
      "quantity": 1000,
      "totalValue": 229500,
      "totalPerfomance": -8.2,
      "avgPrice": 250,
      "lastPrice": 229.5,
      "closePrice": 232
    }
  ]
}
```

#### **3\. Buscar Instrumentos**

- **Método**: `GET`
- **URL**: `http://localhost:3000/instruments/search`
- **Descripción**: Busca instrumentos financieros por nombre y ticker con soporte para paginación.
- **Parámetros de consulta**:
  - `name` (opcional): Nombre del instrumento. Ejemplo: `Ferrum`.
  - `ticker` (opcional): Ticker del instrumento. Ejemplo: `Fe`.
  - `take` (opcional): Número de resultados a retornar. Ejemplo: `10`.
  - `skip` (opcional): Número de resultados a omitir para paginación. Ejemplo: `0`.
- **Headers**:
  - (No requiere headers adicionales).
- vbnetCopy code[http://localhost:3000/instruments/search?name=Ferrum&amp;ticker=Fe&amp;take=10&amp;skip=0](http://localhost:3000/instruments/search?name=Ferrum&ticker=Fe&take=10&skip=0)

```json
{
  "userId": 1,
  "instrumentId": 2,
  "side": "SELL",
  "size": 399,
  "type": "MARKET"
}
```
