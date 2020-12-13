import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import cx from 'classnames'
import 'react-toastify/dist/ReactToastify.css'
import malePlaceholder from '../../assets/images/profile_placeholder_male.webp'
import orderPlaceholder from '../../assets/images/order_placeholder.webp'
import taskStatuses from '../../lists/task-statuses'

const AutopartViewOrder = (props) => {
  const history = useHistory()

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
    history.push('/autoparts/order/list')
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
                  className="py-2 px-3 bg-blue-600 text-white text-sm hover:bg-blue-700 hover:text-white rounded-full h-22 w-22"
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
                  <li>
                    <b>Гос. номер:</b> {props.regnumber}
                  </li>
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
            {props.status === taskStatuses[5] ? (
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

export default AutopartViewOrder
