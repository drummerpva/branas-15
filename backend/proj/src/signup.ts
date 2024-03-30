import crypto from 'node:crypto'
import mysql from 'mysql2/promise'
import { validateCpf } from './validateCpf'

export async function signup(input: any): Promise<any> {
  const connection = mysql.createPool(
    'mysql://root:root@localhost:3306/branas-15',
  )
  try {
    const [[existingAccount]] = (await connection.query(
      `SELECT * FROM account WHERE email = ?`,
      [input.email],
    )) as any[]
    if (existingAccount) throw new Error('Account already exists')
    if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error('Invalid name')
    if (!input.email.match(/^(.+)@(.+)$/)) throw new Error('Invalid email')
    if (!validateCpf(input.cpf)) throw new Error('Invalid cpf')
    if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/))
      throw new Error('Invalid car plate')
    const accountId = crypto.randomUUID()
    await connection.query(
      `INSERT INTO account 
          (account_id, name, email, cpf, car_plate, is_passenger, is_driver) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        accountId,
        input.name,
        input.email,
        input.cpf,
        input.carPlate,
        !!input.isPassenger,
        !!input.isDriver,
      ],
    )
    return {
      accountId,
    }
  } finally {
    connection.pool.end()
  }
}
