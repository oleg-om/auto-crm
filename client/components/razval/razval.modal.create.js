import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import NumberFormat from 'react-number-format'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ModalNew = ({
  open,
  onClose,
  timeActive,
  activeDay,
  itemType,
  activeAdress,
  employee,
  createRazval,
  createOil,
  createIsOpen
}) => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const propsDate = new Date(activeDay)
  const OrderDate = `${propsDate.getFullYear()}-${(propsDate.getMonth() + 1)
    .toString()
    .replace(/^(\d)$/, '0$1')}-${propsDate
    .getDate()
    .toString()
    .replace(/^(\d)$/, '0$1')}`.toString()
  const customerList = useSelector((s) => s.customers.list)
  const dispatch = useDispatch()

  const [state, setState] = useState({
    mark: '',
    model: '',
    phone: '',
    employeeplace: '',
    employee: '',
    date: '',
    time: '',
    place: '',
    dateofcreate: ''
  })
  const [access, setAccess] = useState()
  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      time: timeActive,
      place: activeAdress.id,
      employee: employee.name,
      employeeplace: employee.place,
      date: OrderDate,
      dateofcreate: new Date()
    }))
    return () => {}
  }, [timeActive, activeAdress, employee, OrderDate, state.phone, access, createIsOpen])
  const [search, setSearch] = useState()
  const [stateId, setStateId] = useState({
    mark: '',
    model: ''
  })
  const [options, setOptions] = useState({
    mark: [],
    model: []
  })
  console.log(state)
  const [customerOptions, setCustomerOptions] = useState([])
  useEffect(() => {
    if (state.phone !== '') {
      setCustomerOptions(customerList.filter((it) => it.phone === state.phone))
    } else if (state.phone === '' || state.regnumber === '' || state.vinnumber === '') {
      setCustomerOptions([])
    }
  }, [state.phone, state.regnumber, state.vinnumber, customerList])
  useEffect(() => {
    fetch('/api/v1/carmark')
      .then((res) => res.json())
      .then((it) => {
        setOptions((prevState) => ({
          ...prevState,
          mark: it.data
        }))
      })
    return () => {}
  }, [])

  useEffect(() => {
    fetch(`/api/v1/carmodel/${stateId.mark}`)
      .then((res) => res.json())
      .then((it) => {
        setOptions((prevState) => ({
          ...prevState,
          model: it.data
        }))
      })
    return () => {}
  }, [stateId.mark])
  if (!open) return null

  const onChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  const onChangeMark = (e) => {
    const { value } = e.target
    const findCar = options.mark ? options.mark.find((it) => value === it.name) : null
    setState((prevState) => ({
      ...prevState,
      mark: value,
      model: ''
    }))
    setStateId((prevState) => ({
      ...prevState,
      mark: findCar ? findCar.id_car_mark : '',
      model: ''
    }))
  }

  const onChangeModel = (e) => {
    const { value } = e.target
    const finModel = options.model.find((it) => value === it.name)
    setState((prevState) => ({
      ...prevState,
      model: value
    }))
    setStateId((prevState) => ({
      ...prevState,
      model: finModel ? finModel.id_car_model : ''
    }))
  }

  const dateActive = `${propsDate
    .getDate()
    .toString()
    .replace(/^(\d)$/, '0$1')}.${(propsDate.getMonth() + 1)
    .toString()
    .replace(/^(\d)$/, '0$1')}.${propsDate.getFullYear()}`.toString()

  const onSearchChange = (event) => {
    setSearch(event.target.value)
  }
  const applyCustomer = () => {
    const newCustomer = customerList.find((it) => it.id === search)
    if (newCustomer) {
      setState((prevState) => ({
        ...prevState,
        mark: newCustomer.mark,
        model: newCustomer.model
      }))
    }
    return null
  }
  const sendData = () => {
    if (itemType === 'Развал-схождение') {
      if (state.phone === '') notify('Поле телефон пустое')
      else if (state.mark === '') notify('Поле марка авто пустое')
      else if (state.model === '') notify('Поле модель авто пустое')
      else {
        dispatch(() => createRazval(state))
        setState({
          mark: '',
          model: '',
          phone: '',
          employeeplace: '',
          employee: '',
          date: '',
          time: '',
          place: '',
          dateofcreate: ''
        })
        setCustomerOptions([])
        setStateId({
          mark: '',
          model: ''
        })
        setSearch()
      }
    } else if (itemType === 'Замена масла') {
      if (state.phone === '') notify('Поле телефон пустое')
      else if (state.mark === '') notify('Поле марка авто пустое')
      else if (state.model === '') notify('Поле модель авто пустое')
      else {
        dispatch(() => createOil(state))
        setState({
          mark: '',
          model: '',
          phone: '',
          employeeplace: '',
          employee: '',
          date: '',
          time: '',
          place: '',
          dateofcreate: ''
        })
        setCustomerOptions([])
        setStateId({
          mark: '',
          model: ''
        })
        setSearch()
      }
    }
  }

  const sendAccess = () => {
    if (itemType === 'Развал-схождение') {
      dispatch(() =>
        createRazval({
          access: 'false',
          date: state.date,
          time: state.time,
          place: state.place,
          dateofcreate: state.dateofcreate
        })
      )
      setState({
        mark: '',
        model: '',
        phone: '',
        employeeplace: '',
        employee: '',
        date: '',
        time: '',
        place: '',
        dateofcreate: ''
      })
    } else if (itemType === 'Замена масла') {
      dispatch(() =>
        createOil({
          access: 'false',
          date: state.date,
          time: state.time,
          place: state.place,
          dateofcreate: state.dateofcreate
        })
      )
      setState({
        mark: '',
        model: '',
        phone: '',
        employeeplace: '',
        employee: '',
        date: '',
        time: '',
        place: '',
        dateofcreate: ''
      })
    }
  }
  const checkAccess = () => {
    setAccess(true)
    sendAccess()
  }
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <p className="text-sm leading-5 text-gray-900">Услуга: {itemType}</p>
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
                  Дата: {dateActive} {timeActive}
                </h3>
                <div className="mt-2">
                  <p className="text-sm leading-5 text-gray-900">Адрес: {activeAdress.name}</p>

                  <div className="mt-3 flex flex-col">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="phone"
                    >
                      Телефон
                    </label>
                    <div className="flex-shrink w-full inline-block relative">
                      <NumberFormat
                        className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                        format="+7 (###) ###-##-##"
                        mask="_"
                        name="phone"
                        placeholder="Начинайте ввод с 978"
                        value={state.phone}
                        onChange={onChange}
                      />
                    </div>
                  </div>
                  {customerOptions.length >= 1 ? (
                    <div className="mt-4 flex flex-row">
                      <div className="w-full lg:w-auto p-2 text-xs text-gray-800 text-center border border-b block table-cell relative static">
                        <label
                          className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                          htmlFor="search"
                        >
                          Найден клиент
                        </label>
                        <div className="flex-shrink w-full inline-block relative">
                          <select
                            className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                            value={search}
                            name="search"
                            id="searchBlock"
                            onChange={onSearchChange}
                          >
                            <option value="" className="text-gray-800">
                              {customerOptions.length < 1
                                ? 'Клиентов не найдено'
                                : 'Выберите клиента'}
                            </option>
                            {customerOptions.map((it, index) => {
                              return (
                                <option key={index} value={it.id}>
                                  {it.name}, {it.mark} {it.model} {it.regnumber},{it.phone}
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
                      <div className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b text-center flex items-ends">
                        <button
                          onClick={applyCustomer}
                          type="button"
                          className="py-1 px-3 bg-green-600 text-white text-xs hover:text-white rounded-lg"
                        >
                          Использовать
                        </button>
                      </div>
                    </div>
                  ) : null}
                  <div className="mt-3 flex flex-col">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      Марка авто
                    </label>
                    <input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
                      value={state.mark}
                      name="mark"
                      list="mark_list"
                      placeholder="Введите бренд"
                      autoComplete="off"
                      required
                      onChange={onChangeMark}
                    />
                    <datalist id="mark_list">
                      {options.mark.map((it) => (
                        <option value={it.name} label={it.name_rus} key={it.id_car_mark} />
                      ))}
                    </datalist>
                  </div>
                  <div className="mt-3 flex flex-col">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      Модель авто
                    </label>
                    <input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
                      value={state.model}
                      name="model"
                      id="model"
                      list="model_list"
                      placeholder={
                        state.mark.length < 2 ? 'Сначала выберете марку' : 'Выберите модель'
                      }
                      disabled={state.mark.length < 2}
                      autoComplete="off"
                      required
                      onChange={onChangeModel}
                    />
                    {stateId.mark ? (
                      <datalist id="model_list">
                        {options.model.map((it, index) => (
                          <option key={index} value={it.name} label={it.name_rus} />
                        ))}
                      </datalist>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
              <button
                type="button"
                onClick={sendData}
                className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-blue-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
              >
                Добавить запись
              </button>
            </span>
            {activeAdress.id === employee.place ? (
              <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                <button
                  type="button"
                  onClick={checkAccess}
                  className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                >
                  Запрет на запись
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

export default ModalNew
