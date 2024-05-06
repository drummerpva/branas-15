import { HttpServer } from './HttpServer'
import { inject } from '../di/Registry'
import { RequestRide } from '../../application/usecase/RequestRide'
import { GetRide } from '../../application/usecase/GetRide'

export class MainController {
  @inject('httpServer')
  httpServer?: HttpServer

  @inject('requestRide')
  requestRide?: RequestRide

  @inject('getRide')
  getRide?: GetRide

  constructor() {
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
