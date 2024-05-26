import { UpdateRideProjectionHandler } from '../../application/handler/UpdateRideProjectionHandler'
import { ProcessPayment } from '../../application/usecase/ProcessPayment'
import { inject } from '../di/Registry'
import { Queue } from './Queue'

export class QueueController {
  @inject('queue')
  queue?: Queue

  @inject('processPayment')
  processPayment?: ProcessPayment

  @inject('updateRideProjection')
  updateRideProjection?: UpdateRideProjectionHandler

  constructor() {
    console.log('Queue Consumer started')
    this.queue?.consume('rideCompleted', async (input: any) => {
      await this.processPayment?.execute(input)
    })
    this.queue?.consume('rideStarted', async (input: any) => {
      await this.updateRideProjection?.execute(input.rideId)
    })
  }
}
