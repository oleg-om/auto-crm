import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import WashpriceRow from '../../components/windowprices/windowprice'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Modal from '../../components/Modal.delete'
import 'react-toastify/dist/ReactToastify.css'
import WashCategoryList from '../../lists/shinomontazhprice-list'
import OnLoad from '../Categorys/Onload'
import OnLoadWindow from '../Window/Onload'
import { deleteCondprice } from '../../redux/reducers/cond.prices'
import { deleteWindowprice } from '../../redux/reducers/window.prices'

const WashTypeList = [
  { value: 'legk', name: 'Легковые' }
  // { value: 'gruz', name: 'Грузовые' }
]

export const getPriceLocation = (location) => {
  if (location.pathname.includes('windowprice')) {
    return 'window'
  }
  if (location.pathname.includes('washprice')) {
    return 'window'
  }
  return 'cond'
}

const getTitle = (location) => {
  if (location.pathname.includes('windowprice')) {
    return 'Лобовые стекла'
  }
  return 'Кондиционеры'
}

const removeFunc = (id, location) => {
  if (location.pathname.includes('windowprice')) {
    return deleteWindowprice(id)
  }
  return deleteCondprice(id)
}

const WindowpriceList = () => {
  OnLoad()
  OnLoadWindow()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  // const params = useParams()
  const location = useLocation()
  const currentLocation = `${getPriceLocation(location)}price`

  const dispatch = useDispatch()
  const list = useSelector((s) => s[`${currentLocation}s`].list)

  const auth = useSelector((s) => s.auth)
  const [isOpen, setIsOpen] = useState(false)
  const [itemId, setItemId] = useState('')
  const [active, setActive] = useState('legk')
  const openAndDelete = (id) => {
    setIsOpen(true)
    setItemId(id)
  }
  const deleteWashpriceLocal = (id) => {
    dispatch(removeFunc(id, location))
    setIsOpen(false)
    notify('Услуга удалена')
  }
  const onChange = (e) => {
    const { value } = e.target
    setActive(() => value)
  }
  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        {!auth.roles.includes('bookkeeper') ? <Sidebar /> : null}
        <div className="mx-auto px-4">
          <h1 className="text-3xl py-4 border-b mb-6">{getTitle(location)} - прайс</h1>
          <div className="rounded-lg overflow-y-auto relative lg:my-3 mt-1 lg:shadow">
            <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs mb-2"
                htmlFor="grid-first-name"
              >
                Направление
              </label>
              <div className="flex-shrink w-full inline-block relative mb-3">
                <select
                  className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                  value={active}
                  name="type"
                  id="type"
                  required
                  onChange={onChange}
                >
                  <option value="" disabled className="text-gray-800">
                    Выберите направление
                  </option>
                  {WashTypeList
                    ? WashTypeList.map((it) => (
                        <option key={it.value} value={it.value}>
                          {it.name}
                        </option>
                      ))
                    : null}
                </select>
                <div className="pointer-events-none absolute top-0 mt-4  right-0 flex items-center px-2 text-gray-600">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <table className="border-collapse w-full">
              <thead>
                <tr className="text-xs">
                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Название
                  </th>
                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Направление
                  </th>
                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Категория
                  </th>

                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Номер
                  </th>
                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Акция
                  </th>
                  <th className="p-3 uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {list
                  .filter((item) => item.type === active)
                  .map((it) => (
                    <WashpriceRow
                      key={it.id}
                      deleteWashprice={openAndDelete}
                      WashTypeList={WashTypeList}
                      WashCategoryList={WashCategoryList}
                      type=""
                      {...it}
                    />
                  ))}
              </tbody>
            </table>
          </div>
          <Link to={`/${currentLocation}/create`}>
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
          onSubmit={() => deleteWashpriceLocal(itemId)}
        />
      </div>
    </div>
  )
}

export default WindowpriceList
