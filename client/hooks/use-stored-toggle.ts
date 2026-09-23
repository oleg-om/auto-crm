import { useState } from 'react'

const readStored = (key: string): boolean => {
  try {
    return localStorage.getItem(key) === 'true'
  } catch {
    return false
  }
}

// A boolean view preference (a "Показывать ..." switch) remembered per browser via localStorage.
// eslint-disable-next-line import/prefer-default-export
export const useStoredToggle = (key: string) => {
  const [value, setValueState] = useState<boolean>(() => readStored(key))

  const setValue = (next: boolean) => {
    setValueState(next)
    try {
      localStorage.setItem(key, String(next))
    } catch {
      // ignore write errors (private mode, storage quota, etc.)
    }
  }

  return [value, setValue] as const
}
