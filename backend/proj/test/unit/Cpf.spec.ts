import { Cpf } from '../../src/domain/Cpf'

test.each(['987.654.321-00', '974.563.215-58', '714.287.938-60'])(
  'Deve testar se o cpf %s é válido',
  (cpf: string) => {
    expect(new Cpf(cpf)).toBeDefined()
  },
)
test.each([
  '000.000.000-00',
  '111.111.111-11',
  '222.222.222-22',
  '333.333.333-33',
  '444.444.444-44',
  '555.555.555-55',
  '666.666.666-66',
  '777.777.777-77',
  '888.888.888-88',
  '999.999.999-99',
])('Deve testar o cpf %s inválido com mesmo dígito', (cpf: string) => {
  expect(() => new Cpf(cpf)).toThrowError('Invalid cpf')
})
test.each([
  '974.563.215-5',
  '974.563.215-581234',
  '974.563.215-AB',
  null,
  undefined,
])('Deve testar cpf %s inválido', (cpf: any) => {
  expect(() => new Cpf(cpf)).toThrowError('Invalid cpf')
})
