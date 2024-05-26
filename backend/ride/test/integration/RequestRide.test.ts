import { LogDecorator } from '../../src/application/decorator/LogDecorator'
import { SecurityDecorator } from '../../src/application/decorator/SecurityDecorator'
import { AccountGateway } from '../../src/application/gateway/AccountGateway'
import { GetRide } from '../../src/application/usecase/GetRide'
import { RequestRide } from '../../src/application/usecase/RequestRide'
import { UseCase } from '../../src/application/usecase/UseCase'
import {
  DatabaseConnection,
  MysqlAdapter,
} from '../../src/infra/database/DatabaseConnection'
import { AccountGatewayHttp } from '../../src/infra/gateway/AccountGatewayHttp'
import { AxiosAdapter } from '../../src/infra/http/HttpClient'
import {
  RideRepository,
  RideRepositoryDatabase,
} from '../../src/infra/repository/RideRepository'

let rideRepository: RideRepository
let accountGateway: AccountGateway
let connection: DatabaseConnection
let requestRide: UseCase
let getRide: GetRide

beforeAll(() => {
  connection = new MysqlAdapter()
  const httpClient = new AxiosAdapter()
  accountGateway = new AccountGatewayHttp(httpClient)
  rideRepository = new RideRepositoryDatabase(connection)
  requestRide = new SecurityDecorator(
    new LogDecorator(new RequestRide(rideRepository, accountGateway)),
  )
  getRide = new GetRide(rideRepository, accountGateway)
})

test('Deve solicitar uma corrida', async () => {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isPassenger: true,
  }
  const outputSignup = await accountGateway.signup(inputSignup)
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide)
  expect(outputRequestRide.rideId).toBeDefined()
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.passengerId).toBe(outputSignup.accountId)
  expect(outputGetRide.passengerName).toBe(inputSignup.name)
  expect(outputGetRide.rideId).toBe(outputRequestRide.rideId)
  expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat)
  expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong)
  expect(outputGetRide.toLat).toBe(inputRequestRide.toLat)
  expect(outputGetRide.toLong).toBe(inputRequestRide.toLong)
  expect(outputGetRide.status).toBe('requested')
  expect(outputGetRide.date).toBeDefined()
})
