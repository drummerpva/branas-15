import { HttpServer } from './HttpServer'
import { inject } from '../di/Registry'
import { Signup } from '../../application/usecase/Signup'
import { GetAccount } from '../../application/usecase/GetAccount'
import { RequestRide } from '../../application/usecase/RequestRide'
import { GetRide } from '../../application/usecase/GetRide'

export class MainController {
  @inject('httpServer')
  httpServer?: HttpServer

  @inject('signup')
  signup?: Signup

  @inject('getAccount')
  getAccount?: GetAccount

  @inject('requestRide')
  requestRide?: RequestRide

  @inject('getRide')
  getRide?: GetRide

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

    this.httpServer?.register(
      'post',
      '/request_ride',
      async (params: any, body: any) => {
        const output = await this.requestRide?.execute(body)
        return output
      },
    )

    this.httpServer?.register('get', '/rides/:rideId', async (params: any) => {
      const ride = await this.getRide?.execute(params.rideId)
      return ride
    })
  }
}
