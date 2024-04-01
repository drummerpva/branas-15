import axios from 'axios'

test('Deve criar a conta de um motorista', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isDriver: true,
    carPlate: 'ABC1234',
  }
  const responseSignup = await axios.post('http://localhost:3000/signup', input)
  const outputSignup = responseSignup.data
  expect(outputSignup.accountId).toBeTruthy()
  const responseGetAccount = await axios.get(
    `http://localhost:3000/accounts/${outputSignup.accountId}`,
  )
  const outputGetAccount = responseGetAccount.data
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(outputGetAccount.car_plate).toBe(input.carPlate)
  expect(outputGetAccount.is_driver).toBeTruthy()
})
