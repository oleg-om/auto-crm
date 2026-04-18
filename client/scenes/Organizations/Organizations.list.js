import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import OrganizationRow from '../../components/organizations/organization'
import { deleteOrganization } from '../../redux/reducers/organizations'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Modal from '../../components/Modal.delete'
import 'react-toastify/dist/ReactToastify.css'
import OnLoad from './Onload'

const OrganizationList = () => {
  OnLoad()
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const dispatch = useDispatch()
  const list = useSelector((s) => s.organizations.list)
  const auth = useSelector((s) => s.auth)
  const [isOpen, setIsOpen] = useState(false)
  const [itemId, setItemId] = useState('')

  const openAndDelete = (id) => {
    setIsOpen(true)
    setItemId(id)
  }
  const deleteOrganizationLocal = (id) => {
    dispatch(deleteOrganization(id))
    setIsOpen(false)
    notify('Организация удалена')
  }
  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        {auth.roles.includes('boss') || auth.roles.includes('admin') ? <Sidebar /> : null}
        <div className="container mx-auto px-4">
          <h1 className="text-3xl py-4 border-b mb-6">Список организаций</h1>
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
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((it) => (
                  <OrganizationRow
                    key={it.id}
                    deleteOrganization={openAndDelete}
                    {...it}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/organization/create">
            <button
              type="button"
              className="fixed bottom-0 h-32 w-32 left-0 p-6 shadow bg-main-600 text-white text-l hover:bg-main-700 hover:text-white rounded-full my-3 mx-3"
            >
              Новая
              <br />
              организация
            </button>
          </Link>
        </div>
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={() => deleteOrganizationLocal(itemId)}
        />
      </div>
    </div>
  )
}

export default OrganizationList
