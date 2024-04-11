import crypto from 'node:crypto'
import { RideDAO } from './RideDAO'
import { AccountDAO } from './AccountDAO'
export class RequestRide {
  constructor(
    readonly rideDAO: RideDAO,
    readonly accountDAO: AccountDAO,
  ) {}

  async execute(input: Input): Promise<Output> {
    const account = await this.accountDAO.getById(input.passengerId)
    if (!account?.isPassenger) {
      throw new Error('Account is not from a passenger')
    }
    const activeRide = await this.rideDAO.getActiveRideByPassengerId(
      input.passengerId,
    )
    if (activeRide) {
      throw new Error('Passenger has an active ride')
    }
    const rideId = crypto.randomUUID()
    const ride = Object.assign(input, {
      rideId,
      status: 'requested',
      date: new Date(),
    })
    await this.rideDAO.save(ride)
    return { rideId }
  }
}

type Input = {
  passengerId: string
  fromLat: number
  fromLong: number
  toLat: number
  toLong: number
}

type Output = {
  rideId: string
}
