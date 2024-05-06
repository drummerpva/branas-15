import { Ride } from '../../domain/entity/Ride'
import { RideRepository } from '../../infra/repository/RideRepository'
import { AccountGateway } from '../gateway/AccountGateway'
export class RequestRide {
  constructor(
    readonly rideRepository: RideRepository,
    readonly accountGateway: AccountGateway,
  ) {}

  async execute(input: Input): Promise<Output> {
    const account = await this.accountGateway.getById(input.passengerId)
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
