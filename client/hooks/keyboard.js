import React, { useEffect, useState } from 'react'

export function useKeyboard() {
  const [keyboard, setKeyboardView] = useState(false)
  const [regOpen, setRegOpen] = useState(false)

  useEffect(() => {
    const localKeyboardValue = localStorage.getItem('keyboardView', JSON.stringify(keyboard))
    if (localKeyboardValue) {
      if (localKeyboardValue === 'true') {
        setKeyboardView(true)
      } else if (localKeyboardValue === 'false') {
        setKeyboardView(false)
      }
    }
  }, [keyboard])

  const setKeyboard = (val) => {
    setKeyboardView(val)
    localStorage.setItem('keyboardView', JSON.stringify(val))
  }

  const switchKeyboard = () => {
    setKeyboard(!keyboard)
    setRegOpen(!regOpen)
  }

  return { keyboard, setKeyboard, regOpen, setRegOpen, switchKeyboard }
}

export const SwitchToTapKeyboard = ({ keyboard, switchKeyboard }) => {
  if (keyboard) {
    return (
      <button className="text-left text-gray-500 p-1" type="button" onClick={switchKeyboard}>
        Изменить способ ввода гос. номера ←
      </button>
    )
  }
  return null
}

export default useKeyboard
