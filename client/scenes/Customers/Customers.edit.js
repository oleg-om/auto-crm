import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import CustomerUpdate from '../../components/customers/customer.edit'
import Navbar from '../../components/Navbar'
import { updateCustomer, deleteCustomer } from '../../redux/reducers/customers'

const CustomerEdit = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  useEffect(() => {
    fetch(`/api/v1/customer/${id}`)
      .then((r) => r.json())
      .then(({ data: customer }) => {
        setList([customer])
        setLoading(true)
      })
  }, [id])

  const updateCustomerLocal = (idOfItem, name) => {
    dispatch(updateCustomer(idOfItem, name))
  }
  const deleteCustomerLocal = (idOfItem) => {
    dispatch(deleteCustomer(idOfItem))
  }
  const loadingComponent = () => {
    return (
      <div className="flex w-100 justify-center my-3">
        <button
          type="button"
          className="bg-blue-500 p-3 text-white rounded flex items-center"
          disabled
        >
          <div className=" flex justify-center items-center pr-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-4 border-white" />
          </div>
          Загрузка...
        </button>
      </div>
    )
  }
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Редатировать клиента</h1>
        {loading
          ? list.map((it) => (
              <CustomerUpdate
                key={id}
                {...it}
                deleteCustomer={deleteCustomerLocal}
                updateCustomer={updateCustomerLocal}
              />
            ))
          : loadingComponent()}
      </div>
    </div>
  )
}

export default CustomerEdit
