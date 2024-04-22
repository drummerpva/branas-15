import { Account } from '../../domain/entity/Account'
import { DatabaseConnection } from '../database/DatabaseConnection'

export interface PositionRepository {
  save(account: Account): Promise<void>
  getByEmail(email: string): Promise<Account | undefined>
  getById(accountId: string): Promise<Account | undefined>
}

export class PositionRepositoryDatabase implements PositionRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async save(account: Account) {
    await this.connection.query(
      `INSERT INTO account
          (account_id, name, email, cpf, car_plate, is_passenger, is_driver)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        account.accountId,
        account.getName(),
        account.getEmail(),
        account.getCpf(),
        account.getCarPlate(),
        !!account.isPassenger,
        !!account.isDriver,
      ],
    )
  }

  async getByEmail(email: string) {
    const [account] = (await this.connection.query(
      `SELECT * FROM account WHERE email = ?`,
      [email],
    )) as any[]

    if (!account) return
    return Account.restore(
      account.account_id,
      account.name,
      account.email,
      account.cpf,
      account.is_passenger,
      account.is_driver,
      account.car_plate,
    )
  }

  async getById(accountId: string) {
    const [account] = (await this.connection.query(
      'select * from account where account_id = ?',
      [accountId],
    )) as any[]

    if (!account) return
    return Account.restore(
      account.account_id,
      account.name,
      account.email,
      account.cpf,
      account.is_passenger,
      account.is_driver,
      account.car_plate,
    )
  }
}

export class PositionRepositoryMemory implements PositionRepository {
  accounts: any[]
  constructor() {
    this.accounts = []
  }

  async save(account: any): Promise<void> {
    this.accounts.push(account)
  }

  async getByEmail(email: string): Promise<any> {
    return this.accounts.find((account) => account.email === email)
  }

  async getById(accountId: string): Promise<any> {
    return this.accounts.find((account) => account.accountId === accountId)
  }
}
