import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import NumberFormat from 'react-number-format'
import employeeList from '../../lists/empoyees-list'
// import placeList from "../../lists/test-list"

const AutopartsMainCreate = (props) => {
  const [state, setState] = useState({
    employee: '',
    place: '',
    process: '',
    regnumber: '',
    vinnumber: '',
    brand: '',
    model: '',
    year: '',
    engine: '',
    name: '',
    phone: '',
    preorder: '',
    prepay: '',
    comment: ''
  })

  const [error, setError] = useState('')

  const onChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const history = useHistory()

  const sendData = () => {
    if (!state.employee) setError('Заполните поле Принял заказ')
    // else if (!state.place) setError("Заполните поле Заказ принят на точке")
    // else if (!state.process) setError("Заполните поле Обработал заказ")
    // else if (!state.regnumber) setError("Заполните поле Гос.номер")
    // else if (!state.vinnumber) setError("Заполните поле VIN номер")
    else if (!state.brand) setError('Заполните поле Марка авто')
    else if (!state.model) setError('Заполните поле Модель')
    else if (!state.year) setError('Заполните поле Год')
    else if (!state.engine) setError('Заполните поле Объем двигателя')
    else if (!state.name) setError('Заполните поле Имя клиента')
    else if (!state.phone) setError('Заполните поле Номер телефона')
    else if (!state.preorder) setError('Внесите предварительный заказ')
    else {
      props.create(state)
      setState({
        employee: '',
        place: '',
        process: '',
        regnumber: '',
        vinnumber: '',
        brand: '',
        model: '',
        year: '',
        engine: '',
        name: '',
        phone: '',
        preorder: '',
        prepay: '',
        comment: ''
      })
      setError('')
      history.push('/autoparts/order/list')
    }
  }

  return (
    <form className="container flex flex-wrap">
      <div className="flex flex-row w-full">
        <div className="flex flex-col mx-2">
          <label htmlFor="employee">Принял заказ</label>
          <select
            className="border-2 p-2 border-gray-400 border-solid"
            value={state.employee}
            name="employee"
            id="employee"
            placeholder="sdsd"
            onChange={onChange}
          >
            {employeeList.map((it) => {
              return (
                <option key={it} value={it}>
                  {it}
                </option>
              )
            })}
          </select>
        </div>
        <div className="flex flex-col mx-2">
          <label htmlFor="place">Заказ принят на точке</label>
          <select
            className="border-2 p-2 border-gray-400 border-solid"
            value={state.place}
            name="place"
            id="place"
            onChange={onChange}
          >
            {/* {placeList.map((it) => {
              return <option value={it}>{it}</option>
            })} */}
          </select>
        </div>
        <div className="flex flex-col mx-2">
          <label htmlFor="process">Обработал заказ</label>
          <input
            className="border-2 p-2 border-gray-400 border-solid"
            value={state.process}
            name="process"
            id="process"
            onChange={onChange}
          />
        </div>
      </div>
      <div className="flex flex-row w-full">
        <div className="flex flex-col mx-2">
          <label htmlFor="regnumber">Гос. номер</label>
          <input
            className="border-2 p-2 border-gray-400 border-solid"
            value={state.regnumber}
            name="regnumber"
            id="regnumber"
            onChange={onChange}
          />
        </div>
        <div className="flex flex-col mx-2">
          <label htmlFor="vinnumber">VIN номер</label>
          <input
            className="border-2 p-2 border-gray-400 border-solid"
            value={state.vinnumber}
            name="vinnumber"
            id="vinnumber"
            onChange={onChange}
            required
          />
        </div>
      </div>
      <div className="flex flex-row w-full">
        <div className="flex flex-col mx-2">
          <label htmlFor="brand">Марка авто</label>
          <input
            className="border-2 p-2 border-gray-400 border-solid"
            value={state.brand}
            name="brand"
            id="brand"
            onChange={onChange}
            required
          />
        </div>
        <div className="flex flex-col mx-2">
          <label htmlFor="model">Модель</label>
          <input
            className="border-2 p-2 border-gray-400 border-solid"
            value={state.model}
            name="model"
            id="model"
            onChange={onChange}
            required
          />
        </div>
        <div className="flex flex-col mx-2">
          <label htmlFor="year">Год</label>
          <input
            className="border-2 p-2 border-gray-400 border-solid"
            value={state.year}
            name="year"
            id="year"
            onChange={onChange}
            required
          />
        </div>
        <div className="flex flex-col mx-2">
          <label htmlFor="engine">Объем двигателя</label>
          <input
            className="border-2 p-2 border-gray-400 border-solid"
            value={state.engine}
            name="engine"
            id="engine"
            onChange={onChange}
            required
          />
        </div>
      </div>
      <div className="flex flex-row w-full">
        <div className="flex flex-col mx-2">
          <label htmlFor="name">Имя клиента</label>
          <input
            className="border-2 p-2 border-gray-400 border-solid"
            value={state.name}
            name="name"
            id="name"
            onChange={onChange}
            required
          />
        </div>
        <div className="flex flex-col mx-2">
          <label htmlFor="phone">Номер телефона</label>
          <NumberFormat
            format="+7 (###) ###-##-##"
            mask="_"
            className="border-2 p-2 border-gray-400 border-solid"
            value={state.phone}
            name="phone"
            placeholder="Начинайте ввод с 978"
            id="phone"
            onChange={onChange}
            required
          />
        </div>
        <div className="flex flex-col mx-2">
          <label htmlFor="preorder">Предварительный заказ</label>
          <input
            className="border-2 p-2 border-gray-400 border-solid"
            value={state.preorder}
            name="preorder"
            id="preorder"
            onChange={onChange}
            required
          />
        </div>
        <div className="flex flex-col mx-2">
          <label htmlFor="prepay">Предоплата</label>
          <input
            className="border-2 p-2 border-gray-400 border-solid"
            value={state.prepay}
            name="prepay"
            id="prepay"
            onChange={onChange}
          />
        </div>
        <div className="flex flex-col mx-2">
          <label htmlFor="comment">Комментарий</label>
          <input
            className="border-2 p-2 border-gray-400 border-solid"
            value={state.comment}
            name="comment"
            id="comment"
            onChange={onChange}
            required
          />
        </div>
      </div>
      <Link to="/autoparts/order/list">
        <button
          type="button"
          className="py-3 bg-red-200 justify-center items-center rounded-sm flex md:flex-row flex-col px-5 shadow-xl my-2"
        >
          Отмена
        </button>
      </Link>
      <button
        className="py-3 bg-green-200 justify-center items-center rounded-sm flex md:flex-row flex-col px-5 shadow-xl my-2"
        onClick={sendData}
        // disabled={state.name.length === 0}
        type="submit"
      >
        Создать
      </button>
      <p>{error}</p>
    </form>
  )
}

export default AutopartsMainCreate
