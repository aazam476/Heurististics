# Heurististics

## ⚠️⚠️⚠️ Warning
Not made to self-host. The client docker always contacts our back-end at https://heurististics.azamserver.com/api.

## Description
A website that allows users to generate PDFs of 1-sample z and t tests using data

## Demo
[Demo](https://heurististics.azamserver.com/)

## Environment Variables
| Environment Variables | Description                                | Default |
|------------------------|-------------------------------------------|---------|
| UI_PORT                | Port of client                            | 3000    |
| API_PORT               | Port of server                            | 3000    |
| API_LOG_LEVEL          | Log level of client [debug, info, error]  | error   |
| API_CORS_ORIGIN        | CORS origin for server                    | *       |
