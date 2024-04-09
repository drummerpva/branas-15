import { RideDAO } from './RideDAO'

export class GetRide {
  constructor(readonly rideDAO: RideDAO) {}

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideDAO.get(rideId)
    return {
      passengerId: ride.passenger_id,
      rideId: ride.ride_id,
      fromLat: Number(ride.from_lat),
      fromLong: Number(ride.from_long),
      toLat: Number(ride.to_lat),
      toLong: Number(ride.to_long),
      status: ride.status,
      date: ride.date,
    }
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
