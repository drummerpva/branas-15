import amqp from 'amqplib'

async function main() {
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel()
  await channel.assertQueue('test', { durable: true })
  await channel.consume('test', async (message: any) => {
    const input = JSON.parse(message.content.toString())
    console.log(input)
    channel.ack(message)
  })
}

main()
