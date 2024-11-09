import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import AccountUpdate from '../../components/accounts/account.edit'
import Navbar from '../../components/Navbar'
import { updateAccount, deleteAccount } from '../../redux/reducers/accounts'

const AccountEdit = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const list = useSelector((s) => s.accounts.list).filter((it) => it._id === id)
  const updateAccountLocal = (idOfItem, name) => {
    dispatch(updateAccount(idOfItem, name))
  }
  const deleteAccountLocal = (idOfItem) => {
    dispatch(deleteAccount(idOfItem))
  }
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Редактировать аккаунт</h1>
        {list.map((it) => (
          <AccountUpdate
            key={id}
            {...it}
            deleteAccount={deleteAccountLocal}
            updateAccount={updateAccountLocal}
          />
        ))}
      </div>
    </div>
  )
}

export default AccountEdit
