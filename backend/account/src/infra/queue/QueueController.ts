import { Signup } from '../../application/usecase/Signup'
import { inject } from '../di/Registry'
import { Queue } from './Queue'

export class QueueController {
  @inject('queue')
  queue?: Queue

  @inject('signup')
  signup?: Signup

  constructor() {
    console.log('Queue Consumer started')
    this.queue?.consume('signup', async (input: any) => {
      await this.signup?.execute(input)
    })
  }
}
