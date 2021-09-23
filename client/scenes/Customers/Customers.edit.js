import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import CustomerUpdate from '../../components/customers/customer.edit'
import Navbar from '../../components/Navbar'
import { updateCustomer, deleteCustomer, getCustomer } from '../../redux/reducers/customers'

const CustomerEdit = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getCustomer(id))
  }, [dispatch, id])

  const list = useSelector((s) => s.customers.item)

  const updateCustomerLocal = (idOfItem, name) => {
    dispatch(updateCustomer(idOfItem, name))
  }
  const deleteCustomerLocal = (idOfItem) => {
    dispatch(deleteCustomer(idOfItem))
  }
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Редатировать клиента</h1>
        {list.map((it) => (
          <CustomerUpdate
            key={id}
            {...it}
            deleteCustomer={deleteCustomerLocal}
            updateCustomer={updateCustomerLocal}
          />
        ))}
      </div>
    </div>
  )
}

export default CustomerEdit
