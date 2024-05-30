import { useCallback, useMemo, useState } from 'react'

export function App() {
  const [signupForm, setSignupForm] = useState({
    isPassenger: false,
    isDriver: false,
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
    return progress
  }, [signupForm.isPassenger])

  return (
    <>
      <h1 className="step">Passo {signupForm.step}</h1>
      <span className="progress">{formProgress} %</span>
      <br />
      {!!signupForm.error && <span className="error">{signupForm.error}</span>}
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
      <button className="button-next" onClick={nextStep}>
        Próximo
      </button>
    </>
  )
}
