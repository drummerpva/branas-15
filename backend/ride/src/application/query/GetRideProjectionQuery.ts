import { DatabaseConnection } from '../../infra/database/DatabaseConnection'

export class GetRideProjectionQuery {
  constructor(readonly connection: DatabaseConnection) {}

  async execute(rideId: string): Promise<any> {
    const [data] = await this.connection.query(
      `
      SELECT 
        *
      FROM
        ride_projection r
      WHERE
        r.ride_id = ?
    `,
      [rideId],
    )
    return data
  }
}
