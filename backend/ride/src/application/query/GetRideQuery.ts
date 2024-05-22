import { DatabaseConnection } from '../../infra/database/DatabaseConnection'

export class GetRideQuery {
  constructor(readonly connection: DatabaseConnection) {}

  async execute(rideId: string): Promise<any> {
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
    return data
  }
}
