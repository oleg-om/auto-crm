import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import PlaceRow from '../../components/places/place'
import { deletePlace } from '../../redux/reducers/places'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Modal from '../../components/Modal.delete'
import 'react-toastify/dist/ReactToastify.css'

const PlaceList = () => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const dispatch = useDispatch()
  const list = useSelector((s) => s.places.list)

  const [isOpen, setIsOpen] = useState(false)
  const [itemId, setItemId] = useState('')

  const openAndDelete = (id) => {
    setIsOpen(true)
    setItemId(id)
  }
  const deletePlaceLocal = (id) => {
    dispatch(deletePlace(id))
    setIsOpen(false)
    notify('Адрес удален')
  }
  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        <Sidebar />
        <div className="container mx-auto px-4">
          <h1 className="text-3xl py-4 border-b mb-6">Список адресов</h1>
          <div className="overflow-x-auto rounded-lg overflow-y-auto relative lg:my-3 mt-1 lg:shadow">
            <table className="border-collapse w-full">
              <thead>
                <tr>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Точка
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((it, id) => (
                  <PlaceRow key={id} deletePlace={openAndDelete} {...it} />
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/place/create">
            <button
              type="button"
              className="z-20 fixed bottom-0 h-32 w-32 left-0 p-6 shadow bg-blue-600 text-white text-l hover:bg-blue-700 hover:text-white rounded-full my-3 mx-3"
            >
              Новый
              <br />
              адрес
            </button>
          </Link>
        </div>
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={() => deletePlaceLocal(itemId)}
        />
      </div>
    </div>
  )
}

export default PlaceList
