import { GetRide } from '../../src/application/usecase/GetRide'
import { RequestRide } from '../../src/application/usecase/RequestRide'
import { Signup } from '../../src/application/usecase/Signup'
import {
  DatabaseConnection,
  MysqlAdapter,
} from '../../src/infra/database/DatabaseConnection'
import {
  MailerGateway,
  MailerGatewayConsole,
} from '../../src/infra/gateway/MailerGateway'
import {
  AccountRepository,
  AccountRepositoryDatabase,
} from '../../src/infra/repository/AccountRepository'
import {
  RideRepository,
  RideRepositoryDatabase,
} from '../../src/infra/repository/RideRepository'

let rideRepository: RideRepository
let accountRepository: AccountRepository
let connection: DatabaseConnection
let mailerGateway: MailerGateway
let requestRide: RequestRide
let signup: Signup
let getRide: GetRide

beforeAll(() => {
  connection = new MysqlAdapter()
  mailerGateway = new MailerGatewayConsole()
  rideRepository = new RideRepositoryDatabase(connection)
  accountRepository = new AccountRepositoryDatabase(connection)
  requestRide = new RequestRide(rideRepository, accountRepository)
  signup = new Signup(accountRepository, mailerGateway)
  getRide = new GetRide(rideRepository, accountRepository)
})

test('Deve solicitar uma corrida', async () => {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isPassenger: true,
  }
  const outputSignup = await signup.execute(inputSignup)
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
