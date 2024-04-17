import { Ride } from '../../domain/Ride'
import { DatabaseConnection } from '../database/DatabaseConnection'

export interface RideRepository {
  save(ride: Ride): Promise<void>
  update(ride: Ride): Promise<void>
  get(rideId: string): Promise<Ride | undefined>
  getActiveRideByPassengerId(passengerId: string): Promise<Ride | undefined>
}

export class RideRepositoryDatabase implements RideRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async save(ride: Ride) {
    await this.connection.query(
      `INSERT INTO ride
    (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date)
    VALUES (?,?,?,?,?,?,?,?)`,
      [
        ride.rideId,
        ride.passengerId,
        ride.fromLat,
        ride.fromLong,
        ride.toLat,
        ride.toLong,
        ride.getStatus(),
        ride.date,
      ],
    )
  }

  async update(ride: Ride) {
    await this.connection.query(
      `UPDATE ride SET status = ?, driver_id = ? WHERE ride_id = ?`,
      [ride.getStatus(), ride.getDriverId(), ride.rideId],
    )
  }

  async get(rideId: string): Promise<Ride | undefined> {
    const [rideData] = await this.connection.query(
      `SELECT * FROM ride WHERE ride_id = ?`,
      [rideId],
    )
    if (!rideData) return
    return Ride.restore(
      rideData.ride_id,
      rideData.passenger_id,
      Number(rideData.from_lat),
      Number(rideData.from_long),
      Number(rideData.to_lat),
      Number(rideData.to_long),
      rideData.status,
      rideData.date,
      rideData.driver_id,
    )
  }

  async getActiveRideByPassengerId(
    passengerId: string,
  ): Promise<Ride | undefined> {
    const [activeRideData] = await this.connection.query(
      `SELECT * FROM ride WHERE passenger_id = ? AND status IN('requested', 'accepted')`,
      [passengerId],
    )
    if (!activeRideData) return
    return Ride.restore(
      activeRideData.ride_id,
      activeRideData.passenger_id,
      Number(activeRideData.from_lat),
      Number(activeRideData.from_long),
      Number(activeRideData.to_lat),
      Number(activeRideData.to_long),
      activeRideData.status,
      activeRideData.date,
      activeRideData.driver_id,
    )
  }
}
