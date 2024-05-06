import { randomUUID } from 'node:crypto'
import { MysqlAdapter } from '../../src/infra/database/DatabaseConnection'
import { AccountModel } from '../../src/infra/orm/AccountModel'
import { ORM } from '../../src/infra/orm/ORM'
import { Account } from '../../src/domain/entity/Account'

test('Deve testar o ORM', async () => {
  const accountId = randomUUID()
  const accountModel = new AccountModel(
    accountId,
    'John Doe',
    'john.doe@gmail.com',
    '111.111.111-11',
    '',
    true,
    false,
  )
  const connection = new MysqlAdapter()
  const orm = new ORM(connection)
  await orm.save(accountModel)
  const savedAccountModel = await orm.findBy(
    AccountModel,
    'account_id',
    accountId,
  )
  expect(savedAccountModel.name).toBe('John Doe')
  expect(savedAccountModel.email).toBe('john.doe@gmail.com')
  expect(savedAccountModel.cpf).toBe('111.111.111-11')
  expect(savedAccountModel.carPlate).toBe('')
  await connection.close()
})
test.skip('Deve testar o ORM com um aggregate real', async () => {
  const accountId = randomUUID()
  const account = Account.create(
    'John Doe',
    'john.doe@gmail.com',
    '987.654.321-00',
    true,
    false,
    '',
  )
  const accountModel = AccountModel.fromAggregate(account)
  const connection = new MysqlAdapter()
  const orm = new ORM(connection)
  await orm.save(accountModel)
  const savedAccountModel = await orm.findBy(
    AccountModel,
    'account_id',
    accountId,
  )
  expect(savedAccountModel.name).toBe('John Doe')
  expect(savedAccountModel.email).toBe('john.doe@gmail.com')
  expect(savedAccountModel.cpf).toBe('111.111.111-11')
  expect(savedAccountModel.carPlate).toBe('')
  await connection.close()
})
