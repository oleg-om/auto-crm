import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import NumberFormat from 'react-number-format'
import Modal from '../Modal.delete'
import 'react-toastify/dist/ReactToastify.css'
import discounts from '../../lists/discounts.full'

const PlaceUpdate = (props) => {
  const [isOpen, SetIsOpen] = useState(false)
  const [state, setState] = useState({
    name: props.name,
    razval: props.razval,
    razvalquantity: props.razvalquantity,
    oil: props.oil,
    oilquantity: props.oilquantity,
    autopartsphone: props.autopartsphone,
    razvalphone: props.razvalphone,
    shinomontazh: props.shinomontazh,
    shinomontazhquantity: props.shinomontazhquantity,
    shinostavka: props.shinostavka,
    shinomontazhphone: props.shinomontazhphone,
    shinomeaning: props.shinomeaning,
    stophone: props.stophone,
    stoboxes: props.stoboxes
  })
  const history = useHistory()
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const removePlace = (e) => {
    props.deletePlace(props.id, e.target.value)
    history.push('/place/list')
    notify('Адрес удален')
  }
  const changePlace = () => {
    if (!state.name) notify('Поле Название пустое')
    if (state.razval === 'true' && !state.razvalquantity)
      notify('Поле количество постов развала пустое')
    if (state.oil === 'true' && !state.oilquantity)
      notify('Поле количество постов замены масла пустое')
    else {
      props.updatePlace(props.id, state)
      history.push('/place/list')
      notify('Данные изменены')
    }
  }

  const onChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  return (
    <div>
      <div className="bg-white shadow rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
        <div className="-mx-3 md:flex">
          <div className="md:w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Название объекта
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              value={state.name}
              name="name"
              onChange={onChange}
            />
          </div>
        </div>
        <div className="-mx-3 md:flex flex-wrap">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Развал-схождение
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <select
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.razval}
                name="razval"
                id="razval"
                onChange={onChange}
              >
                <option value="false">Нет</option>
                <option value="true">Да</option>
              </select>
              <div className="pointer-events-none absolute top-0 mt-4 right-0 flex items-center px-2 text-gray-600">
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
          <div className="md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Количество постов Развал-схождения
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              value={state.razvalquantity}
              name="razvalquantity"
              id="razvalquantity"
              type="number"
              placeholder="Введите количество постов"
              onChange={onChange}
            />
          </div>
        </div>
        <div className="-mx-3 md:flex flex-wrap">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Замена масла
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <select
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.oil}
                name="oil"
                id="oil"
                onChange={onChange}
              >
                <option value="false">Нет</option>
                <option value="true">Да</option>
              </select>
              <div className="pointer-events-none absolute top-0 mt-4 right-0 flex items-center px-2 text-gray-600">
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
          <div className="md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Количество постов замены масла
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              value={state.oilquantity}
              name="oilquantity"
              id="oilquantity"
              type="number"
              placeholder="Введите количество постов"
              onChange={onChange}
            />
          </div>
        </div>
        <div className="-mx-3 md:flex flex-wrap">
          <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Шиномонтаж
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <select
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.shinomontazh}
                name="shinomontazh"
                id="shinomontazh"
                onChange={onChange}
              >
                <option value="false">Нет</option>
                <option value="true">Да</option>
              </select>
              <div className="pointer-events-none absolute top-0 mt-4 right-0 flex items-center px-2 text-gray-600">
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
              Количество постов Шиномонтажа
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              value={state.shinomontazhquantity}
              name="shinomontazhquantity"
              id="shinomontazhquantity"
              type="number"
              placeholder="Введите количество постов"
              onChange={onChange}
            />
          </div>
          <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Процентная ставка
            </label>
            <div className="flex flex-row w-full">
              <div className="flex-shrink w-1/3 inline-block relative mb-3">
                <select
                  className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                  value={state.shinomeaning}
                  name="shinomeaning"
                  id="shinomeaning"
                  onChange={onChange}
                >
                  <option disabled value="">
                    Выберите + или -
                  </option>
                  <option value="">Нет</option>
                  <option value="positive">+</option>
                  <option value="negative">-</option>
                </select>
                <div className="pointer-events-none absolute top-0 mt-4 right-0 flex items-center px-2 text-gray-600">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <div className="flex-shrink w-2/3 pl-2 inline-block relative mb-3">
                <select
                  className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                  value={state.shinostavka}
                  name="shinostavka"
                  id="shinostavka"
                  onChange={onChange}
                >
                  <option disabled value="">
                    Выберите процент
                  </option>
                  {discounts.map((it) => (
                    <option key={it.name} value={it.value}>
                      {it.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute top-0 mt-4 right-0 flex items-center px-2 text-gray-600">
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
        <div className="-mx-3 md:flex flex-wrap">
          <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Автозапчасти - номер телефона
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <NumberFormat
                format="+7 (###) ###-##-##"
                mask="_"
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                type="text"
                placeholder="Автозапчасти - номер телефона"
                value={state.autopartsphone}
                name="autopartsphone"
                id="autopartsphone"
                onChange={onChange}
              />
            </div>
          </div>
          <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Развал - номер телефона
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <NumberFormat
                format="+7 (###) ###-##-##"
                mask="_"
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                type="text"
                placeholder="Развал - номер телефона"
                value={state.razvalphone}
                name="razvalphone"
                id="razvalphone"
                onChange={onChange}
              />
            </div>
          </div>
          <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Шиномонтаж - номер телефона
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <NumberFormat
                format="+7 (###) ###-##-##"
                mask="_"
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                type="text"
                placeholder="Шиномонтаж - номер телефона"
                value={state.shinomontazhphone}
                name="shinomontazhphone"
                id="shinomontazhphone"
                onChange={onChange}
              />
            </div>
          </div>
          <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              СТО - номер телефона
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <NumberFormat
                format="+7 (###) ###-##-##"
                mask="_"
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                type="text"
                placeholder="СТО - номер телефона"
                value={state.stophone}
                name="stophone"
                id="stophone"
                onChange={onChange}
              />
            </div>
          </div>
          <div className="md:w-1/3 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Количество постов СТО
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              value={state.stoboxes}
              name="stoboxes"
              id="stoboxes"
              type="number"
              placeholder="Введите количество постов СТО"
              onChange={onChange}
            />
          </div>
        </div>
      </div>
      <div className=" flex my-2">
        <Link
          to="/place/list"
          className="my-3 mr-2 py-2 w-1/3 px-3 bg-green-600 text-white text-center hover:bg-green-700 hover:text-white rounded-lg"
        >
          Отмена
        </Link>
        <button
          className="my-3 mr-2 py-2 w-1/3 px-3 bg-red-600 text-white text-center hover:bg-red-700 hover:text-white rounded-lg"
          type="button"
          onClick={() => SetIsOpen(true)}
        >
          Удалить
        </button>
        <button
          className="my-3 ml-2 py-2 w-2/3 px-3 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg"
          type="button"
          onClick={changePlace}
        >
          Сохранить
        </button>
      </div>
      <Modal open={isOpen} onClose={() => SetIsOpen(false)} onSubmit={removePlace} />
    </div>
  )
}

export default PlaceUpdate
