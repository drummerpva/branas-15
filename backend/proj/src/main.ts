import { AccountRepositoryDatabase } from './infra/repository/AccountRepository'
import { Signup } from './application/usecase/Signup'
import { GetAccount } from './application/usecase/GetAccount'
import { RequestRide } from './application/usecase/RequestRide'
import { GetRide } from './application/usecase/GetRide'
import { MailerGatewayConsole } from './infra/gateway/MailerGateway'
import { RideRepositoryDatabase } from './infra/repository/RideRepository'
import { MysqlAdapter } from './infra/database/DatabaseConnection'
import { MainController } from './infra/http/MainController'
import { ExpressAdapter } from './infra/http/HttpServer'

const connection = new MysqlAdapter()
const accountRepository = new AccountRepositoryDatabase(connection)
const rideRepository = new RideRepositoryDatabase(connection)
const mailerGateway = new MailerGatewayConsole()
const signup = new Signup(accountRepository, mailerGateway)
const getAccount = new GetAccount(accountRepository)
const requestRide = new RequestRide(rideRepository, accountRepository)
const getRide = new GetRide(rideRepository, accountRepository)
const httpServer = new ExpressAdapter()
new MainController(httpServer, signup, getAccount, requestRide, getRide)
httpServer.listen(3000)
