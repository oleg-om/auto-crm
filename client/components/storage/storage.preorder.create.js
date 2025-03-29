import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import NumberFormat from 'react-number-format'
import cx from 'classnames'
import 'react-toastify/dist/ReactToastify.css'
// import tyresList from '../../lists/tyres/tyres'
// import sizeOneList from '../../lists/tyres/sizeone'
// import sizeTwoList from '../../lists/tyres/sizetwo'
// import sizeThreeList from '../../lists/tyres/sizethree'
import FirstColumn from './moduls/firstcolumn'
import TyreColumn from './moduls/tyrecolumn'
import Statuses from '../../lists/storages-statuses'
import SubmitButtons from '../shared/buttons/OrderSubmitButtons'

const StoragesCreate = (props) => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const history = useHistory()
  const list = useSelector((s) => s.places.list)
  const employeeList = useSelector((s) => s.employees.list)
  // const customerList = useSelector((s) => s.customers.list)
  const auth = useSelector((s) => s.auth)

  const [inputFields, setInputFields] = useState([
    { tyreItem: '', type: '1', mode: 'full', brand: '' }
  ])

  const [regNumber, setRegNumber] = useState([])
  const [keyboard, setKeyboard] = useState(true)
  const [regOpen, setRegOpen] = useState(false)

  const [options, setOptions] = useState({
    mark: [],
    model: [],
    gen: [],
    mod: []
  })
  const [search, setSearch] = useState()
  const [stateId, setStateId] = useState({
    mark: '',
    model: '',
    gen: '',
    mod: ''
  })

  const [activeCustomer, setActiveCustomer] = useState('')
  const [state, setState] = useState({
    employee: auth.name,
    place: auth.place,
    regnumber: '',
    mark: '',
    model: '',
    preorder: [],
    gen: '',
    mod: '',
    name: '',
    phone: '',
    comment: '',
    date: new Date(),
    payment: 'no',
    dateStart: '',
    dateFinish: '',
    doplata: '',
    comment2: '',
    phoneSecond: ''
  })
  const [customer, setCustomer] = useState({
    regnumber: '',
    mark: '',
    model: '',
    name: '',
    phone: '',
    idOfItem: ''
  })

  useEffect(() => {
    if (state.payment === 'free') {
      setState((prevState) => ({
        ...prevState,
        comment: 0
      }))
    }
    return () => {}
  }, [state.payment])

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

  useEffect(() => {
    if (state.employee === '' && auth.name) {
      setState((prevState) => ({
        ...prevState,
        employee: auth.name
      }))
    }
    return () => {}
  }, [state.employee, auth.name])
  useEffect(() => {
    if (state.place === '' && auth.place) {
      setState((prevState) => ({
        ...prevState,
        place: auth.place
      }))
    }
    return () => {}
  }, [state.place, auth.place])

  useEffect(() => {
    const date = new Date()
    const today = date.toISOString().substr(0, 10)
    setState((prevState) => ({
      ...prevState,
      dateStart: today
    }))

    return () => {}
  }, [])

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      name: prevState.name.replace(/( |^)[а-яёa-z]/g, function (x) {
        return x.toUpperCase()
      })
    }))

    return () => {}
  }, [state.name])

  const [customerOptions, setCustomerOptions] = useState([])
  // useEffect(() => {
  //   if (state.phone !== '' || state.regnumber !== '') {
  //     setCustomerOptions(
  //       customerList.filter(
  //         (it) =>
  //           (it.phone === state.phone && it.phone !== '' && state.phone !== '') ||
  //           (it.regnumber === state.regnumber && it.regnumber !== '' && state.regnumber !== '')
  //       )
  //     )
  //   } else if (state.phone === '' || state.regnumber === '') {
  //     setCustomerOptions([])
  //   }
  // }, [state.phone, state.regnumber, customerList])

  useEffect(() => {
    const phoneArray = state.phone.split(' ')
    const phoneToRest = phoneArray[phoneArray.length - 1].replace(/_/g, '')
    if (
      (state.phone !== '' && phoneToRest.length > 6) ||
      (state.regnumber !== '' && state.regnumber.length > 4)
    ) {
      fetch(
        `/api/v1/customerfind/${state.regnumber ? state.regnumber : 'reg'}/vin/${
          state.phone ? phoneToRest : 'phone'
        }`
      )
        .then((res) => res.json())
        .then((it) => {
          setCustomerOptions(it.data)
        })
    } else if (state.phone === '' && state.regnumber === '' && state.vinnumber === '') {
      setCustomerOptions([])
    }
  }, [state.phone, state.regnumber, state.vinnumber])

  const onChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const onSearchChange = (event) => {
    setSearch(event.target.value)
  }
  const applyCustomer = () => {
    const newCustomer = customerOptions.find((it) => it.id === search)
    if (newCustomer) {
      setCustomer((prevState) => ({
        ...prevState,
        regnumber: newCustomer.regnumber ? newCustomer.regnumber : '',
        mark: newCustomer.mark ? newCustomer.mark : '',
        model: newCustomer.model ? newCustomer.model : '',
        name: newCustomer.name ? newCustomer.name : '',
        phone: newCustomer.phone ? newCustomer.phone : '',
        idOfItem: newCustomer.id
      }))
      setState((prevState) => ({
        ...prevState,
        regnumber: newCustomer.regnumber ? newCustomer.regnumber : '',
        mark: newCustomer.mark ? newCustomer.mark : '',
        model: newCustomer.model ? newCustomer.model : '',
        name: newCustomer.name ? newCustomer.name : '',
        phone: newCustomer.phone ? newCustomer.phone : ''
      }))
      setActiveCustomer(newCustomer.id)
    }
    return null
  }
  const onChangeCustomer = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
    setCustomer((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const onChangeRegnumberUppercaseRussian = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
        .toUpperCase()
        .replace(/\s/g, '')
        .replace(/[^а-яё0-9]/i, '')
    }))
  }

  const switchKeyboard = () => {
    setKeyboard(true)
    setRegOpen(false)
  }

  const acceptRegnumber = () => {
    setRegOpen(false)
  }

  const openRegModal = () => {
    if (keyboard === false) {
      setRegOpen(true)
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
    setCustomer((prevState) => ({
      ...prevState,
      mark: value
    }))
  }

  const onChangeDateFinish = (e) => {
    const { id } = e.target
    const date = new Date(state.dateStart)
    const modifiedDate = date.setMonth(Number(date.getMonth()) + Number(id))
    const today = new Date(modifiedDate).toISOString().substr(0, 10)
    setState((prevState) => ({
      ...prevState,
      dateFinish: today
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
    setCustomer((prevState) => ({
      ...prevState,
      model: value
    }))
  }

  const sendData = () => {
    const checkCustomer =
      customerOptions !== []
        ? customerOptions.find((it) => it.id === search)
        : {
            regnumber: '',
            mark: '',
            model: '',
            name: '',
            phone: ''
          }
    if (!state.employee) notify('Заполните поле Принял заказ')
    if (!state.place) notify('Заполните поле Заказ принят на точке')
    if (!state.regnumber) notify('Заполните поле Гос. номер')
    if (!state.mark) notify('Укажите марку авто')
    if (!state.model) notify('Укажите модель авто')
    if (!state.name) notify('Заполните поле ФИО клиента')
    if (!state.phone) notify('Заполните поле Телефон')
    if (!state.dateStart) notify('Заполните обе даты')
    if (!state.dateFinish) notify('Заполните обе даты')
    if (state.preorder.length === 0) notify('Заполните хранение')
    if (state.preorder.length > 0 && !state.preorder[0]?.quantity) notify('Укажите количество')
    else if (
      state.employee &&
      state.place &&
      state.regnumber &&
      state.mark &&
      state.model &&
      state.name &&
      state.phone &&
      state.dateStart &&
      state.dateFinish &&
      state.preorder[0]?.quantity
    ) {
      if (
        checkCustomer !== undefined &&
        state.regnumber === checkCustomer.regnumber &&
        state.phone === checkCustomer.phone
      ) {
        if (state.payment === 'yes') {
          props.create({
            ...state,
            status: Statuses[0],
            currentplace: state.place
          })
          history.push('/storages/order/list')
          notify('Хранение добавлено')
        } else {
          props.create({
            ...state,
            status: Statuses[1],
            currentplace: state.place
          })
          history.push('/storages/order/list')
          notify('Хранение добавлено')
        }
      } else {
        if (state.payment === 'yes') {
          props.create({
            ...state,
            status: Statuses[0],
            currentplace: state.place
          })
          // props.createCust(customer)
          history.push('/storages/order/list')
          notify('Хранение добавлено')
          // notify('Создан новый клиент')
        }
        if (state.payment !== 'yes') {
          props.create({
            ...state,
            status: Statuses[1],
            currentplace: state.place
          })
          // props.createCust(customer)
          history.push('/storages/order/list')
          notify('Хранение добавлено')
          // notify('Создан новый клиент')
        }
      }
    }
  }

  const handleChangeInput = (index, event) => {
    const values = [...inputFields]
    values[index][event.target.name] = event.target.value
    setInputFields(values)
    setState((prevState) => ({
      ...prevState,
      preorder: inputFields
    }))
  }

  const handleAddFields = () => {
    setInputFields([
      ...inputFields,
      {
        tyreItem: '',
        type: '1',
        mode: 'full',
        brand: ''
      }
    ])
    setState((prevState) => ({
      ...prevState,
      preorder: inputFields
    }))
  }

  const handleRemoveFields = (index) => {
    if (index !== 0) {
      const values = [...inputFields]
      values.splice(index, 1)
      setInputFields(values)
      setState((prevState) => ({
        ...prevState,
        preorder: values
      }))
    }
  }

  const onChangeRegNumber = (e) => {
    const { value } = e.target
    setRegNumber((prevState) => [...prevState.concat(value)])
  }
  const onDeleteRegNumber = () => {
    const removeItem = regNumber.filter((element, index) => index < regNumber.length - 1)
    setRegNumber(removeItem)
  }
  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      regnumber: regNumber.join('').toString()
    }))
  }, [regNumber])

  return (
    <div>
      <div className="bg-white shadow rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
        <div className="md:flex md:flex-row -mx-3 mb-3">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <div className="flex flex-row">
              <div className="mb-5 w-1/2 pr-3">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Принял хранение
                </label>
                <div className="flex-shrink w-full inline-block relative mb-3">
                  <select
                    className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                    value={state.employee}
                    name="employee"
                    id="employee"
                    onChange={onChange}
                  >
                    <option value="" disabled hidden className="text-gray-800">
                      Выберите сотрудника
                    </option>
                    {employeeList
                      .filter((it) => it.role.includes('Хранение'))
                      .map((it, index) => {
                        return (
                          <option value={it.id} key={index}>
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
              <div className="mb-5 w-1/2 pl-3">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Хранение принято на точке
                </label>
                <div className="flex-shrink w-full inline-block relative mb-3">
                  <select
                    className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                    value={state.place}
                    name="place"
                    id="place"
                    onChange={onChange}
                  >
                    <option value="" disabled hidden className="text-gray-800">
                      Выберите место
                    </option>
                    {list.map((it, index) => {
                      return (
                        <option value={it.id} key={index}>
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
            <div className="inline-block text-left w-full">
              <div>
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="phone"
                >
                  Гос. номер
                </label>
                <div className="flex-shrink w-full inline-block relative">
                  {keyboard === true ? (
                    <input
                      className="block appearance-none w-full bg-grey-lighter border-2 border-black focus:border-gray-500 focus:outline-none py-2 px-4 pr-8 rounded-lg"
                      type="text"
                      placeholder="Русскими буквами"
                      value={state.regnumber}
                      name="regnumber"
                      id="regnumber"
                      autoComplete="off"
                      onClick={openRegModal}
                      // onChange={keyboard === true ? onChangeRegnumberUppercaseRussian : null}
                      onChange={onChangeRegnumberUppercaseRussian}
                    />
                  ) : (
                    <button
                      className="block appearance-none text-left w-full bg-grey-lighter border-2 border-black focus:border-gray-500 focus:outline-none py-2 px-4 pr-8 rounded-lg"
                      value={state.regnumber}
                      name="regnumber"
                      id="regnumber"
                      type="button"
                      onClick={openRegModal}
                    >
                      {state.regnumber ? state.regnumber : 'Нажмите для ввода'}
                    </button>
                  )}
                </div>
              </div>

              <div
                className={cx(
                  'absolute p-3 mr-4 max-w-2xl rounded-md shadow bg-gray-200 border-2 border-gray-600 z-50',
                  {
                    hidden: regOpen === false,
                    block: regOpen === true
                  }
                )}
              >
                <div className="flex flex-row">
                  <div className="w-full flex flex-row mb-2">
                    <div className="p-1 w-1/5">
                      <button
                        type="button"
                        className="p-1 m-1 text-xl rounded font-bold bg-blue-200 hover:bg-blue-300 border-main-600 border-2 text-gray-900 w-full h-full"
                        onClick={onDeleteRegNumber}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          version="1.1"
                          width="40"
                          height="40"
                          x="0"
                          y="0"
                          viewBox="0 0 512 512"
                          xmlSpace="preserve"
                          className="inline-block"
                        >
                          <g>
                            <g xmlns="http://www.w3.org/2000/svg">
                              <g>
                                <path
                                  d="M492,236H68.442l70.164-69.824c7.829-7.792,7.859-20.455,0.067-28.284c-7.792-7.83-20.456-7.859-28.285-0.068    l-104.504,104c-0.007,0.006-0.012,0.013-0.018,0.019c-7.809,7.792-7.834,20.496-0.002,28.314c0.007,0.006,0.012,0.013,0.018,0.019    l104.504,104c7.828,7.79,20.492,7.763,28.285-0.068c7.792-7.829,7.762-20.492-0.067-28.284L68.442,276H492    c11.046,0,20-8.954,20-20C512,244.954,503.046,236,492,236z"
                                  fill="#3182ce"
                                  data-original="#000000"
                                />
                              </g>
                            </g>
                          </g>
                        </svg>
                      </button>
                    </div>
                    <div className="p-1 w-3/5">
                      <button
                        type="button"
                        className="p-1 m-1 text-xl rounded font-bold  bg-green-200 hover:bg-green-300 border-green-600 border-2 text-gray-900 w-full h-full"
                        onClick={acceptRegnumber}
                      >
                        Ок
                      </button>
                    </div>
                    <div className="p-1 w-1/5">
                      <button
                        type="button"
                        className="p-1 m-1 text-xl rounded font-bold bg-red-200 hover:bg-red-300 border-red-600 border-2 text-gray-900 w-full h-full"
                        onClick={acceptRegnumber}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          version="1.1"
                          width="23"
                          height="23"
                          x="0"
                          y="0"
                          viewBox="0 0 365.696 365.696"
                          xmlSpace="preserve"
                          className="inline-block"
                        >
                          <g>
                            <path
                              xmlns="http://www.w3.org/2000/svg"
                              d="m243.1875 182.859375 113.132812-113.132813c12.5-12.5 12.5-32.765624 0-45.246093l-15.082031-15.082031c-12.503906-12.503907-32.769531-12.503907-45.25 0l-113.128906 113.128906-113.132813-113.152344c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503907-12.5 32.769531 0 45.25l113.152344 113.152344-113.128906 113.128906c-12.503907 12.503907-12.503907 32.769531 0 45.25l15.082031 15.082031c12.5 12.5 32.765625 12.5 45.246093 0l113.132813-113.132812 113.128906 113.132812c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082031c12.5-12.503906 12.5-32.769531 0-45.25zm0 0"
                              fill="#e53e3e"
                              data-original="#000000"
                            />
                          </g>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row">
                  <div className="w-1/2 flex flex-wrap mr-2">
                    <div className="w-1/3 p-1">
                      <button
                        type="button"
                        className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                        onClick={onChangeRegNumber}
                        value="А"
                      >
                        А
                      </button>
                    </div>
                    <div className="w-1/3 p-1">
                      <button
                        type="button"
                        className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                        onClick={onChangeRegNumber}
                        value="В"
                      >
                        В
                      </button>
                    </div>
                    <div className="w-1/3 p-1">
                      <button
                        type="button"
                        className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                        onClick={onChangeRegNumber}
                        value="Е"
                      >
                        Е
                      </button>
                    </div>
                    <div className="w-1/3 p-1">
                      <button
                        type="button"
                        className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                        onClick={onChangeRegNumber}
                        value="К"
                      >
                        К
                      </button>
                    </div>
                    <div className="w-1/3 p-1">
                      <button
                        type="button"
                        className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                        onClick={onChangeRegNumber}
                        value="М"
                      >
                        М
                      </button>
                    </div>
                    <div className="w-1/3 p-1">
                      <button
                        type="button"
                        className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                        onClick={onChangeRegNumber}
                        value="Н"
                      >
                        Н
                      </button>
                    </div>
                    <div className="w-1/3 p-1">
                      <button
                        type="button"
                        className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                        onClick={onChangeRegNumber}
                        value="О"
                      >
                        О
                      </button>
                    </div>
                    <div className="w-1/3 p-1">
                      <button
                        type="button"
                        className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                        onClick={onChangeRegNumber}
                        value="Р"
                      >
                        Р
                      </button>
                    </div>
                    <div className="w-1/3 p-1">
                      <button
                        type="button"
                        className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                        onClick={onChangeRegNumber}
                        value="С"
                      >
                        С
                      </button>
                    </div>
                    <div className="w-1/3 p-1">
                      <button
                        type="button"
                        className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                        onClick={onChangeRegNumber}
                        value="Т"
                      >
                        Т
                      </button>
                    </div>
                    <div className="w-1/3 p-1">
                      <button
                        type="button"
                        className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                        onClick={onChangeRegNumber}
                        value="У"
                      >
                        У
                      </button>
                    </div>
                    <div className="w-1/3 p-1">
                      <button
                        type="button"
                        className="p-3 m-1 text-lg rounded bg-yellow-200 border-main-400 border-2 text-gray-900 w-full"
                        onClick={onChangeRegNumber}
                        value="Х"
                      >
                        Х
                      </button>
                    </div>
                  </div>

                  <div className="w-1/2 flex flex-wrap ml-2">
                    <div className="w-1/3 p-1">
                      <button
                        type="button"
                        className="p-3 m-1 text-lg rounded bg-white hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                        onClick={onChangeRegNumber}
                        value="1"
                      >
                        1
                      </button>
                    </div>
                    <div className="w-1/3 p-1">
                      <button
                        type="button"
                        className="p-3 m-1 text-lg rounded bg-white hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                        onClick={onChangeRegNumber}
                        value="2"
                      >
                        2
                      </button>
                    </div>
                    <div className="w-1/3 p-1">
                      <button
                        type="button"
                        className="p-3 m-1 text-lg rounded bg-white hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                        onClick={onChangeRegNumber}
                        value="3"
                      >
                        3
                      </button>
                    </div>
                    <div className="w-1/3 p-1">
                      <button
                        type="button"
                        className="p-3 m-1 text-lg rounded bg-white hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                        onClick={onChangeRegNumber}
                        value="4"
                      >
                        4
                      </button>
                    </div>
                    <div className="w-1/3 p-1">
                      <button
                        type="button"
                        className="p-3 m-1 text-lg rounded bg-white hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                        onClick={onChangeRegNumber}
                        value="5"
                      >
                        5
                      </button>
                    </div>
                    <div className="w-1/3 p-1">
                      <button
                        type="button"
                        className="p-3 m-1 text-lg rounded bg-white hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                        onClick={onChangeRegNumber}
                        value="6"
                      >
                        6
                      </button>
                    </div>
                    <div className="w-1/3 p-1">
                      <button
                        type="button"
                        className="p-3 m-1 text-lg rounded bg-white hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                        onClick={onChangeRegNumber}
                        value="7"
                      >
                        7
                      </button>
                    </div>
                    <div className="w-1/3 p-1">
                      <button
                        type="button"
                        className="p-3 m-1 text-lg rounded bg-white hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                        onClick={onChangeRegNumber}
                        value="8"
                      >
                        8
                      </button>
                    </div>
                    <div className="w-1/3 p-1">
                      <button
                        type="button"
                        className="p-3 m-1 text-lg rounded bg-white hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                        onClick={onChangeRegNumber}
                        value="9"
                      >
                        9
                      </button>
                    </div>
                    <div className="w-1/3 p-1">
                      <button
                        type="button"
                        className="p-3 m-1 text-lg rounded bg-white hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                        onClick={onChangeRegNumber}
                        value="0"
                      >
                        0
                      </button>
                    </div>
                    <div className="w-2/3 p-1 pl-6">
                      <button
                        type="button"
                        className="flex flex-row p-3 m-1 text-base rounded bg-orange-200 hover:bg-yellow-300 border-orange-600 border-2 text-gray-900 w-full"
                        onClick={switchKeyboard}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          version="1.1"
                          width="30"
                          height="30"
                          x="0"
                          y="0"
                          viewBox="0 0 548.176 548.176"
                          xmlSpace="preserve"
                          className="mr-2"
                        >
                          <g>
                            <g xmlns="http://www.w3.org/2000/svg">
                              <g>
                                <path
                                  d="M537.468,120.342c-7.139-7.139-15.753-10.709-25.841-10.709H36.545c-10.088,0-18.699,3.571-25.837,10.709    C3.571,127.48,0,136.094,0,146.179v255.815c0,10.089,3.571,18.698,10.708,25.837c7.139,7.139,15.749,10.712,25.837,10.712h475.082    c10.088,0,18.702-3.573,25.841-10.712c7.135-7.139,10.708-15.748,10.708-25.837V146.179    C548.176,136.094,544.603,127.48,537.468,120.342z M511.627,401.994H36.545V146.179h475.082V401.994z"
                                  fill="#dd6b20"
                                  data-original="#000000"
                                />
                                <path
                                  d="M77.657,365.445h27.408c3.046,0,4.569-1.526,4.569-4.568v-27.408c0-3.039-1.52-4.568-4.569-4.568H77.657    c-3.044,0-4.568,1.529-4.568,4.568v27.408C73.089,363.919,74.613,365.445,77.657,365.445z"
                                  fill="#dd6b20"
                                  data-original="#000000"
                                />
                                <path
                                  d="M77.657,292.362h63.954c3.045,0,4.57-1.53,4.57-4.572v-27.41c0-3.045-1.525-4.565-4.57-4.568H77.657    c-3.044,0-4.568,1.523-4.568,4.568v27.41C73.089,290.832,74.613,292.362,77.657,292.362z"
                                  fill="#dd6b20"
                                  data-original="#000000"
                                />
                                <path
                                  d="M77.657,219.268h27.408c3.046,0,4.569-1.525,4.569-4.57v-27.406c0-3.046-1.52-4.565-4.569-4.57H77.657    c-3.044,0-4.568,1.524-4.568,4.57v27.406C73.089,217.743,74.613,219.268,77.657,219.268z"
                                  fill="#dd6b20"
                                  data-original="#000000"
                                />
                                <path
                                  d="M397.43,328.903H150.751c-3.046,0-4.57,1.526-4.57,4.572v27.404c0,3.039,1.524,4.572,4.57,4.572h246.67    c3.046,0,4.572-1.526,4.572-4.572v-27.404C401.994,330.43,400.468,328.903,397.43,328.903z"
                                  fill="#dd6b20"
                                  data-original="#000000"
                                />
                                <path
                                  d="M182.725,287.79c0,3.042,1.523,4.572,4.565,4.572h27.412c3.044,0,4.565-1.53,4.565-4.572v-27.41    c0-3.045-1.518-4.565-4.565-4.568H187.29c-3.042,0-4.565,1.523-4.565,4.568V287.79z"
                                  fill="#dd6b20"
                                  data-original="#000000"
                                />
                                <path
                                  d="M150.751,219.268h27.406c3.046,0,4.57-1.525,4.57-4.57v-27.406c0-3.046-1.524-4.565-4.57-4.57h-27.406    c-3.046,0-4.57,1.524-4.57,4.57v27.406C146.181,217.743,147.706,219.268,150.751,219.268z"
                                  fill="#dd6b20"
                                  data-original="#000000"
                                />
                                <path
                                  d="M255.813,287.79c0,3.042,1.524,4.572,4.568,4.572h27.408c3.046,0,4.572-1.53,4.572-4.572v-27.41    c0-3.045-1.526-4.565-4.572-4.568h-27.408c-3.044,0-4.568,1.523-4.568,4.568V287.79z"
                                  fill="#dd6b20"
                                  data-original="#000000"
                                />
                                <path
                                  d="M223.837,219.268h27.406c3.046,0,4.57-1.525,4.57-4.57v-27.406c0-3.046-1.521-4.565-4.57-4.57h-27.406    c-3.046,0-4.57,1.524-4.57,4.57v27.406C219.267,217.743,220.791,219.268,223.837,219.268z"
                                  fill="#dd6b20"
                                  data-original="#000000"
                                />
                                <path
                                  d="M328.904,287.79c0,3.042,1.525,4.572,4.564,4.572h27.412c3.045,0,4.564-1.53,4.564-4.572v-27.41    c0-3.045-1.52-4.565-4.564-4.568h-27.412c-3.039,0-4.564,1.523-4.564,4.568V287.79z"
                                  fill="#dd6b20"
                                  data-original="#000000"
                                />
                                <path
                                  d="M470.513,328.903h-27.404c-3.046,0-4.572,1.526-4.572,4.572v27.404c0,3.039,1.526,4.572,4.572,4.572h27.404    c3.046,0,4.572-1.526,4.572-4.572v-27.404C475.085,330.43,473.562,328.903,470.513,328.903z"
                                  fill="#dd6b20"
                                  data-original="#000000"
                                />
                                <path
                                  d="M296.928,219.268h27.411c3.046,0,4.565-1.525,4.565-4.57v-27.406c0-3.046-1.52-4.565-4.565-4.57h-27.411    c-3.046,0-4.565,1.524-4.565,4.57v27.406C292.362,217.743,293.882,219.268,296.928,219.268z"
                                  fill="#dd6b20"
                                  data-original="#000000"
                                />
                                <path
                                  d="M370.018,219.268h27.404c3.046,0,4.572-1.525,4.572-4.57v-27.406c0-3.046-1.526-4.565-4.572-4.57h-27.404    c-3.046,0-4.572,1.524-4.572,4.57v27.406C365.445,217.743,366.972,219.268,370.018,219.268z"
                                  fill="#dd6b20"
                                  data-original="#000000"
                                />
                                <path
                                  d="M401.991,287.79c0,3.042,1.522,4.572,4.568,4.572h63.953c3.046,0,4.572-1.53,4.572-4.572V187.292    c0-3.046-1.522-4.565-4.572-4.57h-27.404c-3.046,0-4.572,1.524-4.572,4.57v68.52H406.56c-3.046,0-4.568,1.523-4.568,4.568V287.79z    "
                                  fill="#dd6b20"
                                  data-original="#000000"
                                />
                              </g>
                            </g>
                          </g>
                        </svg>
                        Клавиатура
                      </button>
                    </div>
                  </div>

                  {/* <button
                  type="button"
                  className="p-2 bg-red-600 text-white"
                  onClick={() => setRegOpen(false)}
                >
                  X
                </button> */}
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 px-3">
            <div>
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-city"
              >
                Авто в базе данных
              </label>
            </div>
            <table className="border-collapse w-full auto-search">
              <thead>
                <tr>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell w-full">
                    Клиент
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white lg:hover:bg-gray-100 flex table-row flex-row lg:flex-row flex-wrap flex-no-wrap mb-10 lg:mb-0">
                  <td className="w-full lg:w-auto p-2 text-xs text-gray-800 text-center border border-b block table-cell relative static">
                    Для поиска начните вводить гос. номер либо телефон
                  </td>
                  <td className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b block table-cell relative static" />
                </tr>
                <tr className="bg-white lg:hover:bg-gray-100 flex table-row flex-row lg:flex-row flex-wrap flex-no-wrap mb-10 lg:mb-0">
                  <td className="w-full lg:w-auto p-2 text-xs text-gray-800 text-center border border-b block table-cell relative static">
                    <div className="flex-shrink w-full inline-block relative">
                      <select
                        className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                        value={search}
                        name="search"
                        id="searchBlock"
                        onChange={onSearchChange}
                      >
                        <option value="" className="text-gray-800">
                          {customerOptions.length < 1 ? 'Клиентов не найдено' : 'Выберите клиента'}
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
                  </td>
                  <td className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b block table-cell relative static">
                    {customerOptions.length < 1 && !customer.idOfItem && !search ? (
                      <button
                        type="button"
                        className="py-1 px-3 text-white text-xs bg-gray-500 hover:text-white rounded-lg"
                      >
                        Не найден
                      </button>
                    ) : null}
                    {customerOptions.length >= 1 && activeCustomer === '' && !search ? (
                      <button
                        onClick={applyCustomer}
                        type="button"
                        className="py-1 px-3 text-white text-xs bg-main-500 hover:text-white rounded-lg"
                      >
                        Выберите клиента
                      </button>
                    ) : null}
                    {customerOptions.length >= 1 && activeCustomer === '' && search ? (
                      <button
                        onClick={applyCustomer}
                        type="button"
                        className="py-1 px-3 text-white text-xs hover:text-white rounded-lg bg-green-600 hover:bg-green-700"
                      >
                        Использовать
                      </button>
                    ) : null}
                    {activeCustomer !== '' && customer.idOfItem && search ? (
                      <button
                        onClick={() => setActiveCustomer('')}
                        type="button"
                        className="py-1 px-3 text-white text-xs hover:text-white rounded-lg bg-red-600 hover:bg-red-700"
                      >
                        Сбросить
                      </button>
                    ) : null}
                  </td>
                </tr>
              </tbody>
              {customerOptions.length >= 1 && customer.idOfItem && activeCustomer ? (
                <p className="text-left p-1">✔ Вы выбрали клиента</p>
              ) : null}
            </table>
          </div>
        </div>
        <div className="-mx-3 md:flex flex-wrap mb-3">
          <div className="md:w-1/4 px-3 mb-6 md:mb-0 flex flex-col">
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

          <div className="md:w-1/4 px-3 mb-6 md:mb-0 flex flex-col">
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
              placeholder={state.mark.length < 2 ? 'Сначала выберите марку' : 'Выберите модель'}
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

          <div className="md:w-1/4 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-gray-800 px-3 bg-green-300 rounded text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Дата начала
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
              value={state.dateStart}
              name="dateStart"
              id="dateStart"
              type="date"
              autoComplete="off"
              required
              onChange={onChange}
            />
          </div>
          <div className="md:w-1/4 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-gray-800 px-3 bg-green-300 rounded text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Дата завершения
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
              value={state.dateFinish}
              name="dateFinish"
              id="dateFinish"
              type="date"
              autoComplete="off"
              required
              onChange={onChange}
            />
            <div className="flex flex-row">
              <button
                type="button"
                className=" px-2 mx-2  w-1/5  rounded-lg bg-main-600 hover:bg-blue-400 text-white text-sm"
                id="1"
                onClick={onChangeDateFinish}
              >
                +1
              </button>
              <button
                type="button"
                className=" px-2 mx-2 w-1/5 rounded-lg bg-main-600 hover:bg-blue-400 text-white text-sm"
                id="2"
                onClick={onChangeDateFinish}
              >
                +2
              </button>
              <button
                type="button"
                className=" px-2 mx-2 w-1/5 rounded-lg bg-main-600 hover:bg-blue-400 text-white text-sm"
                id="3"
                onClick={onChangeDateFinish}
              >
                +3
              </button>
              <button
                type="button"
                className=" px-2 mx-2 w-1/5 rounded-lg bg-main-600 hover:bg-blue-400 text-white text-sm"
                id="7"
                onClick={onChangeDateFinish}
              >
                +7
              </button>
              <button
                type="button"
                className=" px-2 mx-2 w-1/5 rounded-lg bg-main-600 hover:bg-blue-400 text-white text-sm"
                id="12"
                onClick={onChangeDateFinish}
              >
                +12
              </button>
            </div>
          </div>
        </div>
        <div className="-mx-3 md:flex mb-2">
          <div className="md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              Номер телефона
            </label>
            <NumberFormat
              format="+7 (###) ###-##-##"
              mask="_"
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
              type="text"
              placeholder="Начинайте ввод с 978"
              value={state.phone}
              name="phone"
              id="phone"
              onChange={onChangeCustomer}
            />
          </div>
          <div className="md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              ФИО клиента
            </label>
            <input
              className="capitalize appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
              type="text"
              placeholder="Введите имя"
              value={state.name}
              name="name"
              id="name"
              onChange={onChangeCustomer}
            />
          </div>
          <div className="md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              Оплата
            </label>
            <div className="flex-shrink w-full inline-block relative">
              <select
                className={cx(
                  'block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 mb-3 rounded',
                  {
                    'bg-green-200': state.payment === 'yes',
                    'bg-red-200': state.payment === 'no',
                    'bg-yellow-200': state.payment === 'free'
                  }
                )}
                name="payment"
                id="payment"
                value={state.payment}
                autoComplete="off"
                required
                onChange={onChange}
              >
                <option value="yes">Оплачено</option>
                <option value="no">Не оплачено</option>
                <option value="free">Акция (бесплатно)</option>
              </select>
              <div className="pointer-events-none hidden absolute top-0 mt-2 right-0 lg:flex items-center px-2 text-gray-600">
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

        <div className="-mx-3 md:flex mb-2">
          <div className="md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              Дополнительный номер телефона
            </label>
            <NumberFormat
              format="+7 (###) ###-##-##"
              mask="_"
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
              type="text"
              placeholder="Начинайте ввод с 978"
              value={state.phoneSecond}
              name="phoneSecond"
              id="phoneSecond"
              onChange={onChangeCustomer}
            />
          </div>
        </div>

        <div className="-mx-3 md:flex mb-2">
          <div className="md:w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              Хранение
            </label>
            <table className="border-collapse w-full">
              <thead>
                <tr>
                  <th className="p-3 font-bold uppercase bg-green-300 text-gray-800 border border-gray-300 table-cell">
                    Тип
                  </th>
                  <th className="p-3 font-bold uppercase bg-green-300 text-gray-800 border border-gray-300 table-cell w-full">
                    Наименование
                  </th>
                  <th className="p-3 font-bold uppercase bg-green-300 text-sm text-gray-800 border border-gray-300 table-cell whitespace-no-wrap">
                    Кол-во
                  </th>

                  <th className="p-3 font-bold uppercase bg-green-300 text-gray-800 border border-gray-300 table-cell">
                    Строки
                  </th>
                </tr>
              </thead>
              <tbody>
                {inputFields.map((inputField, index) => (
                  <tr
                    key={index}
                    className="bg-white lg:hover:bg-gray-100 flex table-row flex-row lg:flex-row flex-wrap flex-no-wrap mb-10 lg:mb-0"
                  >
                    <FirstColumn
                      inputField={inputField}
                      handleChangeInput={handleChangeInput}
                      index={index}
                    />
                    <TyreColumn
                      inputField={inputField}
                      handleChangeInput={handleChangeInput}
                      index={index}
                    />

                    <td className="p-2 text-gray-800 text-center border border-b table-cell relative">
                      <input
                        className="w-32 appearance-none block bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                        name="quantity"
                        type="number"
                        value={inputField.quantity}
                        autoComplete="off"
                        onChange={(event) => handleChangeInput(index, event)}
                      />
                    </td>
                    <td className="w-full lg:w-auto p-2 text-gray-800 border border-b text-center flex flex-row table-cell relative static">
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
                        className="py-1 px-3 bg-main-500 text-white font-bold hover:bg-main-700 hover:text-white rounded-lg"
                      >
                        +
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="-mx-3 md:flex my-2">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              {state.payment === 'free'
                ? 'Цена (по умолчанию равна 0 при покупке новых шин)'
                : 'Цена'}
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
              type="number"
              placeholder="Сумма хранения"
              value={state.comment}
              disabled={state.payment === 'free'}
              name="comment"
              id="comment"
              onChange={onChange}
            />
          </div>
          <div className="w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              Комментарий
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
              placeholder="Комментарий"
              value={state.comment2}
              name="comment2"
              id="comment2"
              onChange={onChange}
            />
          </div>
        </div>
      </div>
      <SubmitButtons sendData={sendData} />
    </div>
  )
}

export default StoragesCreate
