import mysql from 'mysql2/promise'

export interface RideDAO {
  save(ride: any): Promise<void>
  get(rideId: string): Promise<any>
  getActiveRideByPassengerId(passengerId: string): Promise<any>
}

export class RideDAODatabase implements RideDAO {
  constructor() {}

  async save(ride: any) {
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
        new Date(),
      ],
    )
    connection.pool.end()
  }

  async get(rideId: string): Promise<any> {
    const connection = mysql.createPool(
      'mysql://root:root@localhost:3306/branas-15',
    )
    const [[ride]] = (await connection.query(
      `SELECT * FROM ride WHERE ride_id = ?`,
      [rideId],
    )) as any[]
    connection.pool.end()
    return ride
  }

  async getActiveRideByPassengerId(passengerId: string): Promise<any> {
    const connection = mysql.createPool(
      'mysql://root:root@localhost:3306/branas-15',
    )
    const [[activeRide]] = (await connection.query(
      `SELECT * FROM ride WHERE passenger_id = ? AND status IN('requested', 'accepted')`,
      [passengerId],
    )) as any[]
    connection.pool.end()
    return activeRide
  }
}
