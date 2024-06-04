import { FormEvent, useCallback, useMemo, useState } from 'react'
import { AccountGateway } from './infra/gateway/AccountGateway'

type AppProps = {
  accountGateway: AccountGateway
}

export function App({ accountGateway }: AppProps) {
  const [signupForm, setSignupForm] = useState({
    isPassenger: false,
    isDriver: false,
    name: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: '',
    step: 1,
    error: '',
    success: '',
    accoundId: '',
  })

  const handleSubmit = useCallback(
    async (formData: any) => {
      const input = {
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf,
        isPassenger: formData.isPassenger,
      }
      const output = await accountGateway.signup(input)
      setSignupForm((oldForm) => ({
        ...oldForm,
        success: 'Conta criada com sucesso',
        accoundId: output.accountId,
      }))
    },
    [accountGateway],
  )

  const nextStep = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      setSignupForm((oldForm) => {
        if (oldForm.step === 1 && !oldForm.isPassenger && !oldForm.isDriver) {
          return { ...oldForm, error: 'Selecione um tipo de conta' }
        }
        if (oldForm.step === 2) {
          if (!oldForm.name) {
            return { ...oldForm, error: 'Digite o nome' }
          }
          if (!oldForm.email) {
            return { ...oldForm, error: 'Digite o email' }
          }
          // try {
          //   new Cpf(oldForm.cpf)
          // } catch (error: any) {
          //   return { ...oldForm, error: error.message }
          // }
          if (!oldForm.cpf) {
            return { ...oldForm, error: 'Digite o CPF' }
          }
        }
        if (oldForm.step === 3) {
          if (!oldForm.password) {
            return { ...oldForm, error: 'A senha deve ser preenchida' }
          }
          if (oldForm.password !== oldForm.confirmPassword) {
            return {
              ...oldForm,
              error: 'A senha e a confirmação de senha precisam ser iguais',
            }
          }
          handleSubmit(oldForm)
          return oldForm
        }
        return { ...oldForm, step: oldForm.step + 1, error: '' }
      })
    },
    [handleSubmit],
  )
  const previousStep = useCallback(() => {
    setSignupForm((oldForm) => {
      if (oldForm.step === 1) return oldForm
      return { ...oldForm, step: oldForm.step - 1 }
    })
  }, [])

  const handleTypeMock = useCallback(() => {
    setSignupForm((oldForm) => ({
      ...oldForm,
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: '98765432100',
      password: '12345678',
      confirmPassword: '12345678',
    }))
  }, [])

  const formProgress = useMemo(() => {
    let progress = 0
    if (signupForm.isPassenger) {
      progress += 25
    }
    if (signupForm.name) {
      progress += 15
    }
    if (signupForm.email) {
      progress += 15
    }
    if (signupForm.cpf) {
      progress += 15
    }
    if (signupForm.password) {
      progress += 15
    }
    if (signupForm.confirmPassword) {
      progress += 15
    }
    return progress
  }, [signupForm])

  const showNext = signupForm.step === 1 || signupForm.step === 2
  const showPrevious = signupForm.step > 1
  const showSubmit = signupForm.step === 3

  return (
    <>
      <h1 className="step" onClick={handleTypeMock}>
        Passo {signupForm.step}
      </h1>
      <span className="progress">{formProgress}%</span>
      <br />
      {!!signupForm.error && <span className="error">{signupForm.error}</span>}
      {!!signupForm.success && (
        <span className="success">{signupForm.success}</span>
      )}
      {signupForm.step === 1 && (
        <>
          <label htmlFor="input-as-passenger">Passageiro</label>
          <input
            type="checkbox"
            className="input-is-passenger"
            id="input-as-passenger"
            checked={signupForm.isPassenger}
            onChange={({ target: { checked } }) =>
              setSignupForm({ ...signupForm, isPassenger: checked })
            }
          />
          <br />
        </>
      )}
      {signupForm.step === 2 && (
        <div>
          <input
            type="text"
            className="input-name"
            placeholder="Nome"
            onChange={({ target: { value } }) =>
              setSignupForm((old) => ({ ...old, name: value }))
            }
          />
          <br />
          <input
            type="text"
            className="input-email"
            placeholder="Email"
            onChange={({ target: { value } }) =>
              setSignupForm((old) => ({ ...old, email: value }))
            }
          />
          <br />
          <input
            type="text"
            placeholder="CPF"
            className="input-cpf"
            onChange={({ target: { value } }) =>
              setSignupForm((old) => ({ ...old, cpf: value }))
            }
          />
          <br />
        </div>
      )}
      {signupForm.step === 3 && (
        <div>
          <input
            type="password"
            placeholder="Senha"
            className="input-password"
            onChange={({ target: { value } }) =>
              setSignupForm((old) => ({ ...old, password: value }))
            }
          />
          <input
            type="password"
            placeholder="Confirme a senha"
            className="input-confirm-password"
            onChange={({ target: { value } }) =>
              setSignupForm((old) => ({ ...old, confirmPassword: value }))
            }
          />
        </div>
      )}
      {showPrevious && (
        <button className="button-previous" onClick={previousStep}>
          Anterior
        </button>
      )}
      {showNext && (
        <button className="button-next" onClick={nextStep}>
          Próximo
        </button>
      )}
      {showSubmit && (
        <button className="button-submit" onClick={nextStep}>
          Enviar
        </button>
      )}
    </>
  )
}
