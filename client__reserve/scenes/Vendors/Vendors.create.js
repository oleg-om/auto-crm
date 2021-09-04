import React from 'react'
import { useDispatch } from 'react-redux'
import VendorCreate from '../../components/vendors/vendor.create'
import { createVendor } from '../../redux/reducers/vendors'
import Navbar from '../../components/Navbar'

const VendorNew = () => {
  const dispatch = useDispatch()
  const create = (name) => {
    dispatch(createVendor(name))
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Добавить поставщика</h1>

        <VendorCreate create={create} />
      </div>
    </div>
  )
}

export default VendorNew
