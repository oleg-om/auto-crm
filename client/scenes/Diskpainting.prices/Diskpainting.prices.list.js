import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import DiskpaintingpriceRow from '../../components/diskpaintingprices/diskpaintingprice'
import { getDiskpaintingprices, deleteDiskpaintingprice } from '../../redux/reducers/diskpainting.prices'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Modal from '../../components/Modal.delete'
import 'react-toastify/dist/ReactToastify.css'
import OnLoadCategorys from '../Categorys/Onload'

const DiskpaintingpriceList = () => {
  OnLoadCategorys()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getDiskpaintingprices())
  }, [dispatch])
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const list = useSelector((s) => s.diskpaintingprices.list)
  const auth = useSelector((s) => s.auth)
  const [isOpen, setIsOpen] = useState(false)
  const [itemId, setItemId] = useState('')

  const openAndDelete = (id) => {
    setIsOpen(true)
    setItemId(id)
  }
  const deleteLocal = (id) => {
    dispatch(deleteDiskpaintingprice(id))
    setIsOpen(false)
    notify('Услуга удалена')
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        {!auth.roles.includes('bookkeeper') ? <Sidebar /> : null}
        <div className="mx-auto px-4">
          <h1 className="text-3xl py-4 border-b mb-6">Покраска дисков - прайс</h1>
          <div className="rounded-lg overflow-y-auto relative lg:my-3 mt-1 lg:shadow">
            <table className="border-collapse w-full">
              <thead>
                <tr className="text-xs">
                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">Название</th>
                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">Категория</th>
                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">R13</th>
                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">R14</th>
                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">R15</th>
                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">R16</th>
                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">R17</th>
                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">R18</th>
                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">R19</th>
                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">R20</th>
                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">R21</th>
                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">R22</th>
                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">R23</th>
                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">R24</th>
                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">Номер</th>
                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">Акция</th>
                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">Действия</th>
                </tr>
              </thead>
              <tbody>
                {list.map((it) => (
                  <DiskpaintingpriceRow
                    key={it.id}
                    deleteDiskpaintingprice={openAndDelete}
                    {...it}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/diskpaintingprice/create">
            <button
              type="button"
              className="fixed bottom-0 h-32 w-32 left-0 p-6 shadow bg-main-600 text-white text-l hover:bg-main-700 hover:text-white rounded-full my-3 mx-3"
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
          onSubmit={() => deleteLocal(itemId)}
        />
      </div>
    </div>
  )
}

export default DiskpaintingpriceList
