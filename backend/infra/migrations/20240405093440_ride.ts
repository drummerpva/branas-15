import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('ride', (table: Knex.CreateTableBuilder) => {
    table.uuid('ride_id').primary()
    table.uuid('passenger_id').references('account_id').inTable('account')
    table.uuid('driver_id').references('account_id').inTable('account')
    table.decimal('fare', 15, 3)
    table.decimal('distance', 15, 3)
    table.string('status')
    table.decimal('from_lat', 17, 15)
    table.decimal('from_long', 17, 15)
    table.decimal('to_lat', 17, 15)
    table.decimal('to_long', 17, 15)
    table.decimal('last_lat', 17, 15)
    table.decimal('last_long', 17, 15)
    table.dateTime('date')
    table.timestamp('started_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('ride')
}
