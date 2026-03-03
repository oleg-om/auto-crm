import React, { useState } from 'react'
import { toast } from 'react-toastify'

const PasswordChecker = ({ pass, setPasswordIsCorrect }) => {
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const [password, setPassword] = useState('')

  const onChangePassowrd = (e) => {
    const { value } = e.target
    setPassword(value)
  }

  const submitPassword = () => {
    if (password === pass) {
      setPasswordIsCorrect(true)
      notify('Доступ разблокирован')
    } else {
      setPasswordIsCorrect(false)
      notify('Пароль неверный')
    }
  }

  return (
    <div className="w-screen mt-5 pt-5 bg-gray-200 flex justify-center items-center">
      <div className=" max-w-xs ">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Пароль
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mask-password"
              type="text"
              name="password"
              value={password}
              onChange={onChangePassowrd}
              autoComplete="off"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="bg-main-500 hover:bg-main-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={submitPassword}
            >
              Перейти к отчетам
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordChecker
