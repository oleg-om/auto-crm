import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import NumberFormat from 'react-number-format'
import 'react-toastify/dist/ReactToastify.css'
import SubmitButtons from '../shared/buttons/OrderSubmitButtons'
import { getOrganizations } from '../../redux/reducers/organizations'

const CustomerCreate = (props) => {
  const dispatch = useDispatch()
  const organizations = useSelector((s) => s.organizations.list)

  useEffect(() => {
    dispatch(getOrganizations())
  }, [dispatch])
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const history = useHistory()
  const [state, setState] = useState({
    name: '',
    phone: '',
    mark: '',
    model: '',
    gen: '',
    mod: '',
    organizationId: ''
  })

  const [options, setOptions] = useState({
    mark: [],
    model: [],
    gen: [],
    mod: []
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

  const onChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
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
  const onChangeCustomerUppercase = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value.toUpperCase()
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

  const sendData = () => {
    if (!state.mod) notify('Заполните поле Объем двигателя')
    if (!state.regnumber) notify('Заполните поле гос.номер')
    if (!state.vinnumber) notify('Заполните поле VIN номер')
    if (!state.mark) notify('Укажите марку авто')
    if (!state.model) notify('Укажите модель авто')
    if (!state.gen) notify('Укажите год авто')
    if (!state.name) notify('Заполните поле Имя клиента')
    if (!state.phone) notify('Заполните поле Телефон')
    else if (
      state.name &&
      state.phone &&
      state.mark &&
      state.model &&
      state.gen &&
      state.mod &&
      state.vinnumber &&
      state.regnumber
    ) {
      const dataToSend = {
        ...state,
        organizationId: state.organizationId || null
      }
      props.create(dataToSend)
      history.push('/customer/list')
      notify('Авто клиента добавлено')
    }
  }

  return (
    <div>
      <div className="bg-white shadow rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
        <div className="-mx-3 md:flex flex-wrap">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Имя
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              value={state.name}
              name="name"
              id="name"
              placeholder="Введите имя"
              required
              onChange={onChange}
            />
          </div>
          <div className="md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Телефон
            </label>
            <NumberFormat
              format="+7 (###) ###-##-##"
              mask="_"
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              value={state.phone}
              name="phone"
              id="phone"
              placeholder="Введите телефон"
              required
              onChange={onChange}
            />
          </div>
        </div>
        <div className="-mx-3 md:flex flex-wrap">
          <div className="md:w-full px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="organizationId"
            >
              Организация
            </label>
            <div className="flex-shrink w-full inline-block relative">
              <select
                className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-3 px-4 pr-8 rounded"
                name="organizationId"
                id="organizationId"
                value={state.organizationId}
                onChange={onChange}
              >
                <option value="">Выберите организацию</option>
                {(organizations || []).map((org) => (
                  <option value={org.id} key={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none hidden absolute top-0 mt-3 right-0 lg:flex items-center px-2 text-gray-600">
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
        <div className="-mx-3 md:flex flex-wrap">
          <div className="md:w-1/4 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Марка авто
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
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
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
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
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
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
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
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
                    // a должно быть равным b
                    return 0
                  })
                  .map((it) => (
                    <option key={it.name} value={it.name} />
                  ))}
              </datalist>
            ) : null}
          </div>

          <div className="md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Гос. номер
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              value={state.regnumber}
              name="regnumber"
              placeholder="Введите гос. номер русскими буквами"
              autoComplete="off"
              required
              onChange={onChangeCustomerUppercaseRussian}
            />
          </div>
          <div className="md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              VIN номер
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
              value={state.vinnumber}
              name="vinnumber"
              id="vinnumber"
              placeholder="Введите VIN"
              autoComplete="off"
              required
              onChange={onChangeCustomerUppercase}
            />
          </div>
        </div>
      </div>
      <SubmitButtons sendData={sendData} submitText="Создать" />
    </div>
  )
}

export default CustomerCreate
