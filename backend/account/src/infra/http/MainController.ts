import { HttpServer } from './HttpServer'
import { inject } from '../di/Registry'
import { Signup } from '../../application/usecase/Signup'
import { GetAccount } from '../../application/usecase/GetAccount'

export class MainController {
  @inject('httpServer')
  httpServer?: HttpServer

  @inject('signup')
  signup?: Signup

  @inject('getAccount')
  getAccount?: GetAccount

  constructor() {
    this.httpServer?.register(
      'post',
      '/signup',
      async (params: any, body: any) => {
        const output = await this.signup?.execute(body)
        return output
      },
    )

    this.httpServer?.register(
      'get',
      '/accounts/:accountId',
      async (params: any) => {
        const output = await this.getAccount?.execute(params.accountId)
        return output
      },
    )
  }
}
