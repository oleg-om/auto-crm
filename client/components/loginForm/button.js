import React from 'react'
import { useDispatch } from 'react-redux'
import { signIn } from '../../redux/reducers/auth'

const ButtonLogin = () => {
  const dispatch = useDispatch()
  return (
    <button
      type="submit"
      className="bg-teal-700 hover:bg-teal-600 text-white font-bold rounded mb-3 h-8 mt-2 items-center flex mr-2  w-full flex justify-center py-2 px-4"
      onClick={() => dispatch(signIn())}
    >
      Login
    </button>
  )
}

export default ButtonLogin
