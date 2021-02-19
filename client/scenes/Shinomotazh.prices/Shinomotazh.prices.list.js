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
  const [active, setActive] = useState('legk')
  const openAndDelete = (id) => {
    setIsOpen(true)
    setItemId(id)
  }
  const deleteShinomontazhpriceLocal = (id) => {
    dispatch(deleteShinomontazhprice(id))
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
        <Sidebar />
        <div className="mx-auto px-4">
          <h1 className="text-3xl py-4 border-b mb-6">Шиномонтаж - прайс</h1>
          <div className="overflow-x-auto rounded-lg overflow-y-auto relative lg:my-3 mt-1 lg:shadow">
            <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Направление
              </label>
              <div className="flex-shrink w-full inline-block relative mb-3">
                <select
                  className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                  value={active}
                  name="type"
                  id="type"
                  required
                  onChange={onChange}
                >
                  <option value="" disabled className="text-gray-800">
                    Выберите направление
                  </option>
                  {ShinomontazhTypeList.map((it) => (
                    <option key={it.value} value={it.value}>
                      {it.name}
                    </option>
                  ))}
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
            {active === 'legk' ? (
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
                  {list
                    .filter((item) => item.type === 'legk')
                    .map((it) => (
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
            ) : null}
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
