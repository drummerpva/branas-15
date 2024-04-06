import express from 'express'
import cors from 'cors'
import crypto from 'node:crypto'
import mysql from 'mysql2/promise'

import { AccountDAODatabase } from './AccountDAO'
import { Signup } from './Signup'
import { GetAccount } from './GetAccount'
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
  const rideId = crypto.randomUUID()
  const connection = mysql.createPool(
    'mysql://root:root@localhost:3306/branas-15',
  )
  const [[account]] = (await connection.query(
    `SELECT * FROM account WHERE account_id = ?`,
    [req.body.passengerId],
  )) as any[]
  if (!account.is_passenger) {
    connection.pool.end()
    return res.status(422).json({ message: 'Account is not from a passenger' })
  }
  const [[activeRide]] = (await connection.query(
    `SELECT * FROM ride WHERE passenger_id = ? AND status IN('requested', 'accepted')`,
    [req.body.passengerId],
  )) as any[]
  if (activeRide) {
    connection.pool.end()
    return res.status(422).json({ message: 'Passenger has an active ride' })
  }

  await connection.query(
    `INSERT INTO ride
    (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date)
    VALUES (?,?,?,?,?,?,?,?)`,
    [
      rideId,
      req.body.passengerId,
      req.body.fromLat,
      req.body.fromLong,
      req.body.toLat,
      req.body.toLong,
      'requested',
      new Date(),
    ],
  )
  connection.pool.end()
  res.json({ rideId })
})

app.get('/rides/:rideId', async (req, res) => {
  const connection = mysql.createPool(
    'mysql://root:root@localhost:3306/branas-15',
  )
  const [[ride]] = (await connection.query(
    `SELECT * FROM ride WHERE ride_id = ?`,
    [req.params.rideId],
  )) as any[]
  connection.pool.end()
  res.json(ride)
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
