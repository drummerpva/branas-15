import { DomainEvent } from '../../domain/event/DomainEvent'
import { Mediator } from '../../infra/mediator/Mediator'
import { Queue } from '../../infra/queue/Queue'
import { RideRepository } from '../../infra/repository/RideRepository'

export class FinishRide {
  constructor(
    readonly rideRepository: RideRepository,
    readonly mediator: Mediator,
    readonly queue: Queue,
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.get(input.rideId)
    if (!ride) throw new Error('Ride not found')
    ride.register('rideCompleted', async (event: DomainEvent) => {
      await this.queue.publish(event.name, event)
    })
    await ride.finish()
    await this.rideRepository.update(ride)
    // await this.mediator.notify('rideCompleted', { rideId: ride.rideId })
    // await this.queue.publish(event.name, event)
  }
}

type Input = {
  rideId: string
}
