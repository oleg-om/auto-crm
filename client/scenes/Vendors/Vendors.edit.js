import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import VendorUpdate from '../../components/vendors/vendor.edit'
import Navbar from '../../components/Navbar'
import { updateVendor, deleteVendor } from '../../redux/reducers/vendors'

const VendorEdit = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const list = useSelector((s) => s.vendors.list).filter((it) => it.id === id)
  const updateVendorLocal = (idOfItem, name) => {
    dispatch(updateVendor(idOfItem, name))
  }
  const deleteVendorLocal = (idOfItem) => {
    dispatch(deleteVendor(idOfItem))
  }
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Редатировать поставщика</h1>
        {list.map((it) => (
          <VendorUpdate
            key={id}
            {...it}
            deleteVendor={deleteVendorLocal}
            updateVendor={updateVendorLocal}
          />
        ))}
      </div>
    </div>
  )
}

export default VendorEdit
