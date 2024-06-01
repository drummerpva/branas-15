import { FormEvent, useCallback, useMemo, useState } from 'react'

export function App() {
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
  })

  const nextStep = useCallback((e: FormEvent) => {
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
      }
      return { ...oldForm, step: oldForm.step + 1, error: '' }
    })
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

  const showNext = useMemo(
    () => signupForm.step === 1 || signupForm.step === 2,
    [signupForm.step],
  )
  const showSubmit = useMemo(() => signupForm.step === 3, [signupForm.step])

  return (
    <>
      <h1 className="step">Passo {signupForm.step}</h1>
      <span className="progress">{formProgress}%</span>
      <br />
      {!!signupForm.error && <span className="error">{signupForm.error}</span>}
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
