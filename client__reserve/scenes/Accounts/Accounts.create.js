import React from 'react'
import { useDispatch } from 'react-redux'
import AccountCreate from '../../components/accounts/account.create'
import { createAccount } from '../../redux/reducers/accounts'
import Navbar from '../../components/Navbar'

const AccountNew = () => {
  const dispatch = useDispatch()
  const create = (name) => {
    dispatch(createAccount(name))
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Добавить аккаунт</h1>

        <AccountCreate create={create} />
      </div>
    </div>
  )
}

export default AccountNew
