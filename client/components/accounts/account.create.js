import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import roleList from '../../lists/account-role-list'
import SubmitButtons from '../shared/buttons/OrderSubmitButtons'
import RequestPassword from './containers/requestPassword'

const AccountCreate = (props) => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const history = useHistory()
  const employeeList = useSelector((s) => s.employees.list)
  const list = useSelector((s) => s.places.list)

  const [state, setState] = useState({
    login: '',
    password: '',
    role: [],
    userName: '',
    place: '',
    requestPasswordForReport: false
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
    if (!state.login) notify('Поле Логин пустое')
    else if (!state.password) notify('Поле Пароль пустое')
    else if (state.role.length === 0) notify('Выберите должность')
    else {
      props.create(state)
      history.push('/account/list')
      notify('Аккаунт добавлен')
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
              value={state.password}
              name="password"
              id="password"
              placeholder="Введите пароль"
              required
              onChange={onChange}
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
              Выберите доступы
            </label>
            {roleList.map((it) => (
              <div key={it.id} className="mb-2">
                <label htmlFor="role">
                  <input
                    className="mr-2"
                    checked={state.role.index}
                    key={it.id}
                    name={it.value}
                    onChange={checkboxChange}
                    type="checkbox"
                  />
                  {it.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <RequestPassword state={state} onChange={onChange} />
        <div
          className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-teal-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Прочтите перед созданием аккаунта</p>
              <p className="text-sm">
                Если аккаунт не является персонализированным (Аккаунт является персонализированным
                если на нем сидит один человек), оставьте поля &quot;Выберите сотрудника&quot; и
                &quot;Выберите место работы пустым&quot; пустым. В противном случае ваше имя и место
                работы будут подставляться при создании и обработки заказов.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SubmitButtons sendData={sendData} submitText="Создать" />
    </div>
  )
}

export default AccountCreate
