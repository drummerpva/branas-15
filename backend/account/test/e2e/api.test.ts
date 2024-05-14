import axios from 'axios'
axios.defaults.validateStatus = () => true

test('Deve criar a conta de um motorista', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isDriver: true,
    carPlate: 'ABC1234',
  }
  const responseSignup = await axios.post('http://localhost:3001/signup', input)
  const outputSignup = responseSignup.data
  expect(outputSignup.accountId).toBeTruthy()
  const responseGetAccount = await axios.get(
    `http://localhost:3001/accounts/${outputSignup.accountId}`,
  )
  const outputGetAccount = responseGetAccount.data
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(outputGetAccount.carPlate).toBe(input.carPlate)
  expect(outputGetAccount.isDriver).toBeTruthy()
})
test('Deve criar a conta de um passageiro', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isPassenger: true,
  }
  const responseSignup = await axios.post('http://localhost:3001/signup', input)
  const outputSignup = responseSignup.data
  expect(outputSignup.accountId).toBeTruthy()
  const responseGetAccount = await axios.get(
    `http://localhost:3001/accounts/${outputSignup.accountId}`,
  )
  const outputGetAccount = responseGetAccount.data
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(outputGetAccount.isDriver).toBeFalsy()
  expect(outputGetAccount.isPassenger).toBeTruthy()
})
test('Deve criar a conta de um passageiro assíncrona', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isPassenger: true,
  }
  await axios.post('http://localhost:3001/signupAsync', input)
})
