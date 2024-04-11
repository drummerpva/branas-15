import { AccountDAO } from './AccountDAO'
import { MailerGateway } from './MailerGateway'
import { Account } from './Account'

export class Signup {
  constructor(
    readonly accountDAO: AccountDAO,
    readonly mailerGateway: MailerGateway,
  ) {}

  async execute(input: any) {
    const existingAccount = await this.accountDAO.getByEmail(input.email)
    if (existingAccount) throw new Error('Account already exists')
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.isPassenger,
      input.isDriver,
      input.carPlate,
    )
    await this.accountDAO.save(account)
    await this.mailerGateway.send(
      'Welcome',
      account.email,
      'Use this link to confirm your account',
    )
    return {
      accountId: account.accountId,
    }
  }
}
