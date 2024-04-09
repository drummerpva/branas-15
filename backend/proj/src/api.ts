import express from 'express'
import cors from 'cors'

import { AccountDAODatabase } from './AccountDAO'
import { Signup } from './Signup'
import { GetAccount } from './GetAccount'
import { RequestRide } from './RequestRide'
import { RideDAODatabase } from './RideDAO'
import { GetRide } from './GetRide'
const app = express()
app.use(cors())
app.use(express.json())

app.post('/signup', async (req, res) => {
  const accountDAO = new AccountDAODatabase()
  const signup = new Signup(accountDAO)
  const output = await signup.execute(req.body)
  res.json(output)
})

app.get('/accounts/:accountId', async (req, res) => {
  const accountDAO = new AccountDAODatabase()
  const getAccount = new GetAccount(accountDAO)
  const output = await getAccount.execute(req.params.accountId)
  res.json(output)
})

app.post('/request_ride', async (req, res) => {
  try {
    const accountDAO = new AccountDAODatabase()
    const rideDAO = new RideDAODatabase()
    const requestRide = new RequestRide(rideDAO, accountDAO)
    const output = await requestRide.execute(req.body)
    res.json(output)
  } catch (error: any) {
    res.status(422).json({ message: error.message })
  }
})

app.get('/rides/:rideId', async (req, res) => {
  const rideDAO = new RideDAODatabase()
  const getRide = new GetRide(rideDAO)
  const ride = await getRide.execute(req.params.rideId)
  res.json(ride)
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
