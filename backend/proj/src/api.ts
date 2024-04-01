import express from 'express'
import cors from 'cors'
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

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
