import React from 'react'
import { useDispatch } from 'react-redux'
import Register from '../../components/accounts/register'
import { createAccount } from '../../redux/reducers/accounts'

const RegisterCommon = () => {
  const dispatch = useDispatch()
  const create = (name) => {
    dispatch(createAccount(name))
  }

  return (
    <div>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Добавить аккаунт</h1>

        <Register create={create} />
      </div>
    </div>
  )
}

export default RegisterCommon
