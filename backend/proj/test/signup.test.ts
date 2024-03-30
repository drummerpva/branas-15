import { getAccount } from '../src/getAccount'
import { signup } from '../src/signup'

test('Deve criar a conta de um passageiro', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isPassenger: true,
  }
  const outputSignup = await signup(input)
  expect(outputSignup.accountId).toBeTruthy()
  const outputGetAccount = await getAccount(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(outputGetAccount.is_passenger).toBeTruthy()
})
test('Deve criar a conta de um motorista', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isDriver: true,
    carPlate: 'ABC1234',
  }
  const outputSignup = await signup(input)
  expect(outputSignup.accountId).toBeTruthy()
  const outputGetAccount = await getAccount(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(outputGetAccount.car_plate).toBe(input.carPlate)
  expect(outputGetAccount.is_driver).toBeTruthy()
})
test('Não deve criar um passageiro se o nome for inválido', async () => {
  const input = {
    name: 'John',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isPassenger: true,
  }
  await expect(() => signup(input)).rejects.toThrowError('Invalid name')
})
test('Não deve criar um passageiro se o email for inválido', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}`,
    cpf: '987.654.321-00',
    isPassenger: true,
  }
  await expect(() => signup(input)).rejects.toThrowError('Invalid email')
})
test('Não deve criar um passageiro se o cpf for inválido', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-11',
    isPassenger: true,
  }
  await expect(() => signup(input)).rejects.toThrowError('Invalid cpf')
})
test('Não deve criar um motorista se a placa for inválida', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isDriver: true,
    carPlate: 'ABC123',
  }
  await expect(() => signup(input)).rejects.toThrowError('Invalid car plate')
})
test('Não deve criar um usuário se o e-mail já for cadastrado', async () => {
  const email = `john.doe${Math.random()}@mail.com`
  const input = {
    name: 'John Doe',
    email,
    cpf: '987.654.321-00',
    isPassenger: true,
  }
  await signup(input)
  await expect(() => signup(input)).rejects.toThrowError(
    'Account already exists',
  )
})
