import crypto from 'node:crypto'
import { validateCpf } from './validateCpf'
export class Account {
  private constructor(
    readonly accountId: string,
    readonly name: string,
    readonly email: string,
    readonly cpf: string,
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
    readonly carPlate?: string,
  ) {
    this.accountId = accountId
    if (!this.isValidName(name)) throw new Error('Invalid name')
    if (!this.isValidEmail(email)) throw new Error('Invalid email')
    if (!validateCpf(cpf)) throw new Error('Invalid cpf')
    if (isDriver && !this.isValidCarPlate(carPlate))
      throw new Error('Invalid car plate')
    this.name = name
    this.email = email
    this.cpf = cpf
    this.isPassenger = isPassenger
    this.isDriver = isDriver
    this.carPlate = carPlate
  }

  private isValidName(name: string) {
    return name.match(/[a-zA-Z] [a-zA-Z]+/)
  }

  private isValidEmail(email: string) {
    return email.match(/^(.+)@(.+)$/)
  }

  private isValidCarPlate(carPlate?: string) {
    return !!carPlate?.match(/[A-Z]{3}[0-9]{4}/)
  }

  static restore(
    accountId: string,
    name: string,
    email: string,
    cpf: string,
    isPassenger: boolean,
    isDriver: boolean,
    carPlate?: string,
  ) {
    return new Account(
      accountId,
      name,
      email,
      cpf,
      isPassenger,
      isDriver,
      carPlate,
    )
  }

  static create(
    name: string,
    email: string,
    cpf: string,
    isPassenger: boolean,
    isDriver: boolean,
    carPlate?: string,
  ) {
    const accountId = crypto.randomUUID()
    return new Account(
      accountId,
      name,
      email,
      cpf,
      isPassenger,
      isDriver,
      carPlate,
    )
  }
}
