import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { NumericFormat as NumberFormat } from 'react-number-format'
import 'react-toastify/dist/ReactToastify.css'
import FirstColumn from './moduls/firstcolumn'
import TyreColumn from './moduls/tyrecolumn'
import AkbColumn from './moduls/akbcolumn'
import WheelColumn from './moduls/wheelcolumn'
import SubmitButtons from '../shared/buttons/OrderSubmitButtons'

const TyresEdit = (props) => {
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const history = useHistory()
  const list = useSelector((s) => s.places.list)
  const employeeList = useSelector((s) => s.employees.list)
  const customerList = useSelector((s) => s.customers.list)
  const auth = useSelector((s) => s.auth)

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
  const [inputFields, setInputFields] = useState(props.preorder)
  const [activeCustomer, setActiveCustomer] = useState('')
  const [state, setState] = useState({
    employee: props.employee,
    place: props.place,
    mark: props.mark ? props.mark : '',
    model: props.model ? props.model : '',
    gen: props.gen ? props.gen : '',
    mod: props.mod ? props.mod : '',
    preorder:
      props.preorder && props.preorder.length !== 0 ? props.preorder : [{ autopartItem: '' }],
    name: props.name,
    phone: props.phone,
    prepay: props.prepay,
    comment: props.comment
  })
  const [customer, setCustomer] = useState({
    regnumber: '',
    vinnumber: '',
    mark: '',
    model: '',
    gen: '',
    mod: '',
    name: '',
    phone: '',
    idOfItem: ''
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

  useEffect(() => {
    if (stateId.model !== '') {
      fetch(`/api/v1/cargen/${stateId.model}`)
        .then((res) => res.json())
        .then((it) => {
          setOptions((prevState) => ({
            ...prevState,
            gen: it.data
          }))
        })
    }
    return () => {}
  }, [stateId.model])

  useEffect(() => {
    if (stateId.model !== '') {
      fetch(`/api/v1/carmod/${stateId.model}`)
        .then((res) => res.json())
        .then((it) => {
          setOptions((prevState) => ({
            ...prevState,
            mod: it.data
          }))
        })
    }
    return () => {}
  }, [stateId.model])

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
  const [customerOptions, setCustomerOptions] = useState([])
  useEffect(() => {
    if (state.phone !== '') {
      setCustomerOptions(
        customerList.filter(
          (it) => it.phone === state.phone && it.phone !== '' && state.phone !== ''
        )
      )
    } else if (state.phone === '') {
      setCustomerOptions([])
    }
  }, [state.phone, customerList])

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
    const newCustomer = customerList.find((it) => it.id === search)
    if (newCustomer) {
      setCustomer((prevState) => ({
        ...prevState,
        regnumber: newCustomer.regnumber ? newCustomer.regnumber : '',
        vinnumber: newCustomer.vinnumber ? newCustomer.vinnumber : '',
        mark: newCustomer.mark ? newCustomer.mark : '',
        model: newCustomer.model ? newCustomer.model : '',
        gen: newCustomer.gen ? newCustomer.gen : '',
        mod: newCustomer.mod ? newCustomer.mod : '',
        name: newCustomer.name ? newCustomer.name : '',
        phone: newCustomer.phone ? newCustomer.phone : '',
        idOfItem: newCustomer.id
      }))
      setState((prevState) => ({
        ...prevState,
        regnumber: newCustomer.regnumber ? newCustomer.regnumber : '',
        vinnumber: newCustomer.vinnumber ? newCustomer.vinnumber : '',
        mark: newCustomer.mark ? newCustomer.mark : '',
        model: newCustomer.model ? newCustomer.model : '',
        gen: newCustomer.gen ? newCustomer.gen : '',
        mod: newCustomer.mod ? newCustomer.mod : '',
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
    setCustomer((prevState) => ({
      ...prevState,
      mark: value
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
    setCustomer((prevState) => ({
      ...prevState,
      model: value
    }))
  }

  const onChangeGen = (e) => {
    const { value } = e.target
    const findGen = options.gen.find((it) =>
      value === it.year_begin && it.year_end
        ? `${it.name} (${it.year_begin}-${it.year_end})`
        : it.name
    )
    setState((prevState) => ({
      ...prevState,
      gen: value,
      mod: ''
    }))
    setStateId((prevState) => ({
      ...prevState,
      gen: findGen ? findGen.id_car_generation : '',
      mod: ''
    }))
    setCustomer((prevState) => ({
      ...prevState,
      gen: value
    }))
  }

  const onChangeMod = (e) => {
    const { value } = e.target
    setState((prevState) => ({
      ...prevState,
      mod: value
    }))
    setCustomer((prevState) => ({
      ...prevState,
      mod: value
    }))
  }
  const sendData = () => {
    if (!state.employee) notify('Заполните поле Принял заказ')
    if (!state.place) notify('Заполните поле Заказ принят на точке')
    if (!state.name) notify('Заполните поле Имя клиента')
    if (!state.phone) notify('Заполните поле Телефон')
    if (state.preorder.length === 0) notify('Заполните заказ')
    if (state.preorder.filter((it) => it.type === '2').length > 0 && !state.mark && !state.model)
      notify('Вы заказываете диски. Укажите марку и модель авто')
    else if (state.employee && state.place && state.name && state.phone) {
      props.updateTyre(props.id, state)
      history.push(`/tyres/edit/${props.id_tyres}/${props.num ? props.num : ''}`)
      notify('Данные о заказе обновлены')
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
  return (
    <div>
      <div className="bg-white shadow rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
        <div className="md:flex md:flex-row -mx-3">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <div className="flex flex-row">
              <div className="mb-3 w-1/2 pr-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Принял заказ
                </label>
                <div className="flex-shrink w-full inline-block relative mb-3">
                  <select
                    className="block appearance-none w-full bg-gray-100 border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                    value={state.employee}
                    name="employee"
                    id="employee"
                    disabled="disabled"
                    onChange={onChange}
                  >
                    <option value="" disabled hidden className="text-gray-800">
                      Выберите сотрудника
                    </option>
                    {employeeList
                      .filter(
                        (it) =>
                          it.role.includes('Прием заказов (шины)') ||
                          it.role.includes('Обработка заказов (шины)')
                      )
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
              <div className="mb-3 w-1/2 pl-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Заказ принят на точке
                </label>
                <div className="flex-shrink w-full inline-block relative mb-3">
                  <select
                    className="block appearance-none w-full bg-gray-100 border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                    value={state.place}
                    name="place"
                    id="place"
                    disabled="disabled"
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
            <div className="md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-city"
              >
                Номер телефона
              </label>
              <NumberFormat
                format="+7 (###) ###-##-##"
                mask="_"
                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
                type="text"
                placeholder="Начинайте ввод с 978"
                value={state.phone}
                name="phone"
                id="phone"
                onChange={onChangeCustomer}
              />
            </div>
            <div className="mb-5">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-city"
              >
                Имя клиента
              </label>
              <input
                className="capitalize appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
                type="text"
                placeholder="Введите имя"
                value={state.name}
                name="name"
                id="name"
                onChange={onChangeCustomer}
              />
            </div>
          </div>
          <div className="md:w-1/2 px-3">
            <div>
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
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
                  <td className="w-full lg:w-auto p-2 lg:py-5 text-xs text-gray-800 text-center border border-b block table-cell relative static">
                    Введите полностью номер телефона чтобы найти клиента. Если клиент отсутствует,
                    заполните данные самостоятельно. Вы можете редактировать клиентов на странице{' '}
                    <Link to="/customer/list" className="underline">
                      Клиенты
                    </Link>
                  </td>
                  <td className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b text-center block table-cell relative static" />
                </tr>
                <tr className="bg-white lg:hover:bg-gray-100 flex table-row flex-row lg:flex-row flex-wrap flex-no-wrap mb-10 lg:mb-0">
                  <td className="w-full lg:w-auto p-2 text-xs text-gray-800 text-center border border-b block table-cell relative static">
                    <div className="flex-shrink w-full inline-block relative">
                      <select
                        className="block appearance-none w-full bg-gray-100 border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
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
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Марка авто
            </label>
            <input
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
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
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Модель авто
            </label>
            <input
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
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
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Год авто
            </label>
            <input
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
              value={state.gen}
              name="gen"
              id="gen"
              list="gen_list"
              placeholder={
                state.model.length < 1 ? 'Сначала выберите модель' : 'Выберите или введите год'
              }
              disabled={state.model.length < 1}
              autoComplete="off"
              required
              onChange={onChangeGen}
            />
            <datalist id="gen_list">
              {options.gen.map((it, index) => (
                <option
                  key={index}
                  value={
                    it.year_begin && it.year_end
                      ? `${it.name} (${it.year_begin}-${it.year_end})`
                      : it.name
                  }
                  label={it.name_rus}
                />
              ))}
            </datalist>
          </div>
          <div className="md:w-1/4 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Объем двигателя
            </label>
            <input
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
              value={state.mod}
              name="mod"
              id="mod"
              list="mod_list"
              placeholder={
                state.gen.length < 2 ? 'Сначала выберите год' : 'Выберите или введите объем'
              }
              disabled={state.gen.length < 2}
              autoComplete="off"
              required
              onChange={onChangeMod}
            />
            {stateId.gen ? (
              <datalist id="mod_list">
                {options.mod
                  .reduce((thing, current) => {
                    const x = thing.find((item) => item.name === current.name)
                    if (!x) {
                      return thing.concat([current])
                    }
                    return thing
                  }, [])
                  .sort(function (a, b) {
                    if (a.name > b.name) {
                      return 1
                    }
                    if (a.name < b.name) {
                      return -1
                    }
                    return 0
                  })
                  .map((it) => (
                    <option key={it.name} value={it.name} />
                  ))}
              </datalist>
            ) : null}
          </div>
        </div>
        <div className="-mx-3 md:flex mb-2">
          <div className="md:w-full px-3 mb-6 md:mb-0">
            <table className="border-collapse w-full">
              <thead>
                <tr>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                    Тип
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell w-full">
                    Наименование
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-sm text-gray-600 border border-gray-300 table-cell whitespace-nowrap">
                    Кол-во
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-sm text-gray-600 border border-gray-300 table-cell whitespace-nowrap">
                    Цена
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-sm text-gray-600 border border-gray-300 table-cell whitespace-nowrap">
                    Сумма
                  </th>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
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
                    {inputField.type === '1' ? (
                      <TyreColumn
                        inputField={inputField}
                        handleChangeInput={handleChangeInput}
                        index={index}
                      />
                    ) : null}
                    {inputField.type === '3' ? (
                      <AkbColumn
                        inputField={inputField}
                        handleChangeInput={handleChangeInput}
                        index={index}
                      />
                    ) : null}
                    {inputField.type === '2' ? (
                      <WheelColumn
                        inputField={inputField}
                        handleChangeInput={handleChangeInput}
                        index={index}
                      />
                    ) : null}
                    <td className="p-2 text-gray-800 text-center border border-b table-cell relative">
                      <input
                        className="w-32 appearance-none block bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                        name="quantity"
                        type="number"
                        value={inputField.quantity}
                        autoComplete="off"
                        onChange={(event) => handleChangeInput(index, event)}
                      />
                    </td>
                    <td className="p-2 text-gray-800 text-center border border-b table-cell relative">
                      <input
                        className="w-32 appearance-none block bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                        name="price"
                        type="number"
                        value={inputField.price}
                        autoComplete="off"
                        onChange={(event) => handleChangeInput(index, event)}
                      />
                    </td>
                    <td className="p-2 text-gray-800 text-center border border-b table-cell relative">
                      <p>
                        {inputField.price && inputField.quantity
                          ? inputField.price * inputField.quantity
                          : null}
                      </p>
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
        {state.preorder.length > 1 && state.preorder[0].price && state.preorder[0].quantity ? (
          <div className="-mx-3 md:flex mb-2 flex-row">
            <div className="px-3 mb-6 md:mb-0">
              <div className="flex flex-row">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-city"
                >
                  Общая сумма
                </label>
              </div>
              <p className="ml-3">
                {state.preorder.length >= 1
                  ? state.preorder.reduce(function fullPrice(acc, rec) {
                      if (rec.price && rec.quantity)
                        if (rec.price.match(/[0-9]/) && rec.quantity.match(/[0-9]/)) {
                          return acc + rec.price * rec.quantity
                        }
                      return acc
                    }, 0)
                  : null}
              </p>
            </div>
          </div>
        ) : null}
        <div className="-mx-3 md:flex mb-2">
          <div className="md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              Предоплата
            </label>
            <div className="flex flex-row">
              <input
                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
                type="text"
                placeholder="Вы можете оставить поле пустым"
                value={state.prepay}
                name="prepay"
                id="prepay"
                onChange={onChange}
              />
            </div>
          </div>
          <div className="md:w-2/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              Комментарий
            </label>
            <input
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
              type="text"
              placeholder="Оставьте комментарий"
              value={state.comment}
              name="comment"
              id="comment"
              onChange={onChange}
            />
          </div>
        </div>
      </div>

      <SubmitButtons sendData={sendData} />
    </div>
  )
}

export default TyresEdit
