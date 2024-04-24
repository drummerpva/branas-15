import { Position } from '../../domain/entity/Position'
import { DatabaseConnection } from '../database/DatabaseConnection'

export interface PositionRepository {
  save(position: Position): Promise<void>
  listByRideId(rideId: string): Promise<Position[]>
}

export class PositionRepositoryDatabase implements PositionRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async save(position: Position) {
    await this.connection.query(
      'INSERT INTO `position` (position_id, ride_id, lat, `long`, date) VALUES (?, ?, ?, ?, ?)',
      [
        position.positionId,
        position.rideId,
        position.getLat(),
        position.getLong(),
        position.getDate(),
      ],
    )
  }

  async listByRideId(rideId: string): Promise<Position[]> {
    const positionsData = await this.connection.query(
      'SELECT * FROM `position` where ride_id = ? ORDER BY date ASC',
      [rideId],
    )
    return positionsData.map((positionData: any) =>
      Position.restore(
        positionData.position_id,
        positionData.ride_id,
        Number(positionData.lat),
        Number(positionData.long),
        positionData.date,
      ),
    )
  }
}
