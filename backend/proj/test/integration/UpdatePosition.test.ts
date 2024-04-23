import { AcceptRide } from '../../src/application/usecase/AcceptRide'
import { GetRide } from '../../src/application/usecase/GetRide'
import { RequestRide } from '../../src/application/usecase/RequestRide'
import { Signup } from '../../src/application/usecase/Signup'
import { StartRide } from '../../src/application/usecase/StartRide'
import { UpdatePosition } from '../../src/application/usecase/UpdatePosition'
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
  PositionRepository,
  PositionRepositoryDatabase,
} from '../../src/infra/repository/PositionRepository'
import {
  RideRepository,
  RideRepositoryDatabase,
} from '../../src/infra/repository/RideRepository'

let rideRepository: RideRepository
let accountRepository: AccountRepository
let positionRepository: PositionRepository
let connection: DatabaseConnection
let mailerGateway: MailerGateway
let requestRide: RequestRide
let signup: Signup
let getRide: GetRide
let acceptRide: AcceptRide
let startRide: StartRide
let updatePosition: UpdatePosition

beforeAll(() => {
  connection = new MysqlAdapter()
  mailerGateway = new MailerGatewayConsole()
  rideRepository = new RideRepositoryDatabase(connection)
  accountRepository = new AccountRepositoryDatabase(connection)
  positionRepository = new PositionRepositoryDatabase(connection)
  requestRide = new RequestRide(rideRepository, accountRepository)
  signup = new Signup(accountRepository, mailerGateway)
  getRide = new GetRide(rideRepository, accountRepository)
  acceptRide = new AcceptRide(rideRepository, accountRepository)
  startRide = new StartRide(rideRepository)
  updatePosition = new UpdatePosition(rideRepository, positionRepository)
})

afterAll(async () => {
  await connection.close()
})

test('Deve atualizar a posição', async () => {
  const inputSignupPassenger = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isPassenger: true,
  }
  const outputSignupPassenger = await signup.execute(inputSignupPassenger)
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
  const outputSignupDriver = await signup.execute(inputSignupDriver)
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await acceptRide.execute(inputAcceptRide)
  const inputStartRide = {
    rideId: outputRequestRide.rideId,
  }
  await startRide.execute(inputStartRide)
  const inputUpdatePosition = {
    rideId: outputRequestRide.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476,
  }
  await updatePosition.execute(inputUpdatePosition)
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.distance).toBe(10)
  expect(outputGetRide.lastPositionLat).toBe(inputUpdatePosition.lat)
  expect(outputGetRide.lastPositionLong).toBe(inputUpdatePosition.long)
})
