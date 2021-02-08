import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import cx from 'classnames'
import 'react-toastify/dist/ReactToastify.css'
import Employee from './employees'
import Car from './car'
import Service from './service'

const ShinomontazhsCreate = (props) => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const history = useHistory()
  const employeeList = useSelector((s) => s.employees.list)
  const customerList = useSelector((s) => s.customers.list)
  const auth = useSelector((s) => s.auth)
  const shinomontazhprices = useSelector((s) => s.shinomontazhprices.list)

  const [regNumber, setRegNumber] = useState([])
  const [keyboard, setKeyboard] = useState(false)
  const [regOpen, setRegOpen] = useState(false)

  const [state, setState] = useState({
    employee: auth.name,
    place: auth.place,
    regnumber: regNumber.toString(),
    vinnumber: '',
    mark: '',
    model: '',
    gen: '',
    mod: '',
    service: [],
    order: [{ name: '0ea8f233-a2e2-408e-a40b-30ce6536b6b2', quantity: 1 }],
    name: '',
    phone: '',
    prepay: '',
    comment: '',
    role: []
  })

  const [service, setService] = useState([])

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

  const checkboxRoleChange = (e) => {
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

  const [options, setOptions] = useState({
    mark: [],
    model: []
  })

  const [stateId, setStateId] = useState({
    mark: '',
    model: '',
    gen: '',
    mod: ''
  })

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

  const onChangeMark = (e) => {
    const { value } = e.target
    const findCar = options.mark ? options.mark.find((it) => value === it.name) : null
    setState((prevState) => ({
      ...prevState,
      mark: value,
      model: '',
      gen: '',
      mod: ''
    }))
    setStateId((prevState) => ({
      ...prevState,
      mark: findCar ? findCar.id_car_mark : '',
      model: '',
      gen: '',
      mod: ''
    }))
  }

  const onChangeModel = (e) => {
    const { value } = e.target
    const finModel = options.model.find((it) => value === it.name)
    setState((prevState) => ({
      ...prevState,
      model: value,
      gen: '',
      mod: ''
    }))
    setStateId((prevState) => ({
      ...prevState,
      model: finModel ? finModel.id_car_model : '',
      gen: '',
      mod: ''
    }))
  }

  const sendData = () => {
    const checkCustomer =
      customerList !== []
        ? customerList.find((it) => it.id)
        : {
            regnumber: '',
            vinnumber: '',
            mark: '',
            model: '',
            gen: '',
            name: '',
            phone: ''
          }
    if (!state.employee) notify('Заполните поле Принял заказ')
    if (!state.place) notify('Заполните поле Заказ принят на точке')
    if (!state.regnumber) notify('Заполните поле гос.номер')
    if (!state.vinnumber) notify('Заполните поле VIN номер')
    if (!state.mark) notify('Укажите марку авто')
    if (!state.model) notify('Укажите модель авто')
    if (!state.gen) notify('Укажите год авто')
    if (!state.name) notify('Заполните поле Имя клиента')
    if (!state.phone) notify('Заполните поле Телефон')
    else if (
      state.employee &&
      state.place &&
      state.regnumber &&
      state.vinnumber &&
      state.mark &&
      state.model &&
      state.gen &&
      state.name &&
      state.phone
    ) {
      if (
        checkCustomer !== undefined &&
        state.regnumber === checkCustomer.regnumber &&
        state.vinnumber === checkCustomer.vinnumber &&
        state.mark === checkCustomer.mark &&
        state.model === checkCustomer.model &&
        state.gen === checkCustomer.gen &&
        state.mod === checkCustomer.mod &&
        state.name === checkCustomer.name &&
        state.phone === checkCustomer.phone
      ) {
        props.create(state)
        history.push('/shinomontazh/list')
        notify('Запись добавлена')
      } else {
        props.create(state)
        history.push('/shinomontazh/list')
        notify('Запись добавлена, создан новый клиент')
      }
    }
  }

  const [active, setActive] = useState('employee')
  const checkboxServiceChange = (e) => {
    const { name, placeholder, checked } = e.target
    if (checked) {
      setService((prevState) => [
        ...prevState,
        { serviceName: name, quantity: 1, price: placeholder }
      ])
    } else {
      setService((prevState) => prevState.filter((it) => it.serviceName !== name))
    }
  }
  const servicePlusChange = (e) => {
    const { name } = e.target
    setService(
      service.map((object) => {
        if (object.serviceName === name) {
          return {
            ...object,
            quantity: object.quantity + 1
          }
        }
        return object
      })
    )
    console.log('lol')
  }

  const serviceMinusChange = (e) => {
    const { name } = e.target
    setService(
      service.map((object) => {
        if (object.serviceName === name && object.quantity >= 2) {
          return {
            ...object,
            quantity: object.quantity - 1
          }
        }
        return object
      })
    )
  }

  const nextStep = () => {
    if (active === 'employee') {
      setActive('car')
    } else if (active === 'car') {
      setActive('service')
    } else if (active === 'service') {
      setActive('material')
    } else if (active === 'material') {
      setActive('finish')
    } else if (active === 'finish') {
      sendData()
    }
  }

  console.log(service)

  return (
    <div>
      <div className="bg-white shadow rounded-lg px-8 py-6 mb-4 flex flex-col my-2">
        <div className="flex flex-row">
          <div className="w-1/5 p-2">
            <button
              type="button"
              className={cx('p-4 bg-gray-200 rounded w-full h-full', {
                block: active !== 'employee',
                'border-b-8 border-blue-400': active === 'employee'
              })}
              onClick={() => setActive('employee')}
            >
              Исполнители
            </button>
          </div>
          <div className="w-1/5 p-2">
            <button
              type="button"
              className={cx('p-4 bg-gray-200 rounded w-full h-full', {
                block: active !== 'car',
                'border-b-8 border-blue-400': active === 'car'
              })}
              onClick={() => setActive('car')}
            >
              Авто
            </button>
          </div>
          <div className="w-1/5 p-2">
            <button
              type="button"
              className={cx('p-4 bg-gray-200 rounded w-full h-full', {
                block: active !== 'service',
                'border-b-8 border-blue-400': active === 'service'
              })}
              onClick={() => setActive('service')}
            >
              Услуги
            </button>
          </div>
          <div className="w-1/5 p-2">
            <button
              type="button"
              className={cx('p-4 bg-gray-200 rounded w-full h-full', {
                block: active !== 'material',
                'border-b-8 border-blue-400': active === 'material'
              })}
              onClick={() => setActive('material')}
            >
              Материалы
            </button>
          </div>
          <div className="w-1/5 p-2">
            <button
              type="button"
              className={cx('p-4 bg-gray-200 rounded w-full h-full', {
                block: active !== 'finish',
                'border-b-8 border-blue-400': active === 'finish'
              })}
              onClick={() => setActive('finish')}
            >
              Итог
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
        <div
          className={cx('', {
            block: active === 'employee',
            hidden: active !== 'employee'
          })}
        >
          <Employee
            employeeList={employeeList}
            auth={auth}
            state={state}
            checkboxRoleChange={checkboxRoleChange}
          />
        </div>
        <div
          className={cx('', {
            block: active === 'car',
            hidden: active !== 'car'
          })}
        >
          <Car
            regOpen={regOpen}
            onChangeRegNumber={onChangeRegNumber}
            onDeleteRegNumber={onDeleteRegNumber}
            onChangeRegnumberUppercaseRussian={onChangeRegnumberUppercaseRussian}
            switchKeyboard={switchKeyboard}
            acceptRegnumber={acceptRegnumber}
            openRegModal={openRegModal}
            state={state}
            keyboard={keyboard}
            onChangeMark={onChangeMark}
            onChangeModel={onChangeModel}
            options={options}
          />
        </div>
        <div
          className={cx('', {
            block: active === 'service',
            hidden: active !== 'service'
          })}
        >
          <Service
            shinomontazhprices={shinomontazhprices}
            auth={auth}
            service={service}
            checkboxServiceChange={checkboxServiceChange}
            servicePlusChange={servicePlusChange}
            serviceMinusChange={serviceMinusChange}
          />
        </div>
      </div>
      <div className=" flex my-2">
        <Link
          to="/shinomontazh/list"
          className="my-3 mr-2 py-3 md:w-1/3 px-3 bg-red-600 text-white text-center hover:bg-red-700 hover:text-white rounded-lg"
        >
          Отмена
        </Link>

        <button
          className="my-3 ml-2 py-3 md:w-2/3 px-3 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg"
          onClick={nextStep}
          type="submit"
        >
          Далее
        </button>
      </div>
    </div>
  )
}

export default ShinomontazhsCreate
