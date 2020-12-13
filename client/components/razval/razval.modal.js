import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import cx from 'classnames'
import 'react-toastify/dist/ReactToastify.css'
import statusList from '../../lists/razval.statuses'

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
  activeAdress
}) => {
  const [changeStatus, setChangeStatus] = useState({
    status: ''
  })

  useEffect(() => {
    setChangeStatus({ status: itemId.status })
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
  const dateActive = `${propsDate
    .getDate()
    .toString()
    .replace(/^(\d)$/, '0$1')}.${(propsDate.getMonth() + 1)
    .toString()
    .replace(/^(\d)$/, '0$1')}.${propsDate.getFullYear()}`.toString()

  const dateCreate = `${propsCreateDate
    .getDate()
    .toString()
    .replace(/^(\d)$/, '0$1')}.${(propsCreateDate.getMonth() + 1)
    .toString()
    .replace(/^(\d)$/, '0$1')}.${propsCreateDate.getFullYear()} ${propsCreateDate
    .getHours()
    .toString()
    .replace(/^(\d)$/, '0$1')}:${propsCreateDate
    .getMinutes()
    .toString()
    .replace(/^(\d)$/, '0$1')}`.toString()

  const changeRazval = () => {
    if (!changeStatus) notify('Поле пустое')
    else if (itemType === 'Развал-схождение') {
      updateRazval(itemId.id, changeStatus)
    } else if (itemType === 'Замена масла') {
      updateOil(itemId.id, changeStatus)
    }
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
            <div className="sm:flex justify-center">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                  Дата записи: {dateActive} {itemId.time}
                </h3>
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
                      <p className="text-sm leading-5 text-gray-900 text-left">
                        Телефон: {itemId.phone}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-5 text-gray-900 mb-2">
                    Услуга: <b>{itemType}</b>
                  </p>
                  {itemId.employee ? (
                    <p className="text-sm leading-5 text-gray-900">
                      Принял заказ:{' '}
                      {itemId.employee
                        ? employee.find((it) => it.id === itemId.employee).name
                        : null}{' '}
                      {itemId.employee
                        ? employee.find((it) => it.id === itemId.employee).surname
                        : null}
                    </p>
                  ) : null}
                  <p className="text-sm leading-5 text-gray-900">
                    Заказ принят на:{' '}
                    {dateCreate ? place.find((it) => it.id === itemId.employeeplace).name : null}
                  </p>
                  <p className="text-sm leading-5 text-gray-900">Заказ принят: {dateCreate}</p>
                  {activeAdress === itemId.place ? (
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
                          {statusList.map((it, id) => {
                            return (
                              <option value={it} key={id}>
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
                          'bg-green-400 hover:bg-green-500': itemId.status === statusList[1],
                          'bg-red-400 hover:bg-red-500':
                            itemId.status === statusList[2] || itemId.status === statusList[3]
                        })}
                      >
                        {changeStatus.status}
                      </div>
                    </div>
                  )}
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
                  className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-blue-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                >
                  Сохранить
                </button>
              </span>
            ) : null}
            {activeAdress === itemId.place ? (
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
        </div>
      </div>
    </div>
  )
}

export default ModalView
