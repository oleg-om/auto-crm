import React, { useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useReactToPrint } from 'react-to-print'
import 'react-toastify/dist/ReactToastify.css'
import ComponentToPrint from './autoparts.print'
import malePlaceholder from '../../assets/images/profile_placeholder_male.webp'
import orderPlaceholder from '../../assets/images/order_placeholder.webp'
import taskStatuses from '../../lists/task-statuses'
import { CardStatus } from '../shared/goods/tables/TableStatuses'
import SubmitButtons from '../shared/buttons/OrderSubmitButtons'

const AutopartViewOrder = (props) => {
  const history = useHistory()
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  })

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

  const handlePrintPlusUpdateStatus = () => {
    handlePrint()
    props.updateAutopart(props.id, {
      statusDates: [...props.statusDates, { status: 'Печать сметы', date: dateNew }]
    })
  }

  const employeeListLocal = useSelector((s) => s.employees.list)
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const [state, setState] = useState({
    comment: props.comment,
    prepay: props.prepay
  })
  const changeAutopart = () => {
    props.updateAutopart(props.id, state)
    history.push(`/autoparts/order/list/${props.num ? props.num : ''}`)
    notify('Данные о заказе обновлены')
  }
  const onChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  const createDate = new Date(props.date)

  const totalInWork =
    props.order.length >= 1
      ? props.order.reduce(function fullPrice(acc, rec) {
          if (rec.price && rec.quantity && rec.stat !== 'Интересовался')
            if (rec.price.match(/[0-9]/) && rec.quantity.match(/[0-9]/)) {
              return acc + rec.price * rec.quantity
            }
          return acc
        }, 0)
      : null
  return (
    <div className="p-5">
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
                    <b>Заказ принят на точке: </b>
                    {props.placesList ? props.placesList.name : ''}
                  </li>
                  <li>
                    <b>Дата создания заказа:</b>{' '}
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
                <button
                  className="py-2 px-3 bg-main-600 text-white text-sm hover:bg-main-700 hover:text-white rounded-full h-22 w-22"
                  type="button"
                  onClick={() => notify('У вас недостаточно полномочий')}
                >
                  Редактировать заказ
                </button>
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
                  {props?.phoneSecond ? (
                    <li>
                      <b>Дополнительный телефон:</b> {props.phoneSecond}
                    </li>
                  ) : null}
                </ul>
                {/* <Link
                  to={`/autoparts/editfull/${props.id_autoparts}`}
                  className="py-2 px-3 bg-main-600 text-white text-sm hover:bg-main-700 hover:text-white rounded-full h-22 w-22"
                >
                  Заказы клиента
                </Link> */}
                <button
                  type="submit"
                  onClick={handlePrintPlusUpdateStatus}
                  className="py-2 px-3 bg-main-600 text-white text-sm hover:bg-main-700 hover:text-white rounded-full h-22 w-22"
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

                    <p> Печать сметы</p>
                  </div>
                </button>
                <div className="hidden">
                  <ComponentToPrint
                    ref={componentRef}
                    props={props}
                    helpphone={props.settings.map((it) => it.helpphone)}
                    placesList={props.placesList}
                    employeeListLocal={employeeListLocal}
                    total={totalInWork}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="md:m-3 lg:flex flex-col rounded-lg px-6 py-2 w-auto shadow bg-gray-100 my-2">
            <CardStatus props={props} />
            <div className="px-3">
              <b>Обработал заказ </b>
              <div className="flex-shrink w-full inline-block relative mb-3">
                <div
                  className="block appearance-none w-full bg-white border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                  name="process"
                >
                  {props.processList
                    ? `${props.processList.name} ${props.processList.surname}`
                    : 'Заказ еще не обработан'}
                </div>
              </div>
            </div>
            {props.status === taskStatuses[6] ? (
              <div className="px-3">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="grid-zip"
                >
                  Причина отказа
                </label>
                <div className="flex-shrink w-full inline-block relative mb-3">
                  <div
                    className="block appearance-none w-full bg-white border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                    name="cancelReason"
                  >
                    {props.cancelReason}
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
                    <b>Заказ принят: </b>
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
                  {props.statusDates.map((it) => (
                    <li key={it.date}>
                      <b>{it.status}: </b> {it.date}
                    </li>
                  ))}
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
                  <b>Комментарий при заказе</b>
                  <div className="-mx-3 md:flex mb-2">
                    <div className="overflow-x-auto md:w-auto px-3 mb-6 md:mb-0">
                      <p>{props.comment}</p>
                    </div>
                  </div>
                </div>
              ) : null}
              {props.commentOrder ? (
                <div>
                  <b>Комментарий при обработке</b>
                  <div className="-mx-3 md:flex mb-2">
                    <div className="overflow-x-auto md:w-auto px-3 mb-6 md:mb-0">
                      <p>{props.commentOrder}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {props.order.length === 0 ? null : (
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
                      <th className="p-3 font-bold uppercase bg-gray-100 text-sm text-gray-600 border border-gray-300 table-cell whitespace-no-wrap">
                        Дата прибытия
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.order.map((it, index) => (
                      <tr
                        key={index}
                        className="bg-white lg:hover:bg-gray-100 table-row flex-row lg:flex-row flex-wrap mb-10 lg:mb-0"
                      >
                        <td className="lg:w-7/12 px-4 py-1 text-gray-800 text-left border border-b table-cell relative">
                          {it.autopartItem}
                        </td>
                        <td className="px-4 py-1 text-gray-800 text-center border border-b table-cell relative">
                          {it.quantity}
                        </td>
                        <td className="px-4 py-1 text-gray-800 text-center border border-b table-cell relative">
                          {it.price}
                        </td>
                        <td className="w-full lg:w-auto px-4 py-1 text-gray-800 text-center border border-b hidden md:table-cell relative">
                          <p>{it.price && it.quantity ? it.price * it.quantity : null}</p>
                        </td>
                        <td className="w-full lg:w-auto px-4  py-1 text-gray-800 text-center border border-b table-cell relative">
                          {it.stat}
                        </td>
                        <td className="w-full lg:w-auto px-4  py-1 text-gray-800 text-center border border-b table-cell relative">
                          {it.come}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {props.order.length > 0 ? (
          <div className="-mx-3 md:flex mb-2 flex-row">
            <div className="px-3 mb-6 md:mb-0">
              <div className="flex flex-row">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="grid-city"
                >
                  Общая сумма
                </label>
              </div>
              <p className="ml-3">
                {props.order.length >= 1
                  ? props.order.reduce(function fullPrice(acc, rec) {
                      if (rec.price && rec.quantity)
                        if (rec.price.match(/[0-9]/) && rec.quantity.match(/[0-9]/)) {
                          return acc + rec.price * rec.quantity
                        }
                      return acc
                    }, 0)
                  : null}
              </p>
            </div>
            <div className="px-3 mb-6 md:mb-0">
              <div className="flex flex-row">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="grid-city"
                >
                  Сумма товаров в работе
                </label>
                <button
                  className="ml-3 px-3 rounded-full text-white bg-main-600 opacity-75 text-l hover:opacity-100 hover:bg-main-700"
                  type="button"
                  onClick={() =>
                    notify(
                      'Общая сумма учитывает все товары. Сумма товаров в рвботе не учитывает товары со статусом "Интересовался"'
                    )
                  }
                >
                  ?
                </button>
              </div>
              <p className="ml-3">
                {props.order.length >= 1
                  ? props.order.reduce(function fullPrice(acc, rec) {
                      if (rec.price && rec.quantity && rec.stat !== 'Интересовался')
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
              value={state.comment}
              name="comment"
              id="comment"
              onChange={onChange}
            />
          </div>
        </div>
        <div className="-mx-3 md:flex flex-wrap mt-3" />
      </div>

      <SubmitButtons sendData={changeAutopart} />
    </div>
  )
}

export default AutopartViewOrder
