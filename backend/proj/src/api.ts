import express from 'express'
import cors from 'cors'

import { AccountRepositoryDatabase } from './AccountRepository'
import { Signup } from './Signup'
import { GetAccount } from './GetAccount'
import { RequestRide } from './RequestRide'
import { GetRide } from './GetRide'
import { MailerGatewayConsole } from './MailerGateway'
import { RideRepositoryDatabase } from './RideRepository'
const app = express()
app.use(cors())
app.use(express.json())

app.post('/signup', async (req, res) => {
  const accountRepository = new AccountRepositoryDatabase()
  const mailerGateway = new MailerGatewayConsole()
  const signup = new Signup(accountRepository, mailerGateway)
  const output = await signup.execute(req.body)
  res.json(output)
})

app.get('/accounts/:accountId', async (req, res) => {
  const accountRepository = new AccountRepositoryDatabase()
  const getAccount = new GetAccount(accountRepository)
  const output = await getAccount.execute(req.params.accountId)
  res.json(output)
})

app.post('/request_ride', async (req, res) => {
  try {
    const accountRepository = new AccountRepositoryDatabase()
    const rideRepository = new RideRepositoryDatabase()
    const requestRide = new RequestRide(rideRepository, accountRepository)
    const output = await requestRide.execute(req.body)
    res.json(output)
  } catch (error: any) {
    res.status(422).json({ message: error.message })
  }
})

app.get('/rides/:rideId', async (req, res) => {
  const rideRepository = new RideRepositoryDatabase()
  const getRide = new GetRide(rideRepository)
  const ride = await getRide.execute(req.params.rideId)
  res.json(ride)
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
