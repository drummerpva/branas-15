import mysql from 'mysql2/promise'
import { Ride } from './Ride'

export interface RideRepository {
  save(ride: Ride): Promise<void>
  get(rideId: string): Promise<Ride | undefined>
  getActiveRideByPassengerId(passengerId: string): Promise<Ride | undefined>
}

export class RideRepositoryDatabase implements RideRepository {
  constructor() {}

  async save(ride: Ride) {
    const connection = mysql.createPool(
      'mysql://root:root@localhost:3306/branas-15',
    )
    await connection.query(
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
        ride.status,
        ride.date,
      ],
    )
    connection.pool.end()
  }

  async get(rideId: string): Promise<Ride | undefined> {
    const connection = mysql.createPool(
      'mysql://root:root@localhost:3306/branas-15',
    )
    const [[rideData]] = (await connection.query(
      `SELECT * FROM ride WHERE ride_id = ?`,
      [rideId],
    )) as any[]
    connection.pool.end()
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
    )
  }

  async getActiveRideByPassengerId(
    passengerId: string,
  ): Promise<Ride | undefined> {
    const connection = mysql.createPool(
      'mysql://root:root@localhost:3306/branas-15',
    )
    const [[activeRideData]] = (await connection.query(
      `SELECT * FROM ride WHERE passenger_id = ? AND status IN('requested', 'accepted')`,
      [passengerId],
    )) as any[]
    connection.pool.end()
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
    )
  }
}
