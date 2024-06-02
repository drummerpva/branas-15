import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { App } from '../src/App'

test('Deve criar uma conta de um passageiro por meio do wizard', async () => {
  const { container } = render(<App />)
  expect(container.querySelector('.step')).toHaveTextContent('Passo 1')
  expect(container.querySelector('.progress')).toHaveTextContent('0%')
  await userEvent.click(container.querySelector('.input-is-passenger')!)
  expect(container.querySelector('.input-is-passenger')).toBeChecked()
  expect(container.querySelector('.input-name')).toBeFalsy()
  expect(container.querySelector('.input-email')).toBeFalsy()
  expect(container.querySelector('.input-cpf')).toBeFalsy()
  expect(container.querySelector('.progress')).toHaveTextContent('25%')
  await userEvent.click(container.querySelector('.button-next')!)
  expect(container.querySelector('.step')).toHaveTextContent('Passo 2')
  await userEvent.type(container.querySelector('.input-name')!, 'John Doe')
  expect(container.querySelector('.progress')).toHaveTextContent('40%')
  await userEvent.type(
    container.querySelector('.input-email')!,
    `john.doe${Math.random()}@gmail.com`,
  )
  expect(container.querySelector('.progress')).toHaveTextContent('55%')
  await userEvent.type(container.querySelector('.input-cpf')!, `98765432100`)
  expect(container.querySelector('.progress')).toHaveTextContent('70%')
  expect(container.querySelector('.input-is-passenger')).toBeFalsy()
  await userEvent.click(container.querySelector('.button-next')!)
  expect(container.querySelector('.step')).toHaveTextContent('Passo 3')
  expect(container.querySelector('.input-is-passenger')).toBeFalsy()
  expect(container.querySelector('.input-name')).toBeFalsy()
  expect(container.querySelector('.input-email')).toBeFalsy()
  expect(container.querySelector('.input-cpf')).toBeFalsy()
  await userEvent.type(container.querySelector('.input-password')!, '12345678')
  expect(container.querySelector('.progress')).toHaveTextContent('85%')
  await userEvent.type(
    container.querySelector('.input-confirm-password')!,
    '12345678',
  )
  expect(container.querySelector('.progress')).toHaveTextContent('100%')
  expect(container.querySelector('.button-next')).toBeFalsy()
  await userEvent.click(container.querySelector('.button-submit')!)
  const element = await screen.findByText((_content, element) => {
    if (!element) return false
    return element.classList.contains('success')
  })
  expect(element).toBeInTheDocument()
  expect(element).toHaveTextContent('Conta criada com sucesso')
})

test('Deve mostar uma mensagem de erro ao tentar ir para o passo 2 caso nenhum tipo de conta seja selecionado', async () => {
  const { container } = render(<App />)
  expect(container.querySelector('.step')).toHaveTextContent('Passo 1')
  expect(container.querySelector('.progress')).toHaveTextContent('0%')
  await userEvent.click(container.querySelector('.button-next')!)
  expect(container.querySelector('.step')).toHaveTextContent('Passo 1')
  expect(container.querySelector('.error')).toHaveTextContent(
    'Selecione um tipo de conta',
  )
})

test('Deve mostrar uma mensagem de erro ao tentar ir para o passo 3 caso nome, email e cpf não sejão informados', async () => {
  const { container } = render(<App />)
  await userEvent.click(container.querySelector('.input-is-passenger')!)
  await userEvent.click(container.querySelector('.button-next')!)
  await userEvent.click(container.querySelector('.button-next')!)
  expect(container.querySelector('.step')).toHaveTextContent('Passo 2')
  expect(container.querySelector('.error')).toHaveTextContent('Digite o nome')
  await userEvent.type(container.querySelector('.input-name')!, 'John Doe')
  await userEvent.click(container.querySelector('.button-next')!)
  expect(container.querySelector('.step')).toHaveTextContent('Passo 2')
  expect(container.querySelector('.error')).toHaveTextContent('Digite o email')
  await userEvent.type(
    container.querySelector('.input-email')!,
    `john.doe${Math.random()}@gmail.com`,
  )
  await userEvent.click(container.querySelector('.button-next')!)
  expect(container.querySelector('.step')).toHaveTextContent('Passo 2')
  expect(container.querySelector('.error')).toHaveTextContent('Digite o CPF')
  await userEvent.type(container.querySelector('.input-cpf')!, `98765432100`)
  await userEvent.click(container.querySelector('.button-next')!)
  expect(container.querySelector('.step')).toHaveTextContent('Passo 3')
  expect(container.querySelector('.error')).toBeFalsy()
})

test('Deve mostrar uma mensagem de erro ao tentar submeter sem senha', async () => {
  const { container } = render(<App />)
  await userEvent.click(container.querySelector('.input-is-passenger')!)
  await userEvent.click(container.querySelector('.button-next')!)
  await userEvent.type(container.querySelector('.input-name')!, 'John Doe')
  await userEvent.type(
    container.querySelector('.input-email')!,
    `john.doe${Math.random()}@gmail.com`,
  )
  await userEvent.type(container.querySelector('.input-cpf')!, `98765432100`)
  await userEvent.click(container.querySelector('.button-next')!)
  expect(container.querySelector('.step')).toHaveTextContent('Passo 3')
  await userEvent.click(container.querySelector('.button-submit')!)
  expect(container.querySelector('.error')).toHaveTextContent(
    'A senha deve ser preenchida',
  )
})
test('Deve mostrar uma mensagem de erro ao tentar submeter sem que a senha esteja igual', async () => {
  const { container } = render(<App />)
  await userEvent.click(container.querySelector('.input-is-passenger')!)
  await userEvent.click(container.querySelector('.button-next')!)
  await userEvent.type(container.querySelector('.input-name')!, 'John Doe')
  await userEvent.type(
    container.querySelector('.input-email')!,
    `john.doe${Math.random()}@gmail.com`,
  )
  await userEvent.type(container.querySelector('.input-cpf')!, `98765432100`)
  await userEvent.click(container.querySelector('.button-next')!)
  expect(container.querySelector('.step')).toHaveTextContent('Passo 3')
  await userEvent.type(container.querySelector('.input-password')!, '12345678')
  await userEvent.type(container.querySelector('.input-confirm-password')!, '1')
  await userEvent.click(container.querySelector('.button-submit')!)
  expect(container.querySelector('.error')).toHaveTextContent(
    'A senha e a confirmação de senha precisam ser iguais',
  )
})
