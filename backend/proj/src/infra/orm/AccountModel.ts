import { Model, column, model } from './ORM'

@model('branas-15', 'account')
export class AccountModel extends Model {
  @column('account_id', true)
  accountId: string

  @column('name')
  name: string

  @column('email')
  email: string

  @column('cpf')
  cpf: string

  @column('car_plate')
  carPlate: string

  @column('is_passenger')
  isPassenger: boolean

  @column('is_driver')
  isDriver: boolean

  constructor(
    accountId: string,
    name: string,
    email: string,
    cpf: string,
    carPlate: string,
    isPassenger: boolean,
    isDriver: boolean,
  ) {
    super()
    this.accountId = accountId
    this.name = name
    this.email = email
    this.cpf = cpf
    this.carPlate = carPlate
    this.isPassenger = isPassenger
    this.isDriver = isDriver
  }
}
