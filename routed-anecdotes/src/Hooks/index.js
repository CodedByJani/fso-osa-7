import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  // ✅ reset EI ole mukana inputPropsissa
  return {
    inputProps: {
      type,
      value,
      onChange
    },
    reset
  }
}

export const useAnotherHook = () => {
  // ...
}
