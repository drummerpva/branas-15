import { AccountGateway } from '../../src/application/gateway/AccountGateway'
import { AcceptRide } from '../../src/application/usecase/AcceptRide'
import { GetRide } from '../../src/application/usecase/GetRide'
import { RequestRide } from '../../src/application/usecase/RequestRide'
import {
  DatabaseConnection,
  MysqlAdapter,
} from '../../src/infra/database/DatabaseConnection'
import { AccountGatewayHttp } from '../../src/infra/gateway/AccountGatewayHttp'
import {
  RideRepository,
  RideRepositoryDatabase,
} from '../../src/infra/repository/RideRepository'

let rideRepository: RideRepository
let accountGateway: AccountGateway
let connection: DatabaseConnection
let requestRide: RequestRide
let getRide: GetRide
let acceptRide: AcceptRide

beforeAll(() => {
  connection = new MysqlAdapter()
  rideRepository = new RideRepositoryDatabase(connection)
  accountGateway = new AccountGatewayHttp()
  requestRide = new RequestRide(rideRepository, accountGateway)
  getRide = new GetRide(rideRepository, accountGateway)
  acceptRide = new AcceptRide(rideRepository, accountGateway)
})

afterAll(async () => {
  await connection.close()
})

test('Deve aceitar uma corrida', async () => {
  const inputSignupPassenger = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isPassenger: true,
  }
  const outputSignupPassenger =
    await accountGateway.signup(inputSignupPassenger)
  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide)
  const inputSignupDriver = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isDriver: true,
    carPlate: 'ABC1234',
  }
  const outputSignupDriver = await accountGateway.signup(inputSignupDriver)
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await acceptRide.execute(inputAcceptRide)
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.passengerId).toBe(outputSignupPassenger.accountId)
  expect(outputGetRide.passengerName).toBe(inputSignupPassenger.name)
  expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId)
  expect(outputGetRide.rideId).toBe(outputRequestRide.rideId)
  expect(outputGetRide.status).toBe('accepted')
  expect(outputGetRide.date).toBeDefined()
})
