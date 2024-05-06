import { AccountRepositoryDatabase } from './infra/repository/AccountRepository'
import { Signup } from './application/usecase/Signup'
import { GetAccount } from './application/usecase/GetAccount'
import { MailerGatewayConsole } from './infra/gateway/MailerGateway'
import { MysqlAdapter } from './infra/database/DatabaseConnection'
import { MainController } from './infra/http/MainController'
import { ExpressAdapter } from './infra/http/HttpServer'
import { Registry } from './infra/di/Registry'

const connection = new MysqlAdapter()
const accountRepository = new AccountRepositoryDatabase(connection)
const mailerGateway = new MailerGatewayConsole()
const signup = new Signup(accountRepository, mailerGateway)
const getAccount = new GetAccount(accountRepository)
const httpServer = new ExpressAdapter()

const registry = Registry.getInstance()
registry.register('signup', signup)
registry.register('getAccount', getAccount)
registry.register('httpServer', httpServer)

new MainController()
httpServer.listen(3001)
