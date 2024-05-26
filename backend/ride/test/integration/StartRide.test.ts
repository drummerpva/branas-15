import { AccountGateway } from '../../src/application/gateway/AccountGateway'
import { UpdateRideProjectionHandler } from '../../src/application/handler/UpdateRideProjectionHandler'
import { GetRideProjectionQuery } from '../../src/application/query/GetRideProjectionQuery'
import { GetRideQuery } from '../../src/application/query/GetRideQuery'
import { AcceptRide } from '../../src/application/usecase/AcceptRide'
import { GetRide } from '../../src/application/usecase/GetRide'
import { RequestRide } from '../../src/application/usecase/RequestRide'
import { StartRide } from '../../src/application/usecase/StartRide'
import {
  DatabaseConnection,
  MysqlAdapter,
} from '../../src/infra/database/DatabaseConnection'
import { AccountGatewayHttp } from '../../src/infra/gateway/AccountGatewayHttp'
import { AxiosAdapter } from '../../src/infra/http/HttpClient'
import { Queue, RabbitMQAdapter } from '../../src/infra/queue/Queue'
import {
  RideRepository,
  RideRepositoryDatabase,
} from '../../src/infra/repository/RideRepository'
import { setTimeout as sleep } from 'node:timers/promises'

let rideRepository: RideRepository
let accountGateway: AccountGateway
let connection: DatabaseConnection
let requestRide: RequestRide
let getRide: GetRide
let acceptRide: AcceptRide
let startRide: StartRide
let getRideQuery: GetRideQuery
let updateRideProjectionHandler: UpdateRideProjectionHandler
let getRideProjectionQuery: GetRideProjectionQuery
let queue: Queue

beforeAll(async () => {
  connection = new MysqlAdapter()
  rideRepository = new RideRepositoryDatabase(connection)
  const httpClient = new AxiosAdapter()
  accountGateway = new AccountGatewayHttp(httpClient)
  requestRide = new RequestRide(rideRepository, accountGateway)
  getRide = new GetRide(rideRepository, accountGateway)
  acceptRide = new AcceptRide(rideRepository, accountGateway)
  queue = new RabbitMQAdapter()
  await queue.connect()
  startRide = new StartRide(rideRepository, queue)
  getRideQuery = new GetRideQuery(connection)
  updateRideProjectionHandler = new UpdateRideProjectionHandler(connection)
  getRideProjectionQuery = new GetRideProjectionQuery(connection)
})

afterAll(async () => {
  await connection.close()
})

test('Deve Iniciar uma corrida', async () => {
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
  // const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  // expect(outputGetRide.status).toBe('in_progress')
  // const outputGetRideQuery = await getRideQuery.execute(
  //   outputRequestRide.rideId,
  // )
  // expect(outputGetRideQuery.status).toBe('in_progress')
  // await updateRideProjectionHandler.execute(outputRequestRide.rideId)
  await sleep(100)
  const outputGetRideProjectionQuery = await getRideProjectionQuery.execute(
    outputRequestRide.rideId,
  )
  expect(outputGetRideProjectionQuery.status).toBe('in_progress')
  console.log(outputGetRideProjectionQuery)
})
