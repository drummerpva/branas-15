import mysql from 'mysql2/promise'

export interface DatabaseConnection {
  query(statement: string, params: any): Promise<any>
  close(): Promise<void>
}

export class MysqlAdapter implements DatabaseConnection {
  connection: mysql.Pool
  constructor() {
    this.connection = mysql.createPool(String(process.env.DATABASE_URL))
  }

  async query(statement: string, params: any): Promise<any> {
    const [rows] = await this.connection.query(statement, params)
    return rows
  }

  async close(): Promise<void> {
    this.connection.pool.end()
  }
}
