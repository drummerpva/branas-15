import crypto from 'node:crypto'
import { validateCpf } from './validateCpf'
import { AccountDAO } from './AccountDAO'
import { MailerGateway } from './MailerGateway'

export class Signup {
  constructor(readonly accountDAO: AccountDAO) {}

  async execute(input: any) {
    const existingAccount = await this.accountDAO.getByEmail(input.email)
    if (existingAccount) throw new Error('Account already exists')
    if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error('Invalid name')
    if (!input.email.match(/^(.+)@(.+)$/)) throw new Error('Invalid email')
    if (!validateCpf(input.cpf)) throw new Error('Invalid cpf')
    if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/))
      throw new Error('Invalid car plate')
    input.accountId = crypto.randomUUID()
    await this.accountDAO.save(input)
    const mailerGateway = new MailerGateway()
    await mailerGateway.send(
      'Welcome',
      input.email,
      'Use this link to confirm your account',
    )
    return {
      accountId: input.accountId,
    }
  }
}
