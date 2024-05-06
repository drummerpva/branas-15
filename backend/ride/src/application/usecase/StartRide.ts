import { RideRepository } from '../../infra/repository/RideRepository'

export class StartRide {
  constructor(private rideRepository: RideRepository) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.get(input.rideId)
    if (!ride) throw new Error('Ride not found')
    ride.start()
    await this.rideRepository.update(ride)
  }
}

type Input = {
  rideId: string
}
