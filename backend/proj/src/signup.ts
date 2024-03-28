import crypto from 'node:crypto'
import mysql from 'mysql2/promise'
import { validateCpf } from './validateCpf'

export async function signup(input: any): Promise<any> {
  const connection = mysql.createPool(
    'mysql://root:root@localhost:3306/branas-15',
  )
  try {
    const id = crypto.randomUUID()

    const [[acc]] = (await connection.query(
      'select * from account where email = ?',
      [input.email],
    )) as any[]
    if (!acc) {
      if (input.name.match(/[a-zA-Z] [a-zA-Z]+/)) {
        if (input.email.match(/^(.+)@(.+)$/)) {
          if (validateCpf(input.cpf)) {
            if (input.isDriver) {
              if (input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) {
                await connection.query(
                  'insert into account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values (?, ?, ?, ?, ?, ?, ?)',
                  [
                    id,
                    input.name,
                    input.email,
                    input.cpf,
                    input.carPlate,
                    !!input.isPassenger,
                    !!input.isDriver,
                  ],
                )

                const obj = {
                  accountId: id,
                }
                return obj
              } else {
                // invalid car plate
                return -5
              }
            } else {
              await connection.query(
                'insert into account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values (?, ?, ?, ?, ?, ?, ?)',
                [
                  id,
                  input.name,
                  input.email,
                  input.cpf,
                  input.carPlate,
                  !!input.isPassenger,
                  !!input.isDriver,
                ],
              )

              const obj = {
                accountId: id,
              }
              return obj
            }
          } else {
            // invalid cpf
            return -1
          }
        } else {
          // invalid email
          return -2
        }
      } else {
        // invalid name
        return -3
      }
    } else {
      // already exists
      return -4
    }
  } finally {
    connection.pool.end()
  }
}
