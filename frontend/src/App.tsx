import { useCallback, useMemo, useState } from 'react'

export function App() {
  const [signupForm, setSignupForm] = useState({
    isPassenger: false,
    isDriver: false,
    name: '',
    email: '',
    cpf: '',
    step: 1,
    error: '',
  })

  const nextStep = useCallback(() => {
    setSignupForm((oldForm) => {
      if (oldForm.step === 1 && !oldForm.isPassenger && !oldForm.isDriver) {
        return { ...oldForm, error: 'Selecione um tipo de conta' }
      }
      return { ...oldForm, step: oldForm.step + 1 }
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
    return progress
  }, [signupForm])

  return (
    <>
      <h1 className="step">Passo {signupForm.step}</h1>
      <span className="progress">{formProgress} %</span>
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
            onChange={({ target: { value } }) =>
              setSignupForm((old) => ({ ...old, name: value }))
            }
          />
          <br />
          <input
            type="text"
            className="input-email"
            onChange={({ target: { value } }) =>
              setSignupForm((old) => ({ ...old, email: value }))
            }
          />
          <br />
          <input
            type="text"
            className="input-cpf"
            onChange={({ target: { value } }) =>
              setSignupForm((old) => ({ ...old, cpf: value }))
            }
          />
          <br />
        </div>
      )}

      <button className="button-next" onClick={nextStep}>
        Próximo
      </button>
    </>
  )
}
