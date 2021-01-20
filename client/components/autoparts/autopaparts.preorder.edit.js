import React, { useState, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import cx from 'classnames'
import { useReactToPrint } from 'react-to-print'
import 'react-toastify/dist/ReactToastify.css'
import ComponentToPrint from './autoparts.print'
import malePlaceholder from '../../assets/images/profile_placeholder_male.webp'
import orderPlaceholder from '../../assets/images/order_placeholder.webp'
import taskStatuses from '../../lists/task-statuses'
import cancelStatuses from '../../lists/cancel-statuses'
import autopartStatuses from '../../lists/autoparts-statuses'

const AutopartUpdate = (props) => {
  const history = useHistory()

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  })

  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const employeeListLocal = useSelector((s) => s.employees.list)
  const vendorList = useSelector((s) => s.vendors.list)

  const dateNow = new Date()
  const dateNew = `${dateNow
    .getDate()
    .toString()
    .replace(/^(\d)$/, '0$1')}.${(dateNow.getMonth() + 1)
    .toString()
    .replace(/^(\d)$/, '0$1')}.${dateNow.getFullYear()} ${dateNow
    .getHours()
    .toString()
    .replace(/^(\d)$/, '0$1')}:${dateNow
    .getMinutes()
    .toString()
    .replace(/^(\d)$/, '0$1')}`
  const auth = useSelector((s) => s.auth)
  const [state, setState] = useState({
    status: props.status,
    process: props.process ? props.process : auth.name,
    prepay: props.prepay,
    commentOrder: props.commentOrder,
    order: props.order.length !== 0 ? props.order : [{ autopartItem: '' }],
    dateInWork: props.dateInWork,
    dateFinish: props.dateFinish,
    dateMiscall: props.dateMiscall,
    dateCancel: props.dateCancel,
    cancelReason: props.cancelReason
  })
  const changeAutopart = () => {
    if (!state.process) notify('Поле Обработал заказ пустое')
    else if (!props.dateInWork && state.status === taskStatuses[1]) {
      props.updateAutopart(props.id, { ...state, dateInWork: dateNew })
      history.push('/autoparts/order/list')
      notify('Данные о заказе обновлены, заказ в работе')
    } else if (!props.dateFinish && state.status === taskStatuses[2]) {
      props.updateAutopart(props.id, { ...state, dateFinish: dateNew })
      history.push('/autoparts/order/list')
      notify('Данные о заказе обновлены, заказ выполнен')
    } else if (!props.dateMiscall && state.status === taskStatuses[4]) {
      props.updateAutopart(props.id, { ...state, dateMiscall: dateNew })
      history.push('/autoparts/order/list')
      notify('Данные о заказе обновлены, клиент отказался от заказа')
    } else if (!props.dateCancel && state.status === taskStatuses[5]) {
      props.updateAutopart(props.id, {
        ...state,
        dateCancel: dateNew,
        cancelReason: state.cancelReason
      })
      history.push('/autoparts/order/list')
      notify('Данные о заказе обновлены, клиент отказался от заказа')
    } else {
      props.updateAutopart(props.id, state)
      history.push('/autoparts/order/list')
      notify('Данные о заказе обновлены')
    }
  }
  const onChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const [inputFields, setInputFields] = useState(
    state.order.map((it) => ({
      autopartItem: it.autopartItem,
      quantity: it.quantity,
      price: it.price,
      stat: it.stat,
      vendor: it.vendor,
      come: it.come
    }))
  )

  const handleChangeInput = (index, event) => {
    const values = [...inputFields]
    values[index][event.target.name] = event.target.value
    setInputFields(values)
    setState((prevState) => ({
      ...prevState,
      order: inputFields
    }))
  }

  const handleAddFields = () => {
    setInputFields([
      ...inputFields,
      {
        autopartItem: '',
        quantity: '',
        price: '',
        stat: '',
        vendor: '',
        come: ''
      }
    ])
    setState((prevState) => ({
      ...prevState,
      order: inputFields
    }))
  }

  const handleRemoveFields = (index) => {
    if (index !== 0) {
      const values = [...inputFields]
      values.splice(index, 1)
      setInputFields(values)
      setState((prevState) => ({
        ...prevState,
        order: values
      }))
    }
  }
  const createDate = new Date(props.date)
  return (
    <div>
      <div className="bg-white shadow rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
        <div className="-mx-3 md:flex mb-6 flex-wrap">
          <div className="md:m-3 lg:flex rounded-lg px-6 py-2 w-auto shadow bg-gray-100 my-2">
            <img
              className="h-32 w-32 m-5 rounded-full mx-auto md:mx-0"
              src={orderPlaceholder}
              alt="Олег"
            />
            <div className="text-center md:text-left m-3">
              <h2>Заказ {props.id_autoparts}</h2>
              <div>
                <ul className="mb-4">
                  <li>
                    <b>Принял заказ: </b>
                    {props.employeeList
                      ? `${props.employeeList.name} ${props.employeeList.surname}`
                      : ''}
                  </li>
                  <li>
                    <b>Заказ принят на точке: </b> {props.placesList ? props.placesList.name : ''}
                  </li>
                  <li>
                    <b>Дата создания заказа: </b>
                    {`${createDate
                      .getDate()
                      .toString()
                      .replace(/^(\d)$/, '0$1')}.${(createDate.getMonth() + 1)
                      .toString()
                      .replace(
                        /^(\d)$/,
                        '0$1'
                      )}.${createDate.getFullYear()} ${createDate.getHours()}:${createDate
                      .getMinutes()
                      .toString()
                      .replace(/^(\d)$/, '0$1')}`}
                  </li>
                  <li>
                    <b>Обработал заказ: </b>
                    {props.processList
                      ? `${props.processList.name} ${props.processList.surname}`
                      : 'Заказ еще не обработан'}
                  </li>
                  <li>
                    <b>Предоплата:</b> {props.prepay ? props.prepay : 'Нет'}
                  </li>
                </ul>
                <Link
                  to={`/autoparts/editfull/${props.id_autoparts}`}
                  className="py-2 px-3 bg-blue-600 text-white text-sm hover:bg-blue-700 hover:text-white rounded-full h-22 w-22"
                >
                  Редактировать заказ
                </Link>
              </div>
            </div>
          </div>
          <div className="md:m-3 lg:flex rounded-lg px-6 py-2 w-auto shadow bg-gray-100 my-2">
            <img
              className="h-32 w-32 m-5 rounded-full mx-auto md:mx-0"
              src={malePlaceholder}
              alt="Олег"
            />
            <div className="text-center md:text-left m-3">
              <h2>Клиент</h2>
              <div>
                <ul className="mb-4">
                  <li className="whitespace-normal">
                    <b>Авто:</b> {props.mark} {props.model} {props.gen} {props.mod}
                  </li>
                  {props.regnumber ? (
                    <li>
                      <b>Гос. номер:</b> {props.regnumber}
                    </li>
                  ) : null}
                  <li>
                    <b>VIN:</b> {props.vinnumber}
                  </li>
                  <li>
                    <b>Имя:</b> {props.name}
                  </li>
                  <li>
                    <b>Телефон:</b> {props.phone}
                  </li>
                </ul>
                {/* <Link
                  to={`/autoparts/editfull/${props.id_autoparts}`}
                  className="py-2 px-3 bg-blue-600 text-white text-sm hover:bg-blue-700 hover:text-white rounded-full h-22 w-22"
                >
                  Заказы клиента
                </Link> */}
                <button
                  type="submit"
                  onClick={handlePrint}
                  className="py-2 px-3 bg-blue-600 text-white text-sm hover:bg-blue-700 hover:text-white rounded-full h-22 w-22"
                >
                  <div className="flex flex-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      width="20"
                      height="20"
                      x="0"
                      y="0"
                      viewBox="0 0 512 512"
                      xmlSpace="preserve"
                      className="mr-2"
                    >
                      <g>
                        <path
                          xmlns="http://www.w3.org/2000/svg"
                          d="m414 80h-316c-5.523 0-10-4.477-10-10v-26c0-24.301 19.699-44 44-44h248c24.301 0 44 19.699 44 44v26c0 5.523-4.477 10-10 10z"
                          fill="#ffffff"
                          data-original="#000000"
                        />
                        <path
                          xmlns="http://www.w3.org/2000/svg"
                          d="m458 112h-404c-29.776 0-54 24.224-54 54v188c0 29.776 24.224 54 54 54h34v-80c0-39.701 32.299-72 72-72h192c39.701 0 72 32.299 72 72v80h34c29.776 0 54-24.224 54-54v-188c0-29.776-24.224-54-54-54zm-361.98 120c-13.255 0-24.005-10.745-24.005-24s10.74-24 23.995-24h.01c13.255 0 24 10.745 24 24s-10.745 24-24 24z"
                          fill="#ffffff"
                          data-original="#000000"
                        />
                        <path
                          xmlns="http://www.w3.org/2000/svg"
                          d="m352 304h-192c-13.255 0-24 10.745-24 24v80 32c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24v-32-80c0-13.255-10.745-24-24-24z"
                          fill="#ffffff"
                          data-original="#000000"
                        />
                      </g>
                    </svg>

                    <p> Печать предчека</p>
                  </div>
                </button>
                <div className="hidden">
                  <ComponentToPrint
                    ref={componentRef}
                    props={props}
                    helpphone={props.settings.map((it) => it.helpphone)}
                    placesList={props.placesList}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="md:m-3 lg:flex flex-col rounded-lg px-6 py-2 w-auto shadow bg-gray-100 my-2">
            <div className="text-center md:text-left m-3">
              <div>
                <ul>
                  <li>
                    <b>Текущий статус заказа:</b>
                    <div
                      className={cx('rounded py-1 px-3 text-xs font-bold', {
                        'bg-yellow-400': props.status === taskStatuses[0],
                        'bg-green-400': props.status === taskStatuses[1],
                        'bg-blue-400': props.status === taskStatuses[2],
                        'bg-gray-400': props.status === taskStatuses[3],
                        'bg-purple-400': props.status === taskStatuses[4],
                        'bg-red-400': props.status === taskStatuses[5]
                      })}
                    >
                      {props.status}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="px-3">
              <b>Обработал заказ</b>
              <div className="flex-shrink w-full inline-block relative mb-3">
                <select
                  className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                  value={state.process}
                  name="process"
                  onChange={onChange}
                >
                  <option value="" disabled hidden className="text-gray-800">
                    Выберите сотрудника
                  </option>
                  {employeeListLocal
                    .filter((it) => it.role.includes('Обработка заказов (запчасти)'))
                    .map((it) => {
                      return (
                        <option value={it.id} key={it.name}>
                          {it.name} {it.surname}
                        </option>
                      )
                    })}
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
            <div className="px-3">
              <b>Изменить статус заказа</b>
              <div className="flex-shrink w-full inline-block relative mb-3">
                <select
                  className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                  value={state.status}
                  name="status"
                  onChange={onChange}
                >
                  {taskStatuses.map((it) => (
                    <option key={it}>{it}</option>
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
            {state.status === taskStatuses[5] ? (
              <div className="px-3">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="grid-zip"
                >
                  Причина отказа
                </label>
                <div className="flex-shrink w-full inline-block relative mb-3">
                  <select
                    className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                    value={state.cancelReason}
                    name="cancelReason"
                    onChange={onChange}
                  >
                    {cancelStatuses.map((it) => (
                      <option key={it}>{it}</option>
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
            ) : null}
          </div>
          <div className="md:m-3 lg:flex rounded-lg px-6 py-2 w-auto shadow bg-gray-100 my-2">
            <div className="text-center md:text-left m-3">
              <h2>История заказа</h2>
              <div>
                <ul>
                  <li>
                    <b>Заказ принят: </b>{' '}
                    {`${createDate
                      .getDate()
                      .toString()
                      .replace(/^(\d)$/, '0$1')}.${(createDate.getMonth() + 1)
                      .toString()
                      .replace(
                        /^(\d)$/,
                        '0$1'
                      )}.${createDate.getFullYear()} ${createDate.getHours()}:${createDate
                      .getMinutes()
                      .toString()
                      .replace(/^(\d)$/, '0$1')}`}
                  </li>
                  {props.dateInWork ? (
                    <li>
                      <b>Заказ обработан: </b> {props.dateInWork}
                    </li>
                  ) : null}
                  {props.dateMiscall ? (
                    <li>
                      <b>Недозвон: </b> {props.dateMiscall}
                    </li>
                  ) : null}
                  {props.dateFinish ? (
                    <li>
                      <b>Заказ выдан клиенту: </b> {props.dateFinish}
                    </li>
                  ) : null}
                  {props.dateCancel ? (
                    <li>
                      <b>Отказ от заказа: </b> {props.dateCancel}
                    </li>
                  ) : null}
                  {props.cancelReason ? (
                    <li>
                      <b>Причина отказа: </b> {props.cancelReason}
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
          </div>

          <div className="md:m-3 lg:flex flex-col rounded-lg px-6 py-2 w-auto shadow bg-gray-100 my-2">
            <div className="text-center md:text-left m-3">
              <b>Предварительный заказ</b>
              <div className="-mx-3 md:flex mb-2">
                <div className="overflow-x-auto md:w-auto px-3 mb-6 md:mb-0">
                  {props.preorder.map((it) => (
                    <p key={it.autopartItem}>
                      {it.autopartItem} {it.quantity ? `- ${it.quantity} шт` : null}
                    </p>
                  ))}
                </div>
              </div>
              {props.comment ? (
                <div>
                  <b>Комментарий</b>
                  <div className="-mx-3 md:flex mb-2">
                    <div className="overflow-x-auto md:w-auto px-3 mb-6 md:mb-0">
                      <p>{props.comment}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="-mx-3 md:flex mb-2">
          <div className="md:w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              Заказ у поставщика
            </label>
            <div className="overflow-x-auto md:w-full  mb-6 md:mb-0">
              <table className="border-collapse w-full">
                <thead>
                  <tr>
                    <th className="p-3 font-bold uppercase bg-gray-100 text-sm text-gray-600 border border-gray-300 table-cell">
                      Запчасти
                    </th>
                    <th className="p-3 font-bold uppercase bg-gray-100 text-sm text-gray-600 border border-gray-300 table-cell whitespace-no-wrap">
                      Кол-во
                    </th>
                    <th className="p-3 px-8 font-bold uppercase bg-gray-100 text-sm text-gray-600 border border-gray-300 table-cell">
                      Цена
                    </th>
                    <th className="p-3 px-6 font-bold uppercase bg-gray-100 text-sm text-gray-600 border border-gray-300 hidden md:table-cell">
                      Сумма
                    </th>
                    <th className="p-3 font-bold uppercase bg-gray-100 text-sm text-gray-600 border border-gray-300 table-cell">
                      Статус
                    </th>
                    <th className="p-3 font-bold uppercase bg-gray-100 text-sm text-gray-600 border border-gray-300 table-cell">
                      Поставщик
                    </th>
                    <th className="p-3 font-bold uppercase bg-gray-100 text-sm text-gray-600 border border-gray-300 table-cell whitespace-no-wrap">
                      Дата прибытия
                    </th>
                    <th className="p-3 font-bold uppercase bg-gray-100 text-sm text-gray-600 border border-gray-300 table-cell">
                      Строки
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inputFields.map((inputField, index) => (
                    <tr
                      key={inputField.autopartItem}
                      className="bg-white lg:hover:bg-gray-100 table-row flex-row lg:flex-row flex-wrap mb-10 lg:mb-0"
                    >
                      <td className="lg:w-6/12 p-2 text-gray-800 text-center border border-b table-cell relative">
                        <input
                          className="appearance-none block w-full bg-grey-lighter text-sm text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                          type="text"
                          placeholder="Например: Сайлентблок нижнего рычага задние LEMFORDER"
                          name="autopartItem"
                          value={inputField.autopartItem}
                          defaultValue={
                            state.order.find((it, id) => id === index)
                              ? state.order.find((it, id) => id === index).autopartItem
                              : ''
                          }
                          onChange={(event) => handleChangeInput(index, event)}
                        />
                      </td>
                      <td className="p-2 text-gray-800 text-center border border-b table-cell relative">
                        <input
                          className="w-32 appearance-none block bg-grey-lighter text-sm text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                          name="quantity"
                          type="number"
                          value={inputField.quantity}
                          defaultValue={
                            state.order.find((it, id) => id === index)
                              ? state.order.find((it, id) => id === index).quantity
                              : ''
                          }
                          autoComplete="off"
                          onChange={(event) => handleChangeInput(index, event)}
                        />
                      </td>
                      <td className="p-2 text-gray-800 text-center border border-b table-cell relative">
                        <input
                          className="appearance-none block w-full bg-grey-lighter text-sm text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                          name="price"
                          type="number"
                          value={inputField.price}
                          defaultValue={
                            state.order.find((it, id) => id === index)
                              ? state.order.find((it, id) => id === index).price
                              : ''
                          }
                          autoComplete="off"
                          onChange={(event) => handleChangeInput(index, event)}
                        />
                      </td>
                      <td className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b hidden md:table-cell relative">
                        <p>
                          {inputField.price && inputField.quantity
                            ? inputField.price * inputField.quantity
                            : null}
                        </p>
                      </td>
                      <td className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b table-cell relative">
                        <select
                          className="appearance-none block w-full bg-grey-lighter text-sm text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                          name="stat"
                          value={inputField.stat}
                          defaultValue={
                            state.order.find((it, id) => id === index)
                              ? state.order.find((it, id) => id === index).stat
                              : ''
                          }
                          autoComplete="off"
                          onChange={(event) => handleChangeInput(index, event)}
                        >
                          <option value="" disabled selected hidden className="text-gray-800">
                            Выберите статус
                          </option>
                          {autopartStatuses.map((it) => (
                            <option key={it}>{it}</option>
                          ))}
                        </select>
                      </td>
                      <td className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b table-cell relative">
                        <select
                          className="appearance-none block w-full bg-grey-lighter text-sm text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                          name="vendor"
                          value={inputField.vendor}
                          defaultValue={
                            state.order.find((it, id) => id === index)
                              ? state.order.find((it, id) => id === index).vendor
                              : ''
                          }
                          autoComplete="off"
                          onChange={(event) => handleChangeInput(index, event)}
                        >
                          <option value="" disabled selected hidden className="text-gray-800">
                            Выберите поставщика
                          </option>
                          {vendorList
                            .filter((it) => it.type === 'autoparts')
                            .sort(function sortVendors(a, b) {
                              if (a.name > b.name) {
                                return 1
                              }
                              if (a.name < b.name) {
                                return -1
                              }
                              return 0
                            })
                            .map((it) => (
                              <option key={it} value={it.value}>
                                {it.name}
                              </option>
                            ))}
                          <option value="instock">В наличии</option>
                        </select>
                      </td>
                      <td className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b table-cell relative">
                        <input
                          className="appearance-none block w-full bg-grey-lighter text-sm text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                          type="text"
                          name="come"
                          value={inputField.come}
                          defaultValue={
                            state.order.find((it, id) => id === index)
                              ? state.order.find((it, id) => id === index).come
                              : ''
                          }
                          autoComplete="off"
                          onChange={(event) => handleChangeInput(index, event)}
                        />
                      </td>
                      <td className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b table-cell">
                        <div className="flex flex-row">
                          <button
                            onClick={() => handleRemoveFields(index)}
                            type="button"
                            className="py-1 px-3 bg-red-500 text-white font-bold hover:bg-red-700 hover:text-white rounded-lg mr-1"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleAddFields()}
                            type="button"
                            className="py-1 px-3 bg-blue-500 text-white font-bold hover:bg-blue-700 hover:text-white rounded-lg"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {state.order[0].price && state.order[0].quantity ? (
          <div className="-mx-3 md:flex mb-2">
            <div className="md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-city"
              >
                Сумма
              </label>
              <p className="ml-3">
                {state.order.length >= 1
                  ? state.order.reduce(function fullPrice(acc, rec) {
                      if (rec.price && rec.quantity)
                        if (rec.price.match(/[0-9]/) && rec.quantity.match(/[0-9]/)) {
                          return acc + rec.price * rec.quantity
                        }
                      return acc
                    }, 0)
                  : null}
              </p>
            </div>
          </div>
        ) : null}
        <div className="-mx-3 md:flex mb-2">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              Предоплата
            </label>
            <div className="flex flex-row">
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
                type="text"
                placeholder="Сумма предоплаты"
                value={state.prepay}
                name="prepay"
                id="prepay"
                onChange={onChange}
              />
            </div>
          </div>

          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              Комментарий
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
              type="text"
              placeholder="Оставьте комментарий"
              value={state.commentOrder}
              name="commentOrder"
              id="commentOrder"
              onChange={onChange}
            />
          </div>
        </div>
        <div className="-mx-3 md:flex flex-wrap mt-3" />
      </div>
      <div className=" flex my-2">
        <Link
          to="/autoparts/order/list"
          className="my-3 mr-2 py-2 w-1/3 px-3 bg-red-600 text-white text-center hover:bg-red-700 hover:text-white rounded-lg"
        >
          Отмена
        </Link>
        <button
          className="my-3 ml-2 py-2 w-2/3 px-3 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg"
          type="button"
          onClick={changeAutopart}
        >
          Сохранить
        </button>
      </div>
    </div>
  )
}

export default AutopartUpdate
