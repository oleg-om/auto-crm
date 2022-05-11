import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const StoTypeList = [
  { value: 'rus', name: 'Отечественные' },
  { value: 'foreign', name: 'Иномарки' }
]

// const StoCategoryList = [
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

const StopriceCreate = (props) => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const history = useHistory()
  const [state, setState] = useState({
    name: '',
    category: '',
    type: '',
    R210107first: '',
    R210107second: '',
    R210107third: '',
    R210809first: '',
    R210809second: '',
    R210809third: '',
    R2110PrioraFirst: '',
    R2110PrioraSecond: '',
    R2110PrioraThird: '',
    foreignFirst: '',
    foreignSecond: '',
    foreignThird: '',

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
      history.push(`/stoprice/list/legk`)
      notify('Услуга добавлена')
    }
  }

  return (
    <div>
      <div className="bg-white shadow rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
        <div className="-mx-3 md:flex flex-wrap">
          <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Название услуги
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
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
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Направление
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <select
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.type}
                name="type"
                id="type"
                required
                onChange={onChange}
              >
                <option value="" disabled hidden className="text-gray-800">
                  Выберите направление
                </option>
                {StoTypeList.map((it) => (
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
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Категория
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              {state.type !== 'gruz' && state.type !== 'selhoz' ? (
                <select
                  className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                  value={state.category}
                  name="category"
                  id="category"
                  required
                  onChange={onChange}
                >
                  <option value="" className="text-gray-800">
                    Выберите категорию
                  </option>
                  {props.StoCategoryList.map((it) => (
                    <option key={it.name} value={it.name}>
                      {it.name}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
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
                  <option value="free">Акция</option>
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
          className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
          htmlFor="grid-first-name"
        >
          Цены:
        </label>

        {!state.type ? <p>Сначала выбрите направление и категорию</p> : null}
        {state.type && !state.category ? <p>Выберите категорию</p> : null}

        {state.type === 'rus' ? (
          <div className="-mx-3 md:flex flex-wrap mt-3">
            <div className="md:w-1/5 px-3 mb-6 md:mb-0 flex flex-col">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                ВАЗ 2101-07 (1 кат)
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R210107first}
                name="R210107first"
                id="R210107first"
                type="number"
                placeholder="Введите цену"
                onChange={onChange}
              />
            </div>
            <div className="md:w-1/5 px-3 mb-6 md:mb-0 flex flex-col">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                ВАЗ 2101-07 (2 кат)
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R210107second}
                name="R210107second"
                id="R210107second"
                type="number"
                placeholder="Введите цену"
                onChange={onChange}
              />
            </div>
            <div className="md:w-1/5 px-3 mb-6 md:mb-0 flex flex-col">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                ВАЗ 2101-07 (3 кат)
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R210107third}
                name="R210107third"
                id="R210107third"
                type="number"
                placeholder="Введите цену"
                onChange={onChange}
              />
            </div>
            <div className="md:w-1/5 px-3 mb-6 md:mb-0 flex flex-col">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                ВАЗ 2108-09 (1 кат)
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R210809first}
                name="R210809first"
                id="R210809first"
                type="number"
                placeholder="Введите цену"
                onChange={onChange}
              />
            </div>
            <div className="md:w-1/5 px-3 mb-6 md:mb-0 flex flex-col">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                ВАЗ 2108-09 (2 кат)
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R210809second}
                name="R210809second"
                id="R210809second"
                type="number"
                placeholder="Введите цену"
                onChange={onChange}
              />
            </div>
            <div className="md:w-1/5 px-3 mb-6 md:mb-0 flex flex-col">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                ВАЗ 2108-09 (3 кат)
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R210809third}
                name="R210809third"
                id="R210809third"
                type="number"
                placeholder="Введите цену"
                onChange={onChange}
              />
            </div>
            <div className="md:w-1/5 px-3 mb-6 md:mb-0 flex flex-col">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                ВАЗ 2110 (ПРИОРА) (1 кат)
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R2110PrioraFirst}
                name="R2110PrioraFirst"
                id="R2110PrioraFirst"
                type="number"
                placeholder="Введите цену"
                onChange={onChange}
              />
            </div>
            <div className="md:w-1/5 px-3 mb-6 md:mb-0 flex flex-col">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                ВАЗ 2110 (ПРИОРА) (2 кат)
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R2110PrioraSecond}
                name="R2110PrioraSecond"
                id="R2110PrioraSecond"
                type="number"
                placeholder="Введите цену"
                onChange={onChange}
              />
            </div>
            <div className="md:w-1/5 px-3 mb-6 md:mb-0 flex flex-col">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                ВАЗ 2110 (ПРИОРА) (3 кат)
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R2110PrioraThird}
                name="R2110PrioraThird"
                id="R2110PrioraThird"
                type="number"
                placeholder="Введите цену"
                onChange={onChange}
              />
            </div>
          </div>
        ) : null}
        {state.type === 'foreign' ? (
          <div className="-mx-3 md:flex flex-wrap mt-3">
            <div className="md:w-1/5 px-3 mb-6 md:mb-0 flex flex-col">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Иномарки (1 кат)
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.foreignFirst}
                name="foreignFirst"
                id="foreignFirst"
                type="number"
                placeholder="Введите цену"
                onChange={onChange}
              />
            </div>
            <div className="md:w-1/5 px-3 mb-6 md:mb-0 flex flex-col">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Иномарки (2 кат)
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.foreignSecond}
                name="foreignSecond"
                id="foreignSecond"
                type="number"
                placeholder="Введите цену"
                onChange={onChange}
              />
            </div>
            <div className="md:w-1/5 px-3 mb-6 md:mb-0 flex flex-col">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Иномарки (3 кат)
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.foreignThird}
                name="foreignThird"
                id="foreignThird"
                type="number"
                placeholder="Введите цену"
                onChange={onChange}
              />
            </div>
          </div>
        ) : null}
        <div className="-mx-3 md:flex flex-wrap mt-3">
          <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Порядковый номер
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
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
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Акция
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <select
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
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
      <div className=" flex my-2">
        <Link
          to="/stoprice/list/rus"
          className="my-3 mr-2 py-2 md:w-1/3 px-3 bg-red-600 text-white text-center hover:bg-red-700 hover:text-white rounded-lg"
        >
          Отмена
        </Link>

        <button
          className="my-3 ml-2 py-2 md:w-2/3 px-3 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg"
          onClick={sendData}
          type="submit"
        >
          Добавить
        </button>
      </div>
    </div>
  )
}

export default StopriceCreate
