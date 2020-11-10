import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateLogin, updatePassword } from '../../redux/reducers/auth'

const InputFields = () => {
  const dispatch = useDispatch()
  const { login, password } = useSelector((s) => s.auth)
  return (
    <div>
      <div className="rounded-md shadow-sm">
        <input
          aria-label="Login"
          type="login"
          name="login"
          placeholder="Login"
          value={login}
          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
          onChange={(e) => {
            dispatch(updateLogin(e.target.value))
          }}
        />
        <div className="-mt-px">
          <input
            aria-label="Password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
            onChange={(e) => {
              dispatch(updatePassword(e.target.value))
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default InputFields
