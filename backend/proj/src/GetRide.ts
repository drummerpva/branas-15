import { RideRepository } from './RideRepository'

export class GetRide {
  constructor(readonly rideRepository: RideRepository) {}

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideRepository.get(rideId)
    if (!ride) throw new Error('Ride does not exist')
    return ride
  }
}

type Output = {
  passengerId: string
  rideId: string
  fromLat: number
  fromLong: number
  toLat: number
  toLong: number
  status: string
  date: Date
}
