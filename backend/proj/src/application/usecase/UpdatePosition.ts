import { RideRepository } from '../../infra/repository/RideRepository'

export class UpdatePosition {
  constructor(private rideRepository: RideRepository) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.get(input.rideId)
    if (!ride) throw new Error('Ride not found')
    ride.updatePosition(input.lat, input.long)
    await this.rideRepository.update(ride)
    // const position = new Position(input.rideId, input.lat, input.long)
    // await this.positionRepository.save(position)
  }
}

type Input = {
  rideId: string
  lat: number
  long: number
}
