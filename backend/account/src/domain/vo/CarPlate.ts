export class CarPlate {
  private value: string
  constructor(carPlate: string) {
    if (!this.isValidCarPlate(carPlate)) throw new Error('Invalid car plate')
    this.value = carPlate
  }

  getValue() {
    return this.value
  }

  private isValidCarPlate(carPlate?: string) {
    return !!carPlate?.match(/[A-Z]{3}[0-9]{4}/)
  }
}
