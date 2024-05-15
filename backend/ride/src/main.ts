import { RequestRide } from './application/usecase/RequestRide'
import { GetRide } from './application/usecase/GetRide'
import { RideRepositoryDatabase } from './infra/repository/RideRepository'
import { MysqlAdapter } from './infra/database/DatabaseConnection'
import { MainController } from './infra/http/MainController'
import { ExpressAdapter } from './infra/http/HttpServer'
import { Registry } from './infra/di/Registry'
import { AccountGatewayHttp } from './infra/gateway/AccountGatewayHttp'
import { AxiosAdapter } from './infra/http/HttpClient'
import { ProcessPayment } from './application/usecase/ProcessPayment'
import { QueueController } from './infra/queue/QueueController'
import { RabbitMQAdapter } from './infra/queue/Queue'
import { FinishRide } from './application/usecase/FinishRide'
import { Mediator } from './infra/mediator/Mediator'

async function main() {
  const connection = new MysqlAdapter()
  const rideRepository = new RideRepositoryDatabase(connection)
  const httpClient = new AxiosAdapter()
  const accountGateway = new AccountGatewayHttp(httpClient)
  const requestRide = new RequestRide(rideRepository, accountGateway)
  const getRide = new GetRide(rideRepository, accountGateway)
  const httpServer = new ExpressAdapter()
  const processPayment = new ProcessPayment(rideRepository)
  const mediator = new Mediator()
  mediator.register('rideCompleted', async (input: any) => {
    await processPayment.execute(input.rideId)
  })
  const registry = Registry.getInstance()
  const queue = new RabbitMQAdapter()
  await queue.connect()
  const finishRide = new FinishRide(rideRepository, mediator, queue)
  registry.register('requestRide', requestRide)
  registry.register('getRide', getRide)
  registry.register('processPayment', processPayment)
  registry.register('finishRide', finishRide)
  registry.register('httpServer', httpServer)
  registry.register('queue', queue)

  new QueueController()
  new MainController()
  httpServer.listen(3000)
}

main()
