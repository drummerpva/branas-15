import crypto from 'node:crypto'
import { Coord } from '../vo/Coord'
import { DistanceCalculator } from '../ds/DIstanceCalculator'
import { FareCalculatorFactory } from '../ds/FareCalculator'
import { RideCompletedEvent } from '../event/RideCompletedEvent'
import { Aggregate } from './Aggregate'

export class Ride extends Aggregate {
  private from: Coord
  private to: Coord
  private lastPosition: Coord

  private constructor(
    readonly rideId: string,
    readonly passengerId: string,
    readonly fromLat: number,
    readonly fromLong: number,
    readonly toLat: number,
    readonly toLong: number,
    private status: string,
    readonly date: Date,
    lastLat: number,
    lastLong: number,
    private distance: number,
    private fare: number,
    private driverId?: string,
  ) {
    super()
    this.from = new Coord(fromLat, fromLong)
    this.to = new Coord(toLat, toLong)
    this.lastPosition = new Coord(lastLat, lastLong)
  }

  static create(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
  ) {
    const rideId = crypto.randomUUID()
    const status = 'requested'
    const date = new Date()
    return new Ride(
      rideId,
      passengerId,
      fromLat,
      fromLong,
      toLat,
      toLong,
      status,
      date,
      fromLat,
      fromLong,
      0,
      0,
    )
  }

  static restore(
    rideId: string,
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    status: string,
    date: Date,
    lastLat: number,
    lastLong: number,
    distance: number,
    fare: number,
    driverId?: string,
  ) {
    return new Ride(
      rideId,
      passengerId,
      fromLat,
      fromLong,
      toLat,
      toLong,
      status,
      date,
      lastLat,
      lastLong,
      distance,
      fare,
      driverId,
    )
  }

  accept(driverId: string) {
    if (this.status !== 'requested') throw new Error('Invalid status')
    this.status = 'accepted'
    this.driverId = driverId
  }

  start() {
    if (this.status !== 'accepted') throw new Error('Invalid status')
    this.status = 'in_progress'
  }

  updatePosition(lat: number, long: number) {
    if (this.status !== 'in_progress')
      throw new Error('Could not update position')
    const newLastPosition = new Coord(lat, long)
    this.distance += DistanceCalculator.calculate(
      this.lastPosition,
      newLastPosition,
    )
    this.lastPosition = newLastPosition
  }

  async finish() {
    if (this.status !== 'in_progress') throw new Error('Invalid status')
    this.status = 'completed'
    this.fare = FareCalculatorFactory.create(this.date).calulate(this.distance)
    await this.notify(new RideCompletedEvent(this.rideId, '123456', this.fare))
  }

  getStatus() {
    return this.status
  }

  getDriverId() {
    return this.driverId
  }

  getFromLat() {
    return this.from.getLat()
  }

  getFromLong() {
    return this.from.getLong()
  }

  getToLat() {
    return this.to.getLat()
  }

  getToLong() {
    return this.to.getLong()
  }

  getLastLat() {
    return this.lastPosition.getLat()
  }

  getLastLong() {
    return this.lastPosition.getLong()
  }

  getDistance() {
    return this.distance
  }

  getFare() {
    return this.fare
  }
}
