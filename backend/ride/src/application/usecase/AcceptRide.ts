import { AccountRepository } from '../../infra/repository/AccountRepository'
import { RideRepository } from '../../infra/repository/RideRepository'

export class AcceptRide {
  constructor(
    private rideRepository: RideRepository,
    private accountRepository: AccountRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.get(input.rideId)
    if (!ride) throw new Error('Ride not found')
    ride.accept(input.driverId)
    await this.rideRepository.update(ride)
  }
}

type Input = {
  rideId: string
  driverId: string
}
