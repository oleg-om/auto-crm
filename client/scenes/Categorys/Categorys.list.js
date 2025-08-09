import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import CategoryRow from '../../components/categorys/category'
import { deleteCategory } from '../../redux/reducers/categorys'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Modal from '../../components/Modal.delete'
import 'react-toastify/dist/ReactToastify.css'
import categoryList from '../../lists/category-list'
import OnLoad from './Onload'

const CategoryList = () => {
  OnLoad()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const dispatch = useDispatch()
  const list = useSelector((s) => s.categorys.list)
  const auth = useSelector((s) => s.auth)
  const [isOpen, setIsOpen] = useState(false)
  const [itemId, setItemId] = useState('')

  const openAndDelete = (id) => {
    setIsOpen(true)
    setItemId(id)
  }
  const deleteCategoryLocal = (id) => {
    dispatch(deleteCategory(id))
    setIsOpen(false)
    notify('Категория удалена')
  }
  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        {auth.roles.includes('boss') || auth.roles.includes('admin') ? <Sidebar /> : null}
        <div className="container mx-auto px-4">
          <h1 className="text-3xl py-4 border-b mb-6">Список категорий</h1>
          <div className="overflow-x-auto rounded-lg overflow-y-auto relative lg:my-3 mt-1 lg:shadow">
            <table className="border-collapse w-full">
              <thead>
                <tr>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Название
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Подкатегория
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Действия
                  </th>
                </tr>
              </thead>

              <tbody>
                {list.map((it) => (
                  <CategoryRow
                    key={it.id}
                    categoryList={categoryList}
                    deleteCategory={openAndDelete}
                    {...it}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/category/create">
            <button
              type="button"
              className="fixed bottom-0 h-32 w-32 left-0 p-6 shadow bg-main-600 text-white text-l hover:bg-main-700 hover:text-white rounded-full my-3 mx-3"
            >
              Новая
              <br />
              категория
            </button>
          </Link>
        </div>
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={() => deleteCategoryLocal(itemId)}
        />
      </div>
    </div>
  )
}

export default CategoryList
