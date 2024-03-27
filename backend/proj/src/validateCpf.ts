export function validateCpf(rawCpf: string) {
  if (!rawCpf) return false
  const cpf = removeNonDigits(rawCpf)
  if (!isValidLength(cpf)) return false
  if (hasAllDigitsEqual(cpf)) return false
  const digit1 = calculateDigit(cpf, 10)
  const digit2 = calculateDigit(cpf, 11)
  return extractDigits(cpf) === `${digit1}${digit2}`
}

function removeNonDigits(cpf: string) {
  return cpf.replace(/\D/g, '')
}

function isValidLength(cpf: string) {
  const CPF_LENGTH = 11
  return cpf.length === CPF_LENGTH
}

function hasAllDigitsEqual(cpf: string) {
  const [firsCpfDigit] = cpf
  return cpf.split('').every((digit) => digit === firsCpfDigit)
}

function calculateDigit(cpf: string, factor: number) {
  let total = 0
  for (const digit of cpf) {
    if (factor > 1) total += Number(digit) * factor--
  }
  const rest = total % 11
  return rest < 2 ? 0 : 11 - rest
}

function extractDigits(cpf: string) {
  return cpf.slice(-2)
}
