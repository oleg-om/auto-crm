import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import roleList from '../../lists/role-list'
import SubmitButtons from '../shared/buttons/OrderSubmitButtons'

const EmployeeCreate = (props) => {
  const list = useSelector((s) => s.places.list)
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const history = useHistory()
  const [state, setState] = useState({
    name: '',
    surname: '',
    role: [],
    address: []
  })

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
  const checkboxRoleChange = (e) => {
    const { name, checked } = e.target
    if (checked) {
      setState((prevState) => ({
        ...prevState,
        role: [...prevState.role, name]
      }))
    } else {
      setState((prevState) => ({
        ...prevState,
        role: prevState.role.filter((it) => it !== name)
      }))
    }
  }
  const sendData = () => {
    if (!state.name) notify('Поле Имя пустое')
    else if (!state.surname) notify('Поле Фамилия пустое')
    else if (!state.role) notify('Поле Должность пустое')
    else if (state.address.length === 0) notify('Выберите место работы')
    else {
      props.create(state)
      history.push('/employee/list')
      notify('Запись добавлена')
    }
  }

  return (
    <div>
      <div className="bg-white shadow rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
        <div className="-mx-3 md:flex flex-wrap">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Имя
            </label>
            <input
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              value={state.name}
              name="name"
              id="name"
              placeholder="Введите имя"
              required
              onChange={onChange}
            />
          </div>
          <div className="md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Фамилия
            </label>
            <input
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              value={state.surname}
              name="surname"
              id="surname"
              placeholder="Введите фамилию"
              required
              onChange={onChange}
            />
          </div>
        </div>
        <div className="-mx-3 md:flex flex-wrap mt-3">
          <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Выберите должность
            </label>
            {roleList.map((it, id) => (
              <div key={id} className="mb-2">
                <label htmlFor="role">
                  <input
                    className="mr-2"
                    checked={state.role.index}
                    key={id}
                    name={it}
                    onChange={checkboxRoleChange}
                    type="checkbox"
                  />
                  {it}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="-mx-3 md:flex flex-wrap mt-3">
          <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
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

      <SubmitButtons sendData={sendData} submitText="Создать" />
    </div>
  )
}

export default EmployeeCreate
