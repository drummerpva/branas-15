import crypto from 'node:crypto'
import { Coord } from '../vo/Coord'

export class Position {
  private constructor(
    readonly positionId: string,
    readonly rideId: string,
    private coord: Coord,
    private date: Date,
  ) {}

  static create(rideId: string, lat: number, long: number) {
    const positionId = crypto.randomUUID()
    const date = new Date()
    const coord = new Coord(lat, long)
    return new Position(positionId, rideId, coord, date)
  }

  static restore(
    positionId: string,
    rideId: string,
    lat: number,
    long: number,
    date: Date,
  ) {
    const coord = new Coord(lat, long)
    return new Position(positionId, rideId, coord, date)
  }

  getLat() {
    return this.coord.getLat()
  }

  getLong() {
    return this.coord.getLong()
  }

  getDate() {
    return this.date
  }
}
