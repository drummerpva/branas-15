import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    'position',
    (table: Knex.CreateTableBuilder) => {
      table.uuid('position_id').primary()
      table.uuid('ride_id').references('ride_id').inTable('ride')
      table.decimal('lat', 17, 15)
      table.decimal('long', 17, 15)
      table.dateTime('date')
    },
  )
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('position')
}
