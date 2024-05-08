import { RideRepository } from '../../infra/repository/RideRepository'

export class FinishRide {
  constructor(private rideRepository: RideRepository) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.get(input.rideId)
    if (!ride) throw new Error('Ride not found')
    ride.finish()
    await this.rideRepository.update(ride)
  }
}

type Input = {
  rideId: string
}
