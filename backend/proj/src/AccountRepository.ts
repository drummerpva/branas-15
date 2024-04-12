import mysql from 'mysql2/promise'
import { Account } from './Account'

export interface AccountRepository {
  save(account: Account): Promise<void>
  getByEmail(email: string): Promise<Account | undefined>
  getById(accountId: string): Promise<Account | undefined>
}

export class AccountRepositoryDatabase implements AccountRepository {
  constructor() {}

  async save(account: Account) {
    const connection = mysql.createPool(
      'mysql://root:root@localhost:3306/branas-15',
    )
    await connection.query(
      `INSERT INTO account 
          (account_id, name, email, cpf, car_plate, is_passenger, is_driver) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        account.accountId,
        account.name,
        account.email,
        account.cpf,
        account.carPlate,
        !!account.isPassenger,
        !!account.isDriver,
      ],
    )
    connection.pool.end()
  }

  async getByEmail(email: string) {
    const connection = mysql.createPool(
      'mysql://root:root@localhost:3306/branas-15',
    )
    const [[account]] = (await connection.query(
      `SELECT * FROM account WHERE email = ?`,
      [email],
    )) as any[]
    connection.pool.end()
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
    const connection = mysql.createPool(
      'mysql://root:root@localhost:3306/branas-15',
    )
    const [[account]] = (await connection.query(
      'select * from account where account_id = ?',
      [accountId],
    )) as any[]
    connection.pool.end()
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

export class AccountRepositoryMemory implements AccountRepository {
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
