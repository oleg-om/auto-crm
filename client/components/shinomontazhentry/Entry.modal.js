/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import cx from 'classnames'
import { useReactToPrint } from 'react-to-print'
import ComponentToPrint from '../razval/razval.pre.print'
import 'react-toastify/dist/ReactToastify.css'
import { getTime } from './ShinomontazhEntryRow'
import { isoDateWithoutTimeZone } from './ShinomontazhEntryCreate'
import OilType from '../razval/containers/OilType'

const statusList = [
  'Новая запись',
  'Работа выполнена',
  'Клиент отменил запись',
  'Клиент не приехал',
  'Авто требует ремонта'
  // 'Оплачено',
  // 'Терминал',
  // 'Безнал'
]

export const getDate = (dt) => {
  if (dt) {
    const year = dt.slice(2, 4)
    const month = dt.slice(5, 7)
    const day = dt.slice(8, 10)
    return `${day}.${month}.${year}`
  }
  return dt
}

export const formatUtcDate = (dt) => {
  return `${getDate(isoDateWithoutTimeZone(dt))} ${getTime(isoDateWithoutTimeZone(dt))}`
}

const ModalView = ({
  open,
  onClose,
  itemId,
  itemType,
  updateRazval,
  updateOil,
  place,
  employee,
  changeItem,
  activeAdress,
  preentryType
}) => {
  const [changeStatus, setChangeStatus] = useState({
    status: '',
    staroge: null,
    comment: '',
    purchasedFromUs: false,
    bottledOil: false
  })

  const isShinomontazh = preentryType === 'shinomontazh'
  // const isSto = preentryType === 'sto'
  const isOil = preentryType === 'oil'

  const [storageOptions, setStorageOptions] = useState()

  const throttlingStorage = useRef(false)

  useEffect(() => {
    if (throttlingStorage.current) {
      return
    }
    if (changeStatus?.storage) {
      throttlingStorage.current = true
      setTimeout(() => {
        throttlingStorage.current = false
        fetch(`/api/v1/storagefilter?page=1&number=${changeStatus?.storage}`)
          .then((r) => r.json())
          .then((st) => {
            setStorageOptions(st)
          })
      }, 500)
    }
    // return () => {}
  }, [changeStatus?.storage])

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  })

  useEffect(() => {
    setChangeStatus({
      status: itemId.status,
      storage: itemId?.storage || null,
      comment: itemId?.comment || '',
      purchasedFromUs: itemId?.purchasedFromUs || false,
      bottledOil: itemId?.bottledOil || false
    })
    return () => {}
  }, [itemId])
  if (!open) return null
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const onChangeStatus = (e) => {
    const { name, value } = e.target
    setChangeStatus((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const openEditModal = () => {
    changeItem()
  }

  const propsDate = new Date(itemId.date)
  const propsCreateDate = new Date(itemId.dateofcreate)

  const formatDate = (dt) =>
    `${dt
      .getDate()
      .toString()
      .replace(/^(\d)$/, '0$1')}.${(dt.getMonth() + 1)
      .toString()
      .replace(/^(\d)$/, '0$1')}.${dt.getFullYear()}`.toString()

  const formatFullDate = (dt) =>
    `${dt
      .getDate()
      .toString()
      .replace(/^(\d)$/, '0$1')}.${(dt.getMonth() + 1)
      .toString()
      .replace(/^(\d)$/, '0$1')}.${dt.getFullYear()} ${dt
      .getHours()
      .toString()
      .replace(/^(\d)$/, '0$1')}:${dt
      .getMinutes()
      .toString()
      .replace(/^(\d)$/, '0$1')}`.toString()

  const dateActive = formatDate(propsDate)

  const dateCreate = formatFullDate(propsCreateDate)

  const changeRazval = () => {
    if (!changeStatus?.status) notify('Поле пустое')
    updateRazval(itemId.id, changeStatus)
  }
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75" />
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" />
        &#8203;
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-end">
              <button
                type="submit"
                title="Печать предчека"
                onClick={handlePrint}
                className="p-1 px-3 bg-gray-200 text-gray-700 hover:text-gray-600 border border-gray-600 hover:bg-gray-400 rounded h-22 w-22"
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    width="18"
                    height="18"
                    x="0"
                    y="0"
                    viewBox="0 0 512 512"
                    xmlSpace="preserve"
                    className="block m-auto"
                  >
                    <g>
                      <path
                        xmlns="http://www.w3.org/2000/svg"
                        d="m414 80h-316c-5.523 0-10-4.477-10-10v-26c0-24.301 19.699-44 44-44h248c24.301 0 44 19.699 44 44v26c0 5.523-4.477 10-10 10z"
                        fill="#4a5568"
                        data-original="#000000"
                      />
                      <path
                        xmlns="http://www.w3.org/2000/svg"
                        d="m458 112h-404c-29.776 0-54 24.224-54 54v188c0 29.776 24.224 54 54 54h34v-80c0-39.701 32.299-72 72-72h192c39.701 0 72 32.299 72 72v80h34c29.776 0 54-24.224 54-54v-188c0-29.776-24.224-54-54-54zm-361.98 120c-13.255 0-24.005-10.745-24.005-24s10.74-24 23.995-24h.01c13.255 0 24 10.745 24 24s-10.745 24-24 24z"
                        fill="#4a5568"
                        data-original="#000000"
                      />
                      <path
                        xmlns="http://www.w3.org/2000/svg"
                        d="m352 304h-192c-13.255 0-24 10.745-24 24v80 32c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24v-32-80c0-13.255-10.745-24-24-24z"
                        fill="#4a5568"
                        data-original="#000000"
                      />
                    </g>
                  </svg>
                </div>
              </button>
            </div>
            <div className="sm:flex justify-center">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4">
                {itemId?.dateStart ? (
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                    Дата Выполнения: {formatUtcDate(itemId?.dateStart)}
                  </h3>
                ) : (
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                    Дата записи: {formatUtcDate(itemId?.datePreentry)}
                  </h3>
                )}
                <p className="text-sm leading-5 text-gray-900 mt-2 mb-3">
                  {/* Адрес: {dateCreate ? place.find((it) => it.id === itemId.place).name : null} */}
                </p>
                {itemId?.box ? (
                  <p className="text-sm leading-5 text-gray-900">Пост: {itemId.box}</p>
                ) : null}
                <div className="mt-2">
                  <div className="flex flex-row appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded mb-2">
                    <div className="mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        width="45"
                        height="45"
                      >
                        <g id="_13-car" data-name="13-car">
                          <g id="glyph">
                            <path d="M120,236a52,52,0,1,0,52,52A52.059,52.059,0,0,0,120,236Zm0,76a24,24,0,1,1,24-24A24,24,0,0,1,120,312Z" />
                            <path d="M408,236a52,52,0,1,0,52,52A52.059,52.059,0,0,0,408,236Zm0,76a24,24,0,1,1,24-24A24,24,0,0,1,408,312Z" />
                            <path d="M477.4,193.04,384,176l-79.515-65.975A44.109,44.109,0,0,0,276.526,100H159.38a43.785,43.785,0,0,0-34.359,16.514L74.232,176H40A36.04,36.04,0,0,0,4,212v44a44.049,44.049,0,0,0,44,44h9.145a64,64,0,1,1,125.71,0h162.29a64,64,0,1,1,125.71,0H472a36.04,36.04,0,0,0,36-36V228.632A35.791,35.791,0,0,0,477.4,193.04ZM180,164a12,12,0,0,1-12,12H115.245a6,6,0,0,1-4.563-9.9l34.916-40.9A12,12,0,0,1,154.724,121H168a12,12,0,0,1,12,12Zm60,56H224a12,12,0,0,1,0-24h16a12,12,0,0,1,0,24Zm94.479-43.706-114.507-.266a12,12,0,0,1-11.972-12V133a12,12,0,0,1,12-12h57.548a12,12,0,0,1,7.433,2.58l53.228,42A6,6,0,0,1,334.479,176.294Z" />
                          </g>
                        </g>
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm leading-5 text-gray-900 text-left">
                        Авто: {itemId.mark} {itemId.model}
                      </p>
                      {itemId.regnumber ? (
                        <p className="text-sm leading-5 text-gray-900 text-left">
                          Гос.номер: {itemId.regnumber}
                        </p>
                      ) : null}
                      {itemId.phone ? (
                        <p className="text-sm leading-5 text-gray-900 text-left">
                          Телефон: {itemId.phone}
                        </p>
                      ) : null}
                      {itemId.name ? (
                        <p className="text-sm leading-5 text-gray-900 text-left">
                          Имя клиента: {itemId.name}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <p className="text-sm leading-5 text-gray-900 mb-2">
                    Услуга: <b>{itemType}</b>
                  </p>
                  <p className="text-sm leading-5 text-gray-900 mb-2">
                    Номер заказа: <b>{itemId[`id_${isOil ? 'sto' : preentryType}s`]}</b>
                  </p>
                  {/* {itemId?.storage ? (
                    <p className="text-sm leading-5 text-gray-900 mb-2">
                      Номер хранения: <b>{itemId.storage}</b>
                    </p>
                  ) : null} */}
                  {/* {itemId.employee ? (
                    <p className="text-sm leading-5 text-gray-900">
                      Принял заказ:{' '}
                      {itemId.employee
                        ? employee.find((it) => it.id === itemId.employee).name
                        : null}
                      {itemId.employee
                        ? employee.find((it) => it.id === itemId.employee).surname
                        : null}
                    </p>
                  ) : null} */}
                  {itemId?.employeeplace ? (
                    <p className="text-sm leading-5 text-gray-900">
                      Заказ принят на:{' '}
                      {dateCreate ? place.find((it) => it.id === itemId.employeeplace).name : null}
                    </p>
                  ) : null}
                  {itemId.dateofcreate ? (
                    <p className="text-sm leading-5 text-gray-900">Заказ принят: {dateCreate}</p>
                  ) : null}
                  {isShinomontazh ? (
                    <div className="mt-3 flex flex-col">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="phone"
                      >
                        Хранение, №
                      </label>
                      <div className="flex-shrink w-full inline-block relative">
                        <input
                          className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                          type="number"
                          name="storage"
                          id="storage"
                          list="storage_list"
                          placeholder="Номер хранения"
                          value={changeStatus?.storage || ''}
                          onChange={onChangeStatus}
                        />
                        {changeStatus?.storage && storageOptions && storageOptions?.data?.length ? (
                          <datalist id="storage_list">
                            {storageOptions?.data.map((it, index) => (
                              <option
                                key={index}
                                value={it.id_storages}
                                label={`№${it.id_storages}, ${it?.phone || ''}, ${it?.name || ''}`}
                              />
                            ))}
                          </datalist>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                  {isOil ? (
                    <>
                      {activeAdress === itemId.place &&
                      itemId.status !== 'Оплачено' &&
                      itemId.status !== 'Работа выполнена' &&
                      itemId.status !== 'Терминал' &&
                      itemId.status !== 'Безнал' ? (
                        <OilType onChange={onChangeStatus} state={changeStatus} />
                      ) : (
                        <OilType onChange={() => {}} state={changeStatus} />
                      )}
                    </>
                  ) : null}
                  {activeAdress === itemId.place &&
                  itemId.status !== 'Оплачено' &&
                  itemId.status !== 'Работа выполнена' &&
                  itemId.status !== 'В работе' &&
                  itemId.status !== 'Терминал' &&
                  itemId.status !== 'Отмена' &&
                  itemId.status !== 'Безнал' &&
                  itemId.status !== 'Комбинированный' ? (
                    <div className="mt-3 flex flex-col">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-first-name"
                      >
                        Выберите статус записи
                      </label>
                      <div className="flex-shrink w-full inline-block relative mb-3">
                        <select
                          className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                          value={changeStatus.status}
                          name="status"
                          id="status"
                          onChange={onChangeStatus}
                        >
                          <option value="" disabled hidden className="text-gray-800">
                            Выберите статус
                          </option>
                          {statusList.map((it) => {
                            return (
                              <option value={it} key={it}>
                                {it}
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
                  ) : (
                    <div className="mt-3 flex flex-col">
                      <label
                        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                        htmlFor="grid-first-name"
                      >
                        Статус записи
                      </label>
                      <div
                        className={cx('rounded p-2', {
                          'bg-yellow-400 hover:bg-yellow-500': itemId.status === statusList[0],
                          'bg-orange-400 hover:bg-orange-500': itemId.status === 'В работе',
                          'bg-green-400 hover:bg-green-500':
                            itemId.status === 'Оплачено' ||
                            itemId.status === 'Работа выполнена' ||
                            itemId.status === 'Терминал' ||
                            itemId.status === 'Безнал' ||
                            itemId.status === 'Комбинированный',
                          'bg-red-400 hover:bg-red-500':
                            itemId.status === statusList[2] ||
                            itemId.status === statusList[3] ||
                            itemId.status === statusList[4] ||
                            itemId.status === 'Отмена'
                        })}
                      >
                        {changeStatus.status}
                      </div>
                    </div>
                  )}
                  <div className="mt-3 flex flex-col">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="comment"
                    >
                      Комментарий
                    </label>
                    <div className="flex-shrink w-full inline-block relative">
                      <input
                        className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                        type="text"
                        name="comment"
                        id="comment"
                        placeholder="Примечание"
                        value={changeStatus.comment}
                        onChange={onChangeStatus}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {activeAdress === itemId.place ? (
              <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                <button
                  type="button"
                  onClick={changeRazval}
                  className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-main-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-main-500 focus:outline-none focus:border-main-700 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                >
                  Сохранить
                </button>
              </span>
            ) : null}
            {activeAdress === itemId.place && itemId.status === 'Новая запись' ? (
              <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                <a
                  href={`/${isOil ? 'sto' : preentryType}/edit/${
                    itemId[`id_${isOil ? 'sto' : preentryType}s`]
                  }?from=preentry`}
                  className="inline-flex whitespace-nowrap justify-center w-full rounded-md border border-transparent px-4 py-2 bg-orange-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                >
                  В работу
                </a>
              </span>
            ) : null}
            {activeAdress === itemId.place &&
            itemId.status !== 'Оплачено' &&
            itemId.status !== 'В работе' &&
            itemId.status !== 'Терминал' &&
            itemId.status !== 'Безнал' &&
            itemId.status !== 'Комбинированный' ? (
              <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                <button
                  type="button"
                  onClick={openEditModal}
                  className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                >
                  Редактировать
                </button>
              </span>
            ) : null}
            <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
              >
                Отмена
              </button>
            </span>
          </div>
          <div className="hidden">
            <ComponentToPrint
              ref={componentRef}
              props={itemId}
              placesList={dateCreate ? place.find((it) => it.id === itemId.place) : null}
              itemType={itemType}
              OrderDate={formatUtcDate(itemId.datePreentry || itemId.dateStart)}
              OrderTime=""
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalView
