import mysql from 'mysql2/promise'

export interface AccountDAO {
  save(account: any): Promise<void>
  getByEmail(email: string): Promise<any>
  getById(accountId: string): Promise<any>
}

export class AccountDAODatabase implements AccountDAO {
  constructor() {}

  async save(account: any) {
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
    return account
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
    return account
  }
}

export class AccountDAOMemory implements AccountDAO {
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
