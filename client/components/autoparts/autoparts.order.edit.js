import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import NumberFormat from 'react-number-format'
import cx from 'classnames'
import 'react-toastify/dist/ReactToastify.css'
import autopartsList from '../../lists/autoparts-list'
import SubmitButtons from '../shared/buttons/OrderSubmitButtons'
import useSaveFilter from '../../hooks/saveFilterParams'

const AutopartsEdit = (props) => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const list = useSelector((s) => s.places.list)
  const employeeList = useSelector((s) => s.employees.list)
  const customerList = useSelector((s) => s.customers.list)

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

  const [state, setState] = useState({
    employee: props.employee,
    place: props.place,
    regnumber: props.regnumber,
    vinnumber: props.vinnumber,
    mark: props.mark,
    model: props.model,
    gen: props.gen,
    mod: props.mod,
    preorder: props.preorder.length !== 0 ? props.preorder : [{ autopartItem: '' }],
    name: props.name,
    phone: props.phone,
    prepay: props.prepay,
    comment: props.comment
  })

  const [inputFields, setInputFields] = useState(
    state.preorder.map((it) => ({
      autopartItem: it.autopartItem
    }))
  )

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
  const [customerOptions, setCustomerOptions] = useState([])
  useEffect(() => {
    if (state.phone !== '' || state.regnumber !== '' || state.vinnumber !== '') {
      setCustomerOptions(
        customerList.filter(
          (it) =>
            it.phone === state.phone ||
            it.regnumber === state.regnumber ||
            it.vinnumber === state.vinnumber
        )
      )
    } else if (state.phone === '' || state.regnumber === '' || state.vinnumber === '') {
      setCustomerOptions([])
    }
  }, [state.phone, state.regnumber, state.vinnumber, customerList])

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
      setState((prevState) => ({
        ...prevState,
        regnumber: newCustomer.regnumber,
        vinnumber: newCustomer.vinnumber,
        mark: newCustomer.mark,
        model: newCustomer.model,
        gen: newCustomer.gen,
        mod: newCustomer.mod,
        name: newCustomer.name,
        phone: newCustomer.phone
      }))
    }
    return null
  }
  const onChangeCustomer = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const onChangeCustomerUppercase = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value.toUpperCase().replace(/\s/g, '')
    }))
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
  }

  const onChangeMod = (e) => {
    const { value } = e.target
    setState((prevState) => ({
      ...prevState,
      mod: value
    }))
  }

  const { navigateWithQueryParams, searchParamsToUrl } = useSaveFilter()
  const sendData = () => {
    if (!state.employee) notify('Заполните поле Принял заказ')
    if (!state.place) notify('Заполните поле Заказ принят на точке')
    if (!state.vinnumber) notify('Заполните поле VIN номер')
    if (!state.mark) notify('Укажите марку авто')
    if (!state.model) notify('Укажите модель авто')
    if (!state.gen) notify('Укажите год авто')
    if (!state.name) notify('Заполните поле Имя клиента')
    if (!state.phone) notify('Заполните поле Телефон')
    else if (
      state.employee &&
      state.place &&
      state.vinnumber &&
      state.mark &&
      state.model &&
      state.gen &&
      state.name &&
      state.phone
    ) {
      props.updateAutopart(props.id, state)
      navigateWithQueryParams(
        `/autoparts/edit/${props.id_autoparts}/${props.num ? props.num : ''}`,
        searchParamsToUrl
      )
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
        autopartItem: ''
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
        <div className="md:flex md:flex-row -mx-3 mb-6">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <div className="flex flex-row">
              <div className="mb-5 w-1/2 pr-3">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Принял заказ
                </label>
                <div className="flex-shrink w-full inline-block relative mb-3">
                  <select
                    className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                    value={state.employee}
                    name="employee"
                    id="employee"
                    disabled="disabled"
                    onChange={onChange}
                  >
                    <option value="" disabled selected hidden className="text-gray-800">
                      Выберите сотрудника
                    </option>
                    {employeeList.map((it) => {
                      return (
                        <option value={it.id} key={it.name}>
                          {it.name} {it.surname}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>
              <div className="mb-5 w-1/2 pl-3">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Заказ принят на точке
                </label>
                <div className="flex-shrink w-full inline-block relative mb-3">
                  <select
                    className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                    value={state.place}
                    name="place"
                    id="place"
                    disabled="disabled"
                    onChange={onChange}
                  >
                    <option value="" disabled selected hidden className="text-gray-800">
                      Выберете место
                    </option>
                    {list.map((it) => {
                      return (
                        <option value={it.id} key={it.name}>
                          {it.name}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>
            </div>
            <div className="mb-5">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-city"
              >
                Гос. номер
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
                type="text"
                placeholder="Введите гос. номер русскими буквами"
                value={state.regnumber}
                name="regnumber"
                id="regnumber"
                onChange={onChangeCustomerUppercaseRussian}
              />
            </div>
            <div className="md:mb-0">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-city"
              >
                VIN номер
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
                type="text"
                placeholder="Введите VIN"
                value={state.vinnumber}
                name="vinnumber"
                id="vinnumber"
                onChange={onChangeCustomerUppercase}
              />
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
            <table className="border-collapse w-full h-full auto-search">
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
                    Введите полностью гос. номер, VIN либо номер телефона чтобы найти клиента. Если
                    клиент отстствует, заполните данные самостоятельно. Новый клиент не будет
                    создан. Новый клиент создается только при создании нового заказа
                  </td>
                  <td className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b text-center block table-cell relative static" />
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
                        {customerOptions.map((it) => {
                          return (
                            <option key={it.id} value={it.id}>
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
                  <td className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b text-center block table-cell relative static">
                    <button
                      onClick={applyCustomer}
                      type="button"
                      className={cx('py-1 px-3 text-white text-xs hover:text-white rounded-lg', {
                        'bg-green-600 hover:bg-green-700': customerOptions.length >= 1,
                        'bg-gray-500': customerOptions.length < 1
                      })}
                    >
                      Использовать
                    </button>
                  </td>
                </tr>
              </tbody>
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
              placeholder={state.mark.length < 2 ? 'Сначала выберете марку' : 'Выберите модель'}
              disabled={state.mark.length < 2}
              autoComplete="off"
              required
              onChange={onChangeModel}
            />
            {stateId.mark ? (
              <datalist id="model_list">
                {options.model.map((it) => (
                  <option key={it.name} value={it.name} label={it.name_rus} />
                ))}
              </datalist>
            ) : null}
          </div>

          <div className="md:w-1/4 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Год авто
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
              value={state.gen}
              name="gen"
              id="gen"
              list="gen_list"
              placeholder={
                state.model.length < 1 ? 'Сначала выберете модель' : 'Выберите или введите год'
              }
              disabled={state.model.length < 1}
              autoComplete="off"
              required
              onChange={onChangeGen}
            />
            <datalist id="gen_list">
              {options.gen.map((it) => (
                <option
                  key={it.name}
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
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Объем двигателя
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
              value={state.mod}
              name="mod"
              id="mod"
              list="mod_list"
              placeholder={
                state.gen.length < 2 ? 'Сначала выберете год' : 'Выберите или введите объем'
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
                  .sort(function sortItems(a, b) {
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
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              Имя клиента
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
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
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
        </div>
        <div className="-mx-3 md:flex mb-2">
          <div className="md:w-full px-3 mb-6 md:mb-0">
            <table className="border-collapse w-full">
              <thead>
                <tr>
                  <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell w-full">
                    Запчасти
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
                    <td className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b block table-cell relative static">
                      <input
                        className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                        type="text"
                        placeholder="Например: свечи"
                        name="autopartItem"
                        list="autoparts_list"
                        value={inputField.autopartItem}
                        defaultValue={
                          state.preorder.find((it, id) => id === index)
                            ? state.preorder.find((it, id) => id === index).autopartItem
                            : ''
                        }
                        onChange={(event) => handleChangeInput(index, event)}
                      />
                      <datalist id="autoparts_list">
                        {autopartsList.map((it) => (
                          <option key={it} value={it} />
                        ))}
                      </datalist>
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
                        className="py-1 px-3 bg-blue-500 text-white font-bold hover:bg-blue-700 hover:text-white rounded-lg"
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
        <div className="-mx-3 md:flex mb-2">
          <div className="md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              Предоплата
            </label>
            <div className="flex flex-row">
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
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
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              Комментарий
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
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

export default AutopartsEdit
