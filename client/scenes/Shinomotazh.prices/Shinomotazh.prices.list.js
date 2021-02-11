import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import ShinomontazhpriceRow from '../../components/shinomontazhprices/shinomontazhprice'
import { deleteShinomontazhprice } from '../../redux/reducers/shinomotazh.prices'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Modal from '../../components/Modal.delete'
import 'react-toastify/dist/ReactToastify.css'
import ShinomontazhTypeList from '../../lists/shinomontazhtype-list'
import ShinomontazhCategoryList from '../../lists/shinomontazhprice-list'

const ShinomontazhpriceList = () => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const dispatch = useDispatch()
  const list = useSelector((s) => s.shinomontazhprices.list)
  const [isOpen, setIsOpen] = useState(false)
  const [itemId, setItemId] = useState('')

  const openAndDelete = (id) => {
    setIsOpen(true)
    setItemId(id)
  }
  const deleteShinomontazhpriceLocal = (id) => {
    dispatch(deleteShinomontazhprice(id))
    setIsOpen(false)
    notify('Материал удален')
  }
  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        <Sidebar />
        <div className="mx-auto px-4">
          <h1 className="text-3xl py-4 border-b mb-6">Шиномонтаж - прайс</h1>
          <div className="overflow-x-auto rounded-lg overflow-y-auto relative lg:my-3 mt-1 lg:shadow">
            <table className="border-collapse w-full">
              <thead>
                <tr>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Название
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Направление
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Категория
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    R13
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    R14
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    R15
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    R16
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    R17
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    R18
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    R19
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    R20
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    R21
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    R22
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    R23
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    R24
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Номер
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((it) => (
                  <ShinomontazhpriceRow
                    key={it.id}
                    deleteShinomontazhprice={openAndDelete}
                    ShinomontazhTypeList={ShinomontazhTypeList}
                    ShinomontazhCategoryList={ShinomontazhCategoryList}
                    {...it}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/shinomontazhprice/create">
            <button
              type="button"
              className="fixed bottom-0 h-32 w-32 left-0 p-6 shadow bg-blue-600 text-white text-l hover:bg-blue-700 hover:text-white rounded-full my-3 mx-3"
            >
              Добавить
              <br />
              услугу
            </button>
          </Link>
        </div>
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={() => deleteShinomontazhpriceLocal(itemId)}
        />
      </div>
    </div>
  )
}

export default ShinomontazhpriceList
