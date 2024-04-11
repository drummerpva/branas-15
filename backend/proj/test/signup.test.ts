import { AccountDAO, AccountDAODatabase } from '../src/AccountDAO'
import sinon from 'sinon'
import { GetAccount } from '../src/GetAccount'
import { Signup } from '../src/Signup'
import { MailerGateway } from '../src/MailerGateway'
import { Account } from '../src/Account'

let signup: any
let getAccount: any
let accountDAO: AccountDAO
let mailerGateway: MailerGateway
beforeAll(() => {
  accountDAO = new AccountDAODatabase()
  // accountDAO = new AccountDAOMemory()
  mailerGateway = {
    send: async () => {},
  }
  signup = new Signup(accountDAO, mailerGateway)
  getAccount = new GetAccount(accountDAO)
})

test('Deve criar a conta de um passageiro', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isPassenger: true,
  }
  const outputSignup = await signup.execute(input)
  expect(outputSignup.accountId).toBeTruthy()
  const outputGetAccount = await getAccount.execute(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(outputGetAccount.isPassenger).toBeTruthy()
})
test('Deve criar a conta de um motorista', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isDriver: true,
    carPlate: 'ABC1234',
  }
  const outputSignup = await signup.execute(input)
  expect(outputSignup.accountId).toBeTruthy()
  const outputGetAccount = await getAccount.execute(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(outputGetAccount.carPlate).toBe(input.carPlate)
  expect(outputGetAccount.isDriver).toBeTruthy()
})
test('Não deve criar um passageiro se o nome for inválido', async () => {
  const input = {
    name: 'John',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isPassenger: true,
  }
  await expect(() => signup.execute(input)).rejects.toThrowError('Invalid name')
})
test('Não deve criar um passageiro se o email for inválido', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}`,
    cpf: '987.654.321-00',
    isPassenger: true,
  }
  await expect(() => signup.execute(input)).rejects.toThrowError(
    'Invalid email',
  )
})
test('Não deve criar um passageiro se o cpf for inválido', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-11',
    isPassenger: true,
  }
  await expect(() => signup.execute(input)).rejects.toThrowError('Invalid cpf')
})
test('Não deve criar um motorista se a placa for inválida', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isDriver: true,
    carPlate: 'ABC123',
  }
  await expect(() => signup.execute(input)).rejects.toThrowError(
    'Invalid car plate',
  )
})
test('Não deve criar um usuário se o e-mail já for cadastrado', async () => {
  const email = `john.doe${Math.random()}@mail.com`
  const input = {
    name: 'John Doe',
    email,
    cpf: '987.654.321-00',
    isPassenger: true,
  }
  await signup.execute(input)
  await expect(() => signup.execute(input)).rejects.toThrowError(
    'Account already exists',
  )
})
test('Deve criar a conta de um passageiro stub', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isPassenger: true,
  }

  sinon.stub(AccountDAODatabase.prototype, 'save').resolves()
  sinon.stub(AccountDAODatabase.prototype, 'getByEmail').resolves(undefined)
  sinon.stub(AccountDAODatabase.prototype, 'getById').resolves(input as Account)

  const outputSignup = await signup.execute(input)
  expect(outputSignup.accountId).toBeTruthy()
  const outputGetAccount = await getAccount.execute(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  sinon.restore()
})
test('Deve criar a conta de um passageiro spy', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isPassenger: true,
  }

  const saveSpy = sinon.spy(AccountDAODatabase.prototype, 'save')
  // const mailerSpy = sinon.spy(MailerGateway.prototype, 'send')
  const mailerSpy = sinon.spy(mailerGateway, 'send')

  const outputSignup = await signup.execute(input)
  expect(outputSignup.accountId).toBeTruthy()
  const outputGetAccount = await getAccount.execute(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(saveSpy.calledOnce).toBeTruthy()
  // expect(saveSpy.calledWith(input)).toBeTruthy()
  expect(mailerSpy.calledOnce).toBeTruthy()
  expect(
    mailerSpy.calledWith(
      'Welcome',
      input.email,
      'Use this link to confirm your account',
    ),
  ).toBeTruthy()
  sinon.restore()
})
test('Deve criar a conta de um passageiro mock', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isPassenger: true,
  }

  const mailerMock = sinon
    // .mock(MailerGateway.prototype)
    .mock(mailerGateway)
    .expects('send')
    .once()
    .withArgs('Welcome', input.email, 'Use this link to confirm your account')

  const outputSignup = await signup.execute(input)
  expect(outputSignup.accountId).toBeTruthy()
  const outputGetAccount = await getAccount.execute(outputSignup.accountId)
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  mailerMock.verify()
  sinon.restore()
})
