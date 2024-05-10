import axios from 'axios'
import fetch from 'node-fetch'

export interface HttpClient {
  get(url: string): Promise<any>
  post(url: string, data: any): Promise<any>
}

export class AxiosAdapter implements HttpClient {
  async get(url: string): Promise<any> {
    return (await axios.get(url)).data
  }

  async post(url: string, data: any): Promise<any> {
    return (await axios.post(url, data)).data
  }
}

export class FetchAdapter implements HttpClient {
  async get(url: string): Promise<any> {
    const response = await fetch(url)
    return response.json()
  }

  async post(url: string, data: any): Promise<any> {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
    return response.json()
  }
}
