import { DatabaseConnection } from '../../infra/database/DatabaseConnection'

export class UpdateRideProjectionHandler {
  constructor(readonly connection: DatabaseConnection) {}

  async execute(rideId: string): Promise<any> {
    console.log('Update ride projection.: ', rideId)
    const [data] = await this.connection.query(
      `
      SELECT 
        r.ride_id,
        r.status,
        r.date,
        r.fare,
        r.distance,
        p.name as passenger_name,
        p.email as passenger_email,
        d.name as driver_name,
        d.email as driver_email
      FROM
        ride r
        JOIN account p on r.passenger_id = p.account_id
        LEFT JOIN account d on r.driver_id = d.account_id
      WHERE
        r.ride_id = ?
    `,
      [rideId],
    )
    await this.connection.query(
      `DELETE FROM ride_projection WHERE ride_id = ?`,
      [rideId],
    )
    await this.connection.query(
      `INSERT INTO ride_projection
        (ride_id, status, date, fare, distance, passenger_name, passenger_email, driver_name, driver_email) 
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.ride_id,
        data.status,
        data.date,
        Number(data.fare),
        Number(data.distance),
        data.passenger_name,
        data.passenger_email,
        data.driver_name,
        data.driver_email,
      ],
    )
  }
}
