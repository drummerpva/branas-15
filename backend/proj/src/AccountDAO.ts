import mysql from 'mysql2/promise'

export class AccountDAO {
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
