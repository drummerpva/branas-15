import { randomUUID } from 'node:crypto'
import { MysqlAdapter } from '../../src/infra/database/DatabaseConnection'
import { AccountModel } from '../../src/infra/orm/AccountModel'
import { ORM } from '../../src/infra/orm/ORM'

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
  // const savedAccountModel = await orm.findBy(
  //   AccountModel,
  //   'account_id',
  //   accountId,
  // )
  // expect(savedAccountModel.name).toBe('John Doe')
  await connection.close()
})
