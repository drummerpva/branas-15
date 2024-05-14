import { AccountRepositoryDatabase } from './infra/repository/AccountRepository'
import { Signup } from './application/usecase/Signup'
import { GetAccount } from './application/usecase/GetAccount'
import { MailerGatewayConsole } from './infra/gateway/MailerGateway'
import { MysqlAdapter } from './infra/database/DatabaseConnection'
import { MainController } from './infra/http/MainController'
import { ExpressAdapter } from './infra/http/HttpServer'
import { Registry } from './infra/di/Registry'
import { RabbitMQAdapter } from './infra/queue/Queue'
import { QueueController } from './infra/queue/QueueController'

async function main() {
  const connection = new MysqlAdapter()
  const accountRepository = new AccountRepositoryDatabase(connection)
  const mailerGateway = new MailerGatewayConsole()
  const signup = new Signup(accountRepository, mailerGateway)
  const getAccount = new GetAccount(accountRepository)
  const httpServer = new ExpressAdapter()
  const queue = new RabbitMQAdapter()
  await queue.connect()

  const registry = Registry.getInstance()
  registry.register('signup', signup)
  registry.register('getAccount', getAccount)
  registry.register('httpServer', httpServer)
  registry.register('queue', queue)

  new MainController()
  new QueueController()
  httpServer.listen(3001)
}

main()
