import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import EmployeeRow from '../../components/employees/employee'
import { deleteEmployee } from '../../redux/reducers/employees'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Modal from '../../components/Modal.delete'
import 'react-toastify/dist/ReactToastify.css'

const EmployeeList = () => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const dispatch = useDispatch()
  const list = useSelector((s) => s.employees.list)
  const place = useSelector((s) => s.places.list)
  const [isOpen, setIsOpen] = useState(false)
  const [itemId, setItemId] = useState('')
  const [searchName, setSearchName] = useState('')
  const [searchPlace, setSearchPlace] = useState('')

  const filteredList = list.filter((it) => {
    const fullName = `${it.name} ${it.surname}`.toLowerCase()
    const matchesName = fullName.includes(searchName.trim().toLowerCase())
    const matchesPlace = searchPlace === '' || it.address.includes(searchPlace)
    return matchesName && matchesPlace
  })

  const openAndDelete = (id) => {
    setIsOpen(true)
    setItemId(id)
  }
  const deleteEmployeeLocal = (id) => {
    dispatch(deleteEmployee(id))
    setIsOpen(false)
    notify('Сотрудник удален')
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        <Sidebar />
        <div className="container mx-auto px-4">
          <h1 className="text-3xl py-4 border-b mb-6">Список сотрудников</h1>
          <div className="py-3 px-4 my-3 rounded-lg shadow bg-white">
            <div className="-mx-3 md:flex md:justify-between">
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="searchName"
                >
                  Имя или фамилия
                </label>
                <div className="flex-shrink w-full inline-block relative">
                  <input
                    className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 pr-8"
                    value={searchName}
                    name="searchName"
                    id="searchName"
                    placeholder="Введите имя или фамилию"
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                  {searchName ? (
                    <button
                      type="button"
                      className="absolute top-0 right-0 h-full px-2 flex items-center text-gray-500 hover:text-gray-700"
                      onClick={() => setSearchName('')}
                      aria-label="Очистить"
                    >
                      &times;
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="searchPlace"
                >
                  Точка
                </label>
                <div className="flex-shrink w-full inline-block relative">
                  <select
                    className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                    value={searchPlace}
                    name="searchPlace"
                    id="searchPlace"
                    onChange={(e) => setSearchPlace(e.target.value)}
                  >
                    <option value="">Все</option>
                    {place.map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute top-0 mt-2 right-0 flex items-center px-2 text-gray-600">
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
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg overflow-y-auto relative lg:my-3 mt-1 lg:shadow">
            <table className="border-collapse w-full">
              <thead>
                <tr>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Имя
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Точка
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Должность
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((it) => (
                  <EmployeeRow key={it.id} place={place} deleteEmployee={openAndDelete} {...it} />
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/employee/create">
            <button
              type="button"
              className="fixed bottom-0 h-32 w-32 left-0 p-6 shadow bg-main-600 text-white text-l hover:bg-main-700 hover:text-white rounded-full my-3 mx-3"
            >
              Новый
              <br />
              сотрудник
            </button>
          </Link>
        </div>
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={() => deleteEmployeeLocal(itemId)}
        />
      </div>
    </div>
  )
}

export default EmployeeList
