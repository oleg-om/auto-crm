import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import cx from 'classnames'
import 'react-toastify/dist/ReactToastify.css'
import Employee from './employees'
import Car from './car'

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
    preorder: [],
    name: '',
    phone: '',
    prepay: '',
    comment: '',
    role: []
  })

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
  console.log(state.role)

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
          />
        </div>
        <div
          className={cx('', {
            block: active === 'service',
            hidden: active !== 'service'
          })}
        >
          <div className="md:flex md:flex-row -mx-3">
            <div className="px-3 mb-6 md:mb-0 w-full">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Услуги
              </label>
              <div className="flex flex-col w-full relative">
                {shinomontazhprices ? (
                  shinomontazhprices.map((item) => (
                    <button
                      className={cx('mb-3 flex flex-row rounded bg-gray-200 w-full text-xl', {
                        'bg-green-400 hover:bg-green-500 text-white': state.role.includes(
                          item.name
                        ),
                        'bg-gray-100 hover:bg-gray-300': !state.role.includes(item.name)
                      })}
                      key={item.id}
                      type="button"
                      name={item.id}
                      onClick={checkboxRoleChange}
                    >
                      <label htmlFor={item.id} className="w-2/3 h-full p-2 text-left inline-block">
                        <input
                          className="mr-4"
                          checked={state.role.index}
                          key={item.id}
                          name={item.name}
                          id={item.id}
                          defaultChecked={state.role.find((it) => it === item)}
                          type="checkbox"
                        />
                        {item.name}
                      </label>
                      <div className="w-1/3 h-full p-2 inline-block bg-gray-200">
                        <button type="button" className="px-3 bg-red-600">
                          -
                        </button>
                        <input type="number" className="px-3 bg-white" />
                        <button type="button" className="px-3 bg-blue-600">
                          +
                        </button>
                      </div>
                    </button>
                  ))
                ) : (
                  <p>Сотрудники не найдены</p>
                )}
              </div>
            </div>
          </div>
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
          onClick={sendData}
          type="submit"
        >
          Далее
        </button>
      </div>
    </div>
  )
}

export default ShinomontazhsCreate
