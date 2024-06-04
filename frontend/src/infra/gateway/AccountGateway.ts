import { HttpClient } from '../http/HttpClient'

type SignupInput = {
  isPassenger: boolean
  name: string
  email: string
  cpf: string
}
type SignupOutput = {
  accountId: string
}
export interface AccountGateway {
  signup(input: SignupInput): Promise<SignupOutput>
}

export class AccountGatewayHttp implements AccountGateway {
  constructor(readonly httpClient: HttpClient) {}

  async signup(input: SignupInput): Promise<SignupOutput> {
    const output = await this.httpClient.post(
      'http://localhost:3001/signup',
      input,
    )
    return {
      accountId: output.accountId,
    }
  }
}
