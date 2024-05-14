import { HttpServer } from './HttpServer'
import { inject } from '../di/Registry'
import { Signup } from '../../application/usecase/Signup'
import { GetAccount } from '../../application/usecase/GetAccount'
import { Queue } from '../queue/Queue'

export class MainController {
  @inject('httpServer')
  httpServer?: HttpServer

  @inject('signup')
  signup?: Signup

  @inject('getAccount')
  getAccount?: GetAccount

  @inject('queue')
  queue?: Queue

  constructor() {
    this.httpServer?.register(
      'post',
      '/signup',
      async (params: any, body: any) => {
        const output = await this.signup?.execute(body)
        return output
      },
    )
    // Command
    this.httpServer?.register(
      'post',
      '/signupAsync',
      async (params: any, body: any) => {
        await this.queue?.publish('signup', body)
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
