import React from 'react'
import { useDispatch } from 'react-redux'
import { signIn } from '../../redux/reducers/auth'

const ButtonLogin = () => {
  const dispatch = useDispatch()
  return (
    <div className="flex items-center justify-between">
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={() => {
          dispatch(signIn())
        }}
      >
        Войти
      </button>
    </div>
  )
}

export default ButtonLogin
