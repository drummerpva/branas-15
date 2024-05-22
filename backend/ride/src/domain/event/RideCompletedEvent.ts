import { DomainEvent } from './DomainEvent'

export class RideCompletedEvent implements DomainEvent {
  static eventName: string
  eventName = 'rideCompleted'
  constructor(
    readonly rideId: string,
    readonly creditCardToken: string,
    readonly amount: number,
  ) {}
}
