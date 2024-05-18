import { DomainEvent } from './DomainEvent'

export class RideCompletedEvent implements DomainEvent {
  name = 'rideCompleted'
  constructor(
    readonly rideId: string,
    readonly creditCardToken: string,
    readonly amount: number,
  ) {}
}
