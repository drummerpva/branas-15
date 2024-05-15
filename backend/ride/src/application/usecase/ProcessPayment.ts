import { RideRepository } from '../../infra/repository/RideRepository'

export class ProcessPayment {
  constructor(readonly rideRepository: RideRepository) {}

  async execute(rideId: string) {
    console.log('processPayment', rideId)
  }
}
