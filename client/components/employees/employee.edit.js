import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Modal from '../Modal.delete'
import 'react-toastify/dist/ReactToastify.css'
import roleList from '../../lists/role-list'

const EmployeeUpdate = (props) => {
  const list = useSelector((s) => s.places.list)
  const [isOpen, SetIsOpen] = useState(false)
  const history = useHistory()

  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const [state, setState] = useState({
    name: props.name,
    surname: props.surname,
    role: props.role,
    address: props.address
  })
  const removeEmployee = (e) => {
    props.deleteEmployee(props.id, e.target.value)
    history.push('/employee/list')
    notify('Адрес удален')
  }
  const changeEmployee = () => {
    if (!state) notify('Поле пустое')
    else {
      props.updateEmployee(props.id, state)
      history.push('/employee/list')
      notify('Данные изменены')
    }
  }

  const onChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const checkboxChange = (e) => {
    const { name, checked } = e.target
    if (checked) {
      setState((prevState) => ({
        ...prevState,
        address: [...prevState.address, name]
      }))
    } else {
      setState((prevState) => ({
        ...prevState,
        address: prevState.address.filter((it) => it !== name)
      }))
    }
  }

  return (
    <div>
      <div className="bg-white shadow rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
        <div className="-mx-3 md:flex flex-wrap">
          <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Имя
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              value={state.name}
              name="name"
              id="name"
              placeholder="Введите имя"
              required
              onChange={onChange}
            />
          </div>
          <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Фамилия
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              value={state.surname}
              name="surname"
              id="surname"
              placeholder="Введите фамилию"
              required
              onChange={onChange}
            />
          </div>
          <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Должность
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <select
                className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-3 px-4 pr-8 rounded"
                value={state.role}
                name="role"
                id="role"
                onChange={onChange}
              >
                <option value="" disabled hidden className="text-gray-800">
                  Выберите должность
                </option>
                {roleList.map((it) => {
                  return <option key={it}>{it}</option>
                })}
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
        </div>
        <div className="-mx-3 md:flex flex-wrap mt-3">
          <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Выберите место работы
            </label>
            {list.map((it) => (
              <div key={it.id} className="mb-2">
                <label htmlFor="address">
                  <input
                    className="mr-2"
                    checked={state.address.index}
                    key={it.id}
                    name={it.id}
                    defaultChecked={props.address.find((item) => item === it.id)}
                    onChange={checkboxChange}
                    type="checkbox"
                  />
                  {it.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className=" flex my-2">
        <Link
          to="/employee/list"
          className="my-3 mr-2 py-2 w-1/3 px-3 bg-green-600 text-white text-center hover:bg-green-700 hover:text-white rounded-lg"
        >
          Отмена
        </Link>
        <button
          className="my-3 mr-2 py-2 w-1/3 px-3 bg-red-600 text-white text-center hover:bg-red-700 hover:text-white rounded-lg"
          type="button"
          onClick={() => SetIsOpen(true)}
        >
          Удалить
        </button>
        <button
          className="my-3 ml-2 py-2 w-2/3 px-3 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg"
          type="button"
          onClick={changeEmployee}
        >
          Сохранить
        </button>
      </div>
      <Modal open={isOpen} onClose={() => SetIsOpen(false)} onSubmit={removeEmployee} />
    </div>
  )
}

export default EmployeeUpdate
