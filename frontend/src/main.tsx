import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'
import { AccountGatewayHttp } from './infra/gateway/AccountGateway.ts'
import { AxiosAdapter, FetchAdapter } from './infra/http/HttpClient.ts'

const httpClient = new FetchAdapter()
const accountGateway = new AccountGatewayHttp(httpClient)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App accountGateway={accountGateway} />
  </React.StrictMode>,
)
