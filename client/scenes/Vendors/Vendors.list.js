import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import VendorRow from '../../components/vendors/vendor'
import { deleteVendor } from '../../redux/reducers/vendors'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Modal from '../../components/Modal.delete'
import 'react-toastify/dist/ReactToastify.css'
import vendorList from '../../lists/vendor-list'

const VendorList = () => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const dispatch = useDispatch()
  const list = useSelector((s) => s.vendors.list)
  const auth = useSelector((s) => s.auth)
  const [isOpen, setIsOpen] = useState(false)
  const [itemId, setItemId] = useState('')

  const openAndDelete = (id) => {
    setIsOpen(true)
    setItemId(id)
  }
  const deleteVendorLocal = (id) => {
    dispatch(deleteVendor(id))
    setIsOpen(false)
    notify('Сотрудник удален')
  }
  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        {auth.roles.includes('boss') || auth.roles.includes('admin') ? <Sidebar /> : null}
        <div className="container mx-auto px-4">
          <h1 className="text-3xl py-4 border-b mb-6">Список поставщиков</h1>
          <div className="overflow-x-auto rounded-lg overflow-y-auto relative lg:my-3 mt-1 lg:shadow">
            <table className="border-collapse w-full">
              <thead>
                <tr>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Название
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Телефон
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Категория
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Действия
                  </th>
                </tr>
              </thead>
              {auth.roles.includes('boss') || auth.roles.includes('admin') ? (
                <tbody>
                  {list.map((it) => (
                    <VendorRow
                      key={it.id}
                      vendorList={vendorList}
                      deleteVendor={openAndDelete}
                      {...it}
                    />
                  ))}
                </tbody>
              ) : null}
              {!auth.roles.includes('boss') &&
              !auth.roles.includes('admin') &&
              auth.roles.includes('autopartfull') ? (
                <tbody>
                  {list
                    .filter((it) => it.type === 'autoparts')
                    .map((it) => (
                      <VendorRow
                        key={it.id}
                        vendorList={vendorList}
                        deleteVendor={openAndDelete}
                        {...it}
                      />
                    ))}
                </tbody>
              ) : null}
              {!auth.roles.includes('boss') &&
              !auth.roles.includes('admin') &&
              auth.roles.includes('tyrefull') ? (
                <tbody>
                  {list
                    .filter((it) => it.type === 'tyres')
                    .map((it) => (
                      <VendorRow
                        key={it.id}
                        vendorList={vendorList}
                        deleteVendor={openAndDelete}
                        {...it}
                      />
                    ))}
                </tbody>
              ) : null}
            </table>
          </div>
          <Link to="/vendor/create">
            <button
              type="button"
              className="fixed bottom-0 h-32 w-32 left-0 p-6 shadow bg-blue-600 text-white text-l hover:bg-blue-700 hover:text-white rounded-full my-3 mx-3"
            >
              Новый
              <br />
              поставщик
            </button>
          </Link>
        </div>
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={() => deleteVendorLocal(itemId)}
        />
      </div>
    </div>
  )
}

export default VendorList
