import { useState } from 'react'

// Shared across every price list screen (STO, Wash, Window, Cond, Shinomontazh) so toggling
// "Показывать цены" on one page carries over to the others via localStorage.
const STORAGE_KEY = 'priceTables.showPrices'

const readStored = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

// eslint-disable-next-line import/prefer-default-export
export const useShowPrices = () => {
  const [showPrices, setShowPricesState] = useState<boolean>(readStored)

  const setShowPrices = (value: boolean) => {
    setShowPricesState(value)
    try {
      localStorage.setItem(STORAGE_KEY, String(value))
    } catch {
      // ignore write errors (private mode, storage quota, etc.)
    }
  }

  return [showPrices, setShowPrices] as const
}
