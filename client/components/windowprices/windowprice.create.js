import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// import categoryList from '../../lists/wash-categories'
import { getPriceLocation } from '../../scenes/Window.prices/Window.prices.list'
import SubmitButtons from '../shared/buttons/OrderSubmitButtons'

export const categoryList = [{ name: 'Цена', id: 'price', class: 'price' }]

// const WindowCategoryList = [
//   { name: 'Рулевое управление' },
//   { name: 'Тормозная система' },
//   { name: 'Передняя подвеска' },
//   { name: 'Задняя подвеска' },

//   { name: 'Двигатель' },
//   { name: 'Трансмиссия, КПП, мосты' },
//   { name: 'Выхлопная система' },
//   { name: 'Другое' },

//   { name: 'Охлаждающая система' },
//   { name: 'Передняя подвеска, рулевой механизм' },
//   { name: 'Топливная система' },
//   { name: 'Электрика' },
//   { name: 'Система охлаждения' },
//   { name: 'Развал-схождение' }
// ]

const WindowpriceCreate = (props) => {
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const location = useLocation()
  const currentLocation = `${getPriceLocation(location)}price`
  const history = useHistory()
  const [state, setState] = useState({
    name: '',
    category: '',
    type: '',
    price: '',

    number: '',
    free: ''
  })

  const onChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const sendData = () => {
    if (!state.name) notify('Поле Название пустое')
    else if (!state.category) notify('Поле Категория пустое')
    else if (!state.type) notify('Поле Тип пустое')
    else {
      props.create(state)
      history.push(`/${currentLocation}/list/legk`)
      notify('Услуга добавлена')
    }
  }

  return (
    <div>
      <div className="bg-white shadow rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
        <div className="-mx-3 md:flex flex-wrap">
          <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Название услуги
            </label>
            <input
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              value={state.name}
              name="name"
              id="name"
              placeholder="Отображаемое название услуги"
              required
              onChange={onChange}
            />
          </div>
          <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Направление
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <select
                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.type}
                name="type"
                id="type"
                required
                onChange={onChange}
              >
                <option value="" disabled hidden className="text-gray-800">
                  Выберите направление
                </option>
                {props.WindowTypeList.map((it) => (
                  <option key={it.value} value={it.value}>
                    {it.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute top-0 mt-4  right-0 flex items-center px-2 text-gray-600">
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
          <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Категория
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              {state.type !== 'gruz' && state.type !== 'selhoz' ? (
                <select
                  className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                  value={state.category}
                  name="category"
                  id="category"
                  required
                  onChange={onChange}
                >
                  <option value="" disabled hidden className="text-gray-800">
                    Выберите категорию
                  </option>
                  {props.WindowCategoryList.map((it) => (
                    <option key={it.name} value={it.name}>
                      {it.name}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                  value={state.category}
                  name="category"
                  id="category"
                  required
                  onChange={onChange}
                >
                  <option value="" className="text-gray-800">
                    Выберите категорию
                  </option>

                  <option value="common">Основное</option>
                  <option value="other">Другое</option>
                </select>
              )}
              <div className="pointer-events-none absolute top-0 mt-4  right-0 flex items-center px-2 text-gray-600">
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
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="grid-first-name"
        >
          Цены:
        </label>

        {!state.type ? <p>Сначала выбрите направление и категорию</p> : null}
        {state.type && !state.category ? <p>Выберите категорию</p> : null}

        {state.type && state.category ? (
          <div className="-mx-3 md:flex flex-wrap mt-3">
            {categoryList.map((it) => {
              return (
                <div className="md:w-1/5 px-3 mb-6 md:mb-0 flex flex-col" key={it.name}>
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor={it.id}
                  >
                    {it.name}
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                    value={state[it.id]}
                    name={it.id}
                    id={it.id}
                    type="number"
                    placeholder="Введите цену"
                    onChange={onChange}
                  />
                </div>
              )
            })}
          </div>
        ) : null}
        <div className="-mx-3 md:flex flex-wrap mt-3">
          <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Порядковый номер
            </label>
            <input
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              value={state.number}
              name="number"
              id="number"
              type="number"
              placeholder="Введите номер"
              onChange={onChange}
            />
          </div>
          <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Акция
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <select
                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.free}
                name="free"
                id="free"
                required
                onChange={onChange}
              >
                <option value="" className="text-gray-800">
                  Выберите вариант
                </option>

                <option value="yes">Да</option>
                <option value="no">Нет</option>
              </select>
              <div className="pointer-events-none absolute top-0 mt-4  right-0 flex items-center px-2 text-gray-600">
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
      </div>

      <SubmitButtons sendData={sendData} submitText="Добавить" />
    </div>
  )
}

export default WindowpriceCreate
