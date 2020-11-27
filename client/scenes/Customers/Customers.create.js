import React from 'react'
import { useDispatch } from 'react-redux'
import CustomerCreate from '../../components/customers/customer.create'
import { createCustomer } from '../../redux/reducers/customers'
import Navbar from '../../components/Navbar'

const CustomerNew = () => {
  const dispatch = useDispatch()
  const create = (name) => {
    dispatch(createCustomer(name))
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Добавить клиента</h1>

        <CustomerCreate create={create} />
      </div>
    </div>
  )
}

export default CustomerNew
