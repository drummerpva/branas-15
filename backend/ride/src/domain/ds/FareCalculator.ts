export abstract class FareCalculator {
  calulate(distance: number): number {
    return distance * this.getFare()
  }

  abstract getFare(): number
}

export class NormalFareCalculator extends FareCalculator {
  FARE = 2.1
  getFare(): number {
    return this.FARE
  }
}
export class OvernightFareCalculator extends FareCalculator {
  FARE = 3.9
  getFare(): number {
    return this.FARE
  }
}
export class SundayFareCalculator extends FareCalculator {
  FARE = 2.9
  getFare(): number {
    return this.FARE
  }
}

export class FareCalculatorFactory {
  static create(date: Date): FareCalculator {
    if (date.getDay() === 0) return new SundayFareCalculator()
    if (date.getHours() > 22 || date.getHours() < 6)
      return new OvernightFareCalculator()
    if (date.getHours() <= 22 && date.getHours() >= 6)
      return new NormalFareCalculator()
    throw new Error('Invalid date')
  }
}
