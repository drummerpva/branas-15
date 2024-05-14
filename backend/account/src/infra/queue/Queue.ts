import amqp from 'amqplib'

export interface Queue {
  connect(): Promise<void>
  consume(queue: string, callback: Function): Promise<void>
  publish(queue: string, message: any): Promise<void>
}

export class RabbitMQAdapter implements Queue {
  private connection?: amqp.Connection

  async connect(): Promise<void> {
    this.connection = await amqp.connect('amqp://localhost')
  }

  async consume(queue: string, callback: Function): Promise<void> {
    const channel = await this.connection?.createChannel()
    if (!channel) throw new Error('Channel not found')
    await channel.assertQueue(queue, { durable: true })
    await channel.consume(queue, async (message: any) => {
      const input = JSON.parse(message.content.toString())
      try {
        await callback(input)
        channel.ack(message)
      } catch (error: any) {
        console.log(error.message)
      }
    })
  }

  async publish(queue: string, data: any): Promise<void> {
    const channel = await this.connection?.createChannel()
    if (!channel) throw new Error('Channel not found')
    await channel.assertQueue(queue, { durable: true })
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)))
  }
}
