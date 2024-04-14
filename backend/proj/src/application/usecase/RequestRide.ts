import { AccountRepository } from '../../infra/repository/AccountRepository'
import { Ride } from '../../domain/Ride'
import { RideRepository } from '../../infra/repository/RideRepository'
export class RequestRide {
  constructor(
    readonly rideRepository: RideRepository,
    readonly accountRepository: AccountRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const account = await this.accountRepository.getById(input.passengerId)
    if (!account) throw new Error('Account does not exist')
    if (!account?.isPassenger) {
      throw new Error('Account is not from a passenger')
    }
    const activeRide = await this.rideRepository.getActiveRideByPassengerId(
      input.passengerId,
    )
    if (activeRide) {
      throw new Error('Passenger has an active ride')
    }
    const ride = Ride.create(
      input.passengerId,
      input.fromLat,
      input.fromLong,
      input.toLat,
      input.toLong,
    )
    await this.rideRepository.save(ride)
    return { rideId: ride.rideId }
  }
}

type Input = {
  passengerId: string
  fromLat: number
  fromLong: number
  toLat: number
  toLong: number
}

type Output = {
  rideId: string
}
