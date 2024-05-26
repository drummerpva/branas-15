import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('ride_projection', (table) => {
    table.uuid('ride_id').primary()
    table.string('status')
    table.date('date')
    table.decimal('fare', 15, 3)
    table.decimal('distance', 15, 3)
    table.string('passenger_name')
    table.string('passenger_email')
    table.string('driver_name')
    table.string('driver_email')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('ride_projection')
}
