import { UseCase } from '../usecase/UseCase'

export class SecurityDecorator implements UseCase {
  constructor(readonly useCase: UseCase) {}

  async execute(input: any): Promise<any> {
    console.log('validating user security token')
    return this.useCase.execute(input)
  }
}
