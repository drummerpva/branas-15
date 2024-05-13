import amqp from 'amqplib'
import { randomUUID } from 'node:crypto'

async function main() {
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel()
  await channel.assertQueue('test', { durable: true })
  const input = {
    id: randomUUID(),
  }
  channel.sendToQueue('test', Buffer.from(JSON.stringify(input)))
}

main()
