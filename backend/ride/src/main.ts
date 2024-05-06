import { RequestRide } from './application/usecase/RequestRide'
import { GetRide } from './application/usecase/GetRide'
import { RideRepositoryDatabase } from './infra/repository/RideRepository'
import { MysqlAdapter } from './infra/database/DatabaseConnection'
import { MainController } from './infra/http/MainController'
import { ExpressAdapter } from './infra/http/HttpServer'
import { Registry } from './infra/di/Registry'
import { AccountGatewayHttp } from './infra/gateway/AccountGatewayHttp'

const connection = new MysqlAdapter()
const rideRepository = new RideRepositoryDatabase(connection)
const accountGateway = new AccountGatewayHttp()
const requestRide = new RequestRide(rideRepository, accountGateway)
const getRide = new GetRide(rideRepository, accountGateway)
const httpServer = new ExpressAdapter()

const registry = Registry.getInstance()
registry.register('requestRide', requestRide)
registry.register('getRide', getRide)
registry.register('httpServer', httpServer)

new MainController()
httpServer.listen(3000)
