export class Email {
  private value: string
  constructor(email: string) {
    if (!this.isValidEmail(email)) throw new Error('Invalid email')
    this.value = email
  }

  getValue() {
    return this.value
  }

  private isValidEmail(email: string) {
    return email.match(/^(.+)@(.+)$/)
  }
}
