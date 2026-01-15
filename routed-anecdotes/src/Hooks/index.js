import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  // ✅ uusi reset-funktio
  const reset = () => setValue('')

  return {
    type,
    value,
    onChange,
    reset // ✅ palautetaan hookista
  }
}

// Mahdollisuus lisätä muita hookkeja myöhemmin
export const useAnotherHook = () => {
  // ...
}
