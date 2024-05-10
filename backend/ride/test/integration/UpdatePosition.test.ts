import { AccountGateway } from '../../src/application/gateway/AccountGateway'
import { AcceptRide } from '../../src/application/usecase/AcceptRide'
import { GetPositions } from '../../src/application/usecase/GetPositions'
import { GetRide } from '../../src/application/usecase/GetRide'
import { RequestRide } from '../../src/application/usecase/RequestRide'
import { StartRide } from '../../src/application/usecase/StartRide'
import { UpdatePosition } from '../../src/application/usecase/UpdatePosition'
import {
  DatabaseConnection,
  MysqlAdapter,
} from '../../src/infra/database/DatabaseConnection'
import { AccountGatewayHttp } from '../../src/infra/gateway/AccountGatewayHttp'
import { AxiosAdapter } from '../../src/infra/http/HttpClient'
import {
  PositionRepository,
  PositionRepositoryDatabase,
} from '../../src/infra/repository/PositionRepository'
import {
  RideRepository,
  RideRepositoryDatabase,
} from '../../src/infra/repository/RideRepository'

let rideRepository: RideRepository
let accountGateway: AccountGateway
let positionRepository: PositionRepository
let connection: DatabaseConnection
let requestRide: RequestRide
let getRide: GetRide
let acceptRide: AcceptRide
let startRide: StartRide
let updatePosition: UpdatePosition
let getPositions: GetPositions

beforeAll(() => {
  connection = new MysqlAdapter()
  rideRepository = new RideRepositoryDatabase(connection)
  const httpClient = new AxiosAdapter()
  accountGateway = new AccountGatewayHttp(httpClient)
  positionRepository = new PositionRepositoryDatabase(connection)
  requestRide = new RequestRide(rideRepository, accountGateway)
  getRide = new GetRide(rideRepository, accountGateway)
  acceptRide = new AcceptRide(rideRepository, accountGateway)
  startRide = new StartRide(rideRepository)
  updatePosition = new UpdatePosition(rideRepository, positionRepository)
  getPositions = new GetPositions(positionRepository)
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
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.distance).toBe(10)
  expect(outputGetRide.lastPositionLat).toBe(inputUpdatePosition.lat)
  expect(outputGetRide.lastPositionLong).toBe(inputUpdatePosition.long)
  const outputGetPositions = await getPositions.execute(
    outputRequestRide.rideId,
  )
  expect(outputGetPositions.length).toBe(1)
  const [position] = outputGetPositions
  expect(position.lat).toBe(inputUpdatePosition.lat)
  expect(position.long).toBe(inputUpdatePosition.long)
  expect(position.rideId).toBe(outputRequestRide.rideId)
})
