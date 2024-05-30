import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { App } from '../src/App'

test('Deve criar uma conta de um passageiro por meio do wizard', async () => {
  const { container } = render(<App />)
  expect(container.querySelector('.step')).toHaveTextContent('Passo 1')
  expect(container.querySelector('.progress')).toHaveTextContent('0 %')
  await userEvent.click(container.querySelector('.input-is-passenger')!)
  expect(container.querySelector('.input-is-passenger')).toBeChecked()
  expect(container.querySelector('.progress')).toHaveTextContent('25 %')
  await userEvent.click(container.querySelector('.button-next')!)
  expect(container.querySelector('.step')).toHaveTextContent('Passo 2')
})
test('Deve mostar uma mensagem de erro ao tentar ir para o passo 2 caso nenhum tipo de conta seja selecionado', async () => {
  const { container } = render(<App />)
  expect(container.querySelector('.step')).toHaveTextContent('Passo 1')
  expect(container.querySelector('.progress')).toHaveTextContent('0 %')
  await userEvent.click(container.querySelector('.button-next')!)
  expect(container.querySelector('.step')).toHaveTextContent('Passo 1')
  expect(container.querySelector('.error')).toHaveTextContent(
    'Selecione um tipo de conta',
  )
})
