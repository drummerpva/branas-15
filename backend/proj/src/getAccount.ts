import mysql from 'mysql2/promise'

export async function getAccount(accountId: string): Promise<any> {
  const connection = mysql.createPool(
    'mysql://root:root@localhost:3306/branas-15',
  )
  try {
    const [[account]] = (await connection.query(
      'select * from account where account_id = ?',
      [accountId],
    )) as any[]
    return account
  } finally {
    connection.pool.end()
  }
}
