import { RideRepository } from '../../infra/repository/RideRepository'
import { AccountGateway } from '../gateway/AccountGateway'

export class GetRide {
  constructor(
    readonly rideRepository: RideRepository,
    readonly accountGateway: AccountGateway,
  ) {}

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideRepository.get(rideId)
    if (!ride) throw new Error('Ride does not exist')
    const passenger = await this.accountGateway.getById(ride.passengerId)
    if (!passenger) throw new Error('Passenger not found')
    return {
      passengerId: ride.passengerId,
      passengerName: passenger.name,
      rideId: ride.rideId,
      fromLat: ride.getFromLat(),
      fromLong: ride.getFromLong(),
      toLat: ride.getToLat(),
      toLong: ride.getToLong(),
      status: ride.getStatus(),
      date: ride.date,
      driverId: ride.getDriverId(),
      lastPositionLat: ride.getLastLat(),
      lastPositionLong: ride.getLastLong(),
      distance: ride.getDistance(),
      fare: ride.getFare(),
    }
  }
}

type Output = {
  passengerId: string
  passengerName: string
  driverId?: string
  rideId: string
  fromLat: number
  fromLong: number
  toLat: number
  toLong: number
  status: string
  lastPositionLat: number
  lastPositionLong: number
  distance: number
  fare: number
  date: Date
}
