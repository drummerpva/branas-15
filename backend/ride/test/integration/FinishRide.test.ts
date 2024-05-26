import { AccountGateway } from '../../src/application/gateway/AccountGateway'
import { AcceptRide } from '../../src/application/usecase/AcceptRide'
import { FinishRide } from '../../src/application/usecase/FinishRide'
import { GetRide } from '../../src/application/usecase/GetRide'
import { ProcessPayment } from '../../src/application/usecase/ProcessPayment'
import { RequestRide } from '../../src/application/usecase/RequestRide'
import { StartRide } from '../../src/application/usecase/StartRide'
import { UpdatePosition } from '../../src/application/usecase/UpdatePosition'
import {
  DatabaseConnection,
  MysqlAdapter,
} from '../../src/infra/database/DatabaseConnection'
import { AccountGatewayHttp } from '../../src/infra/gateway/AccountGatewayHttp'
import { FetchAdapter } from '../../src/infra/http/HttpClient'
import { Mediator } from '../../src/infra/mediator/Mediator'
import { Queue, RabbitMQAdapter } from '../../src/infra/queue/Queue'
import {
  PositionRepository,
  PositionRepositoryDatabase,
} from '../../src/infra/repository/PositionRepository'
import {
  RideRepository,
  RideRepositoryDatabase,
} from '../../src/infra/repository/RideRepository'
import sinon from 'sinon'

let rideRepository: RideRepository
let accountGateway: AccountGateway
let positionRepository: PositionRepository
let connection: DatabaseConnection
let requestRide: RequestRide
let getRide: GetRide
let acceptRide: AcceptRide
let startRide: StartRide
let updatePosition: UpdatePosition
let finishRide: FinishRide
let processPayment: ProcessPayment
let queue: Queue

beforeAll(async () => {
  connection = new MysqlAdapter()
  rideRepository = new RideRepositoryDatabase(connection)
  const httpClient = new FetchAdapter()
  accountGateway = new AccountGatewayHttp(httpClient)
  positionRepository = new PositionRepositoryDatabase(connection)
  requestRide = new RequestRide(rideRepository, accountGateway)
  getRide = new GetRide(rideRepository, accountGateway)
  acceptRide = new AcceptRide(rideRepository, accountGateway)
  updatePosition = new UpdatePosition(rideRepository, positionRepository)
  processPayment = new ProcessPayment(rideRepository)
  const mediator = new Mediator()
  mediator.register('rideCompleted', async (input: any) => {
    await processPayment.execute(input.rideId)
  })
  queue = new RabbitMQAdapter()
  await queue.connect()
  startRide = new StartRide(rideRepository, queue)
  finishRide = new FinishRide(rideRepository, mediator, queue)
})

afterAll(async () => {
  await connection.close()
})

test('Deve finalizar uma corrida em horário normal', async () => {
  sinon.useFakeTimers(new Date('2024-02-26T13:00:00'))
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
  const inputFinishRide = {
    rideId: outputRequestRide.rideId,
  }
  await finishRide.execute(inputFinishRide)
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.fare).toBe(21)
  expect(outputGetRide.status).toBe('completed')
  sinon.restore()
})
test('Deve finalizar uma corrida em horário adicional noturno', async () => {
  sinon.useFakeTimers(new Date('2024-02-26T23:00:00'))
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
  const inputFinishRide = {
    rideId: outputRequestRide.rideId,
  }
  await finishRide.execute(inputFinishRide)
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.fare).toBe(39)
  expect(outputGetRide.status).toBe('completed')
  sinon.restore()
})
