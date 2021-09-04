import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Modal from '../Modal.delete'
import 'react-toastify/dist/ReactToastify.css'
import roleList from '../../lists/account-role-list'

const AccountUpdate = (props) => {
  const history = useHistory()

  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const employeeList = useSelector((s) => s.employees.list)
  const list = useSelector((s) => s.places.list)

  const [isOpen, SetIsOpen] = useState(false)
  const [state, setState] = useState({
    login: props.login,
    role: props.role,
    userName: props.userName,
    place: props.place
  })
  const removeAccount = (e) => {
    props.deleteAccount(props._id, e.target.value)
    history.push('/account/list')
    notify('Аккаунт удален')
  }
  const changeAccount = () => {
    if (!state) notify('Поле пустое')
    else {
      props.updateAccount(props._id, state)
      history.push('/account/list')
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
        role: [...prevState.role, name]
      }))
    } else {
      setState((prevState) => ({
        ...prevState,
        role: prevState.role.filter((it) => it !== name)
      }))
    }
  }

  return (
    <div>
      <div className="bg-white shadow rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
        <div className="-mx-3 md:flex flex-wrap">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Логин
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              value={state.login}
              name="login"
              id="login"
              placeholder="Введите логин"
              required
              onChange={onChange}
            />
          </div>
          <div className="md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Пароль
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              name="password"
              id="password"
              disabled
              placeholder="Вы не можете менять пароль. Если забыли пароль создайте новый аккаунт"
              required
            />
          </div>
        </div>
        <div className="-mx-3 md:flex flex-wrap">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Выберите сотрудника
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <select
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.userName}
                name="userName"
                id="userName"
                onChange={onChange}
              >
                <option value="" className="text-gray-800">
                  Общий аккаунт
                </option>
                {employeeList.map((it) => {
                  return (
                    <option value={it.id} key={it.id}>
                      {it.name} {it.surname}
                    </option>
                  )
                })}
              </select>
              <div className="pointer-events-none absolute top-0 mt-2  right-0 flex items-center px-2 text-gray-600">
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
          <div className="md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Выберите место работы
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <select
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.place}
                name="place"
                id="place"
                onChange={onChange}
              >
                <option value="" className="text-gray-800">
                  Общий аккаунт
                </option>
                {list.map((it) => {
                  return (
                    <option value={it.id} key={it.id}>
                      {it.name}
                    </option>
                  )
                })}
              </select>
              <div className="pointer-events-none absolute top-0 mt-2  right-0 flex items-center px-2 text-gray-600">
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
              Выберите должность
            </label>
            {roleList.map((it) => (
              <div key={it.id} className="mb-2">
                <label htmlFor="role">
                  <input
                    className="mr-2"
                    checked={state.role.index}
                    key={it.id}
                    name={it.value}
                    defaultChecked={props.role.find((item) => item === it.value)}
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
          to="/account/list"
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
          onClick={changeAccount}
        >
          Сохранить
        </button>
      </div>
      <Modal open={isOpen} onClose={() => SetIsOpen(false)} onSubmit={removeAccount} />
    </div>
  )
}

export default AccountUpdate
