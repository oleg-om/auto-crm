import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserName } from '../../redux/reducers/auth'

const NickNameField = () => {
  const dispatch = useDispatch()
  const { userName } = useSelector((s) => s.auth)
  return (
    <input
      aria-label="User Name"
      type="text"
      name="User Name"
      placeholder="User Name"
      value={userName}
      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 border-t-0 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
      onChange={(e) => {
        dispatch(updateUserName(e.target.value))
      }}
    />
  )
}

export default NickNameField
