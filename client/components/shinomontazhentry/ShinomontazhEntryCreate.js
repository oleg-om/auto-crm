import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import 'fix-date'
import NumberFormat from 'react-number-format'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ComponentToPrint from '../razval/razval.pre.print'

export function isoDateWithoutTimeZone(date) {
  if (!date) return date

  const dt = new Date(date)
  const timestamp = dt.getTime() - dt.getTimezoneOffset() * 60000
  const correctDate = new Date(timestamp)
  // correctDate.setUTCHours(0, 0, 0, 0); // uncomment this if you want to remove the time
  if (correctDate) {
    return correctDate?.toISOString()
  }
  return ''
}

const ShinomontazhEntryCreate = ({
  open,
  onClose,
  timeActive,
  activeDay,
  itemType,
  activeAdress,
  employee,
  createFunc,
  createCust,
  createIsOpen,
  activePost
}) => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const [showStorageOptions, setShowStorageOptions] = useState(false)
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  })

  const propsDate = new Date(activeDay)

  const OrderDate = `${propsDate.getFullYear()}-${(propsDate.getMonth() + 1)
    .toString()
    .replace(/^(\d)$/, '0$1')}-${propsDate
    .getDate()
    .toString()
    .replace(/^(\d)$/, '0$1')}`.toString()

  const dispatch = useDispatch()

  const [state, setState] = useState({
    mark: '',
    model: '',
    regnumber: '',
    phone: '',
    employeeplace: '',
    employeePreentry: '',
    // date: '',
    // time: '',
    place: '',
    name: '',
    datePreentry: '',
    box: ''
  })

  const [access, setAccess] = useState()

  const [storageOptions, setStorageOptions] = useState()

  const throttlingStorage = useRef(false)

  useEffect(() => {
    if (throttlingStorage.current) {
      return
    }
    if (state?.storage) {
      throttlingStorage.current = true
      setTimeout(() => {
        throttlingStorage.current = false
        fetch(`/api/v1/storagefilter?page=1&number=${state?.storage}`)
          .then((r) => r.json())
          .then((st) => {
            setStorageOptions(st)
          })
      }, 200)
    }
    // return () => {}
  }, [state?.storage])

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      place: activeAdress.id,
      employeePreentry: employee.name,
      employeeplace: employee.place,
      // datePreentry: isoDateWithoutTimeZone(new Date(`${OrderDate} ${timeActive}`)),
      datePreentry: new Date(`${OrderDate} ${timeActive}`),
      box: activePost,
      status: 'Новая запись'
    }))
    return () => {}
  }, [timeActive, activeAdress, employee, OrderDate, state.phone, access, createIsOpen, activePost])
  const [search, setSearch] = useState()

  const [stateId, setStateId] = useState({
    mark: '',
    model: ''
  })
  const [options, setOptions] = useState({
    mark: [],
    model: []
  })
  const [activeCustomer, setActiveCustomer] = useState('')
  const [customerOptions, setCustomerOptions] = useState([])
  // useEffect(() => {
  //   if (state.phone !== '' || state.regnumber !== '') {
  //     setCustomerOptions(
  //       customerList.filter(
  //         (it) =>
  //           (it.phone === state.phone && it.phone !== '' && it.phone) ||
  //           (it.regnumber === state.regnumber && it.regnumber !== '' && it.regnumber)
  //       )
  //     )
  //   } else if (state.phone === '' || state.regnumber === '' || state.vinnumber === '') {
  //     setCustomerOptions([])
  //   }
  // }, [state.phone, state.regnumber, state.vinnumber, customerList])
  const throttling = useRef(false)

  useEffect(() => {
    // if (throttling.current) {
    //   return
    // }

    // If there is no search term, do not make API call
    throttling.current = true
    setTimeout(() => {
      throttling.current = false
      const phoneArray = state.phone ? state.phone.split(' ') : ['', '']
      const phoneToRest = phoneArray[phoneArray.length - 1].replace(/_/g, '')

      if (
        (state.phone !== '' && phoneToRest.length > 6) ||
        (state.regnumber !== '' && state.regnumber.length > 4)
      ) {
        fetch(
          `/api/v1/customerfind/${state.regnumber ? state.regnumber : 'reg'}/${
            state.vinnumber ? state.vinnumber : 'vin'
          }/${state.phone ? phoneToRest : 'phone'}`
        )
          .then((res) => res.json())
          .then((it) => {
            setCustomerOptions(it.data)
          })
      } else if (state.phone === '' && state.regnumber === '') {
        setCustomerOptions([])
      }
    }, 200)
  }, [state.phone, state.regnumber, state.vinnumber])

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
    if (stateId.mark !== '') {
      fetch(`/api/v1/carmodel/${stateId.mark}`)
        .then((res) => res.json())
        .then((it) => {
          setOptions((prevState) => ({
            ...prevState,
            model: it.data
          }))
        })
    }
    return () => {}
  }, [stateId.mark])
  if (!open) return null

  const onChange = (e) => {
    const { name, value } = e.target

    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
    if (name === 'storage') {
      setShowStorageOptions(true)
    }
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
    const newCustomer = customerOptions.find((it) => it.id === search)
    if (newCustomer) {
      setState((prevState) => ({
        ...prevState,
        mark: newCustomer.mark,
        model: newCustomer.model,
        regnumber: newCustomer.regnumber,
        name: newCustomer.name,
        phone: newCustomer.phone,
        kuzov: newCustomer?.kuzov || null,
        diametr: newCustomer?.diametr || null
      }))
      setActiveCustomer(newCustomer.id)
    }
    return null
  }

  const onChangeCustomerUppercaseRussian = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
        .toUpperCase()
        .replace(/\s/g, '')
        .replace(/[^а-яё0-9]/i, '')
    }))
  }

  const sendData = () => {
    if (itemType) {
      if (propsDate > new Date() && state.phone === '') notify('Поле телефон пустое')
      else if (propsDate < new Date() && state.phone === '' && state.regnumber === '')
        notify('Поле телефон и гос.номер пустое. Заполните одно из них')
      else if (state.mark === '') notify('Поле марка авто пустое')
      else if (state.model === '') notify('Поле модель авто пустое')
      else if (!activeCustomer) {
        dispatch(() => createFunc({ ...state, customerId: activeCustomer || null }))
        dispatch(() => createCust(state))
        setState({
          mark: '',
          model: '',
          phone: '',
          regnumber: '',
          employeeplace: '',
          employeePreentry: '',
          //   date: '',
          //   time: '',
          place: '',
          name: '',
          datePreentry: '',
          box: ''
        })
        setCustomerOptions([])
        setStateId({
          mark: '',
          model: ''
        })
        setSearch()
        setActiveCustomer('')
      } else {
        dispatch(() => createFunc({ ...state, customerId: activeCustomer || null }))
        setState({
          mark: '',
          model: '',
          phone: '',
          regnumber: '',
          employeeplace: '',
          employeePreentry: '',
          //   date: '',
          //   time: '',
          place: '',
          name: '',
          datePreentry: '',
          box: ''
        })
        setCustomerOptions([])
        setStateId({
          mark: '',
          model: ''
        })
        setSearch()
        setActiveCustomer('')
      }
    }
  }

  const sendAccess = () => {
    dispatch(() =>
      createFunc({
        access: 'false',
        date: state.date,
        // time: state.time,
        place: state.place,
        datePreentry: state.datePreentry,
        box: state?.box || null
      })
    )
    setState({
      mark: '',
      model: '',
      phone: '',
      regnumber: '',
      employeeplace: '',
      employeePreentry: '',
      //  date: '',
      //   time: '',
      place: '',
      name: '',
      datePreentry: '',
      box: ''
    })
  }
  const checkAccess = () => {
    setAccess(true)
    sendAccess()
  }
  const closeFunc = () => {
    onClose()
    setState({
      mark: '',
      model: '',
      phone: '',
      regnumber: '',
      employeeplace: '',
      employeePreentry: '',
      //   date: '',
      //   time: '',
      place: '',
      name: '',
      datePreentry: '',
      box: ''
    })
    setCustomerOptions([])
    setStateId({
      mark: '',
      model: ''
    })
    setSearch()
  }

  const setCustomerFromStorage = (st) => {
    const storageName = st?.name ? { name: st?.name } : {}
    const storagePhone = st?.phone ? { phone: st?.phone } : {}
    const storageMark = st?.mark ? { mark: st?.mark } : {}
    const storageModel = st?.model ? { model: st?.model } : {}
    const storageReg = st?.regnumber ? { regnumber: st?.regnumber } : {}
    setState((prevState) => ({
      ...prevState,
      ...storageName,
      ...storagePhone,
      ...storageMark,
      ...storageModel,
      ...storageReg
    }))
    setShowStorageOptions(false)
    setActiveCustomer(1)
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
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                  Дата: {dateActive} {timeActive}
                </h3>
                <div className="mt-2">
                  <p className="text-sm leading-5 text-gray-900">Адрес: {activeAdress.name}</p>
                  {state.box ? (
                    <p className="text-sm leading-5 text-gray-900">Пост: {state.box}</p>
                  ) : null}
                  <div className="mt-3 flex flex-col">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="phone"
                    >
                      Гос. номер
                    </label>
                    <div className="flex-shrink w-full inline-block relative">
                      <input
                        className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                        type="text"
                        placeholder="Русскими буквами, необязательное поле"
                        value={state.regnumber}
                        name="regnumber"
                        id="regnumber"
                        onChange={onChangeCustomerUppercaseRussian}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      Марка авто
                    </label>
                    <input
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
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
                      className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
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
                  <div className="mt-3 flex flex-col">
                    <label
                      className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                      htmlFor="phone"
                    >
                      Имя
                    </label>
                    <div className="flex-shrink w-full inline-block relative">
                      <input
                        className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Имя клиента"
                        value={state.name}
                        onChange={onChange}
                      />
                    </div>
                  </div>
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
                        // list="storage_list"
                        placeholder="Номер хранения"
                        value={state.storage}
                        onChange={onChange}
                      />
                      {showStorageOptions &&
                      state?.storage &&
                      storageOptions &&
                      storageOptions?.data?.length ? (
                        <div className="absolute flex bg-gray-300 right-0 left-0">
                          {storageOptions?.data.map((it, index) => (
                            // eslint-disable-next-line jsx-a11y/aria-role, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                            <button
                              type="button"
                              className="p-3"
                              key={index}
                              onClick={() => setCustomerFromStorage(it)}
                            >{`№${it.id_storages}, ${it?.phone || ''}, ${it?.name || ''}`}</button>
                          ))}
                        </div>
                      ) : null}
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
                        {activeCustomer !== '' ? (
                          <p className="text-left">✔ Вы выбрали клиента</p>
                        ) : null}
                      </div>
                      <div className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b flex items-ends">
                        {!search ? (
                          <button
                            onClick={() => notify('Выберите клиента')}
                            type="button"
                            className="py-1 px-3 bg-blue-600 text-white text-xs hover:text-white rounded-lg"
                          >
                            Выберите клиента
                          </button>
                        ) : null}
                        {activeCustomer === '' && search ? (
                          <button
                            onClick={applyCustomer}
                            type="button"
                            className="py-1 px-3 bg-green-600 text-white text-xs hover:text-white rounded-lg"
                          >
                            Использовать
                          </button>
                        ) : null}
                        {activeCustomer !== '' && search ? (
                          <button
                            onClick={() => setActiveCustomer('')}
                            type="button"
                            className="py-1 px-3 bg-red-600 text-white text-xs hover:text-white rounded-lg"
                          >
                            Сбросить
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                  {!activeCustomer &&
                  customerOptions.length === 0 &&
                  (state.phone !== '' || state.regnumber !== '') &&
                  state.mark !== '' &&
                  state.model !== '' ? (
                    <p className="text-left py-1 mt-3 px-2 bg-green-200 text-sm text-gray-900 rounded">
                      Клиент в базе данных не найден. Будет создан новый клиент. Проверте введенные
                      данные
                    </p>
                  ) : null}
                  {customerOptions.length >= 1 &&
                  !activeCustomer &&
                  state.phone !== '' &&
                  state.mark !== '' &&
                  state.model !== '' ? (
                    <p className="text-left py-1 mt-3 px-2 bg-green-200 text-sm text-gray-900 rounded">
                      Клиент не выбран. Если нужный клиент найден, выберите из списка. Иначе будет
                      создан новый клиент
                    </p>
                  ) : null}
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
                onClick={closeFunc}
                className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
              >
                Отмена
              </button>
            </span>
            <div className="hidden">
              <ComponentToPrint
                ref={componentRef}
                props={state}
                placesList={activeAdress}
                itemType={itemType}
                OrderDate={dateActive}
                OrderTime={timeActive}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShinomontazhEntryCreate
