import { DatabaseConnection } from '../database/DatabaseConnection'

export class ORM {
  constructor(readonly connection: DatabaseConnection) {}

  async save(model: Model): Promise<void> {
    const columns = model.columns.map((column: any) => column.column).join(',')
    const params = model.columns.map(() => '?').join(',')
    const query = `INSERT INTO ${model.table} (${columns}) VALUES (${params})`
    const values = model.columns.map((column: any) => model[column.property])
    await this.connection.query(query, values)
  }
}

export class Model {
  declare schema: string
  declare table: string
  declare columns: { property: string; column: string; pk: boolean }[];
  [key: string]: any
}

export function model(schema: string, table: string) {
  return function (target: any) {
    target.prototype.schema = schema
    target.prototype.table = table
  }
}

export function column(name: string, pk: boolean = false) {
  return function (target: any, propertyKey: string) {
    if (!target.columns) {
      target.columns = []
    }
    target.columns.push({ property: propertyKey, column: name, pk })
  }
}
