import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import cx from 'classnames'
import 'react-toastify/dist/ReactToastify.css'
import Employee from './employees'

const ShinomontazhsCreate = (props) => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const history = useHistory()
  const employeeList = useSelector((s) => s.employees.list)
  const customerList = useSelector((s) => s.customers.list)
  const auth = useSelector((s) => s.auth)

  const [state, setState] = useState({
    employee: auth.name,
    place: auth.place,
    regnumber: '',
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

  return (
    <div>
      <div className="bg-white shadow rounded-lg px-8 py-6 mb-4 flex flex-col my-2">
        <div className="flex flex-row">
          <button
            type="button"
            className={cx('p-4 bg-gray-200 rounded mr-2', {
              block: active !== 'employee',
              'border-b-8 border-blue-400': active === 'employee'
            })}
            onClick={() => setActive('employee')}
          >
            Исполнители
          </button>
          <button
            type="button"
            className={cx('p-4 bg-gray-200 rounded', {
              block: active !== 'car',
              'border-b-8 border-blue-400': active === 'car'
            })}
            onClick={() => setActive('car')}
          >
            Авто
          </button>
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
      </div>
      <div className=" flex my-2">
        <Link
          to="/shinomontazh/list"
          className="my-3 mr-2 py-2 md:w-1/3 px-3 bg-red-600 text-white text-center hover:bg-red-700 hover:text-white rounded-lg"
        >
          Отмена
        </Link>

        <button
          className="my-3 ml-2 py-2 md:w-2/3 px-3 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg"
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
