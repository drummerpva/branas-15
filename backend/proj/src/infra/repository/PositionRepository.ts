import { Position } from '../../domain/entity/Position'
import { DatabaseConnection } from '../database/DatabaseConnection'

export interface PositionRepository {
  save(position: Position): Promise<void>
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
}
