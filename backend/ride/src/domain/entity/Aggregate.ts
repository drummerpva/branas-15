import { DomainEvent } from '../event/DomainEvent'

export class Aggregate {
  listeners: { name: string; callback: Function }[]
  constructor() {
    this.listeners = []
  }

  register(name: string, callback: Function) {
    this.listeners.push({ name, callback })
  }

  async notify(event: DomainEvent) {
    for (const listener of this.listeners) {
      if (listener.name === event.name) await listener.callback(event)
    }
  }
}
