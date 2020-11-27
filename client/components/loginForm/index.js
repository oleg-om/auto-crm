import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { updateLogin, updatePassword } from '../../redux/reducers/auth'
import ButtonLogin from './button'

const LoginForm = () => {
  const dispatch = useDispatch()
  const { login, password } = useSelector((s) => s.auth)
  return (
    <div className="w-screen h-screen bg-gray-200 flex justify-center items-center">
      <div className=" max-w-xs ">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Логин
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="login"
              name="login"
              value={login}
              onChange={(e) => {
                dispatch(updateLogin(e.target.value))
              }}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Пароль
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              name="password"
              type="password"
              value={password}
              required
              onChange={(e) => {
                dispatch(updatePassword(e.target.value))
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <ButtonLogin />
            <Link to="/registration">
              <button type="button" className="text-blue-500 hover:text-blue-700">
                Регистрация
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
