import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import NumberFormat from 'react-number-format'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import timeList from '../../lists/time-list'
import { createRazval } from '../../redux/reducers/razvals'
import SubmitButtons from '../shared/buttons/OrderSubmitButtons'

const RazvalCreate = (props) => {
  const dispatch = useDispatch()
  const list = useSelector((s) => s.places.list)
  const employeeList = useSelector((s) => s.employees.list)
  const auth = useSelector((s) => s.auth)
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const [options, setOptions] = useState({
    mark: [],
    model: []
  })
  const [stateId, setStateId] = useState({
    mark: '',
    model: ''
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
  const history = useHistory()
  const [type, setType] = useState('')
  const [state, setState] = useState({
    employee: '',
    place: '',
    date: '',
    time: '',
    mark: '',
    model: '',
    phone: '',
    employeeplace: auth.place,
    dateofcreate: new Date()
  })

  const onChangeMark = (e) => {
    const { value } = e.target
    const findCar = options.mark ? options.mark.find((it) => value === it.name) : null
    setState((prevState) => ({
      ...prevState,
      mark: value,
      model: ''
    }))
    setStateId((prevState) => ({
      ...prevState,
      mark: findCar ? findCar.id_car_mark : '',
      model: ''
    }))
  }

  const onChangeModel = (e) => {
    const { value } = e.target
    const finModel = options.model.find((it) => value === it.name)
    setState((prevState) => ({
      ...prevState,
      model: value
    }))
    setStateId((prevState) => ({
      ...prevState,
      model: finModel ? finModel.id_car_model : ''
    }))
  }
  const onChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  const onTypeChange = (e) => {
    const { value } = e.target
    setType(value)
  }

  const sendData = () => {
    if (type === 'razval') {
      dispatch(createRazval(state))
      history.push('/razval/list')
      notify('Запись на развал-схождение добавлена')
    } else if (type === 'oil') {
      props.createOilOrder(state)
      history.push('/razval/list')
      notify('Запись на замену масла добавлена')
    }
  }

  return (
    <div>
      <div className="bg-white shadow rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
        <div className="-mx-3 md:flex flex-wrap">
          <div className="md:w-1/4 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Принял заказ
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <select
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.employee}
                name="employee"
                id="employee"
                onChange={onChange}
              >
                <option disabled hidden value="" className="text-gray-800">
                  Выберите сотрудника
                </option>
                {employeeList
                  .filter((it) => it.role.includes('Развал-схождение'))
                  .map((it, index) => {
                    return (
                      <option key={index} value={it.id}>
                        {it.name} {it.surname}
                      </option>
                    )
                  })}
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
          <div className="md:w-1/4 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Куда записать?
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <select
                className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-3 px-4 pr-8 rounded"
                value={state.place}
                name="place"
                id="place"
                onChange={onChange}
              >
                <option value="" disabled hidden className="text-gray-800">
                  Выберете место
                </option>
                {list.map((it, index) => {
                  return (
                    <option value={it.id} key={index}>
                      {it.name}
                    </option>
                  )
                })}
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
          <div className="md:w-1/4 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Выберите услугу
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <select
                className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-3 px-4 pr-8 rounded"
                value={type}
                name="type"
                id="type"
                onChange={onTypeChange}
              >
                <option value="" disabled hidden className="text-gray-800">
                  Выберите услугу
                </option>
                <option value="razval">Развал</option>
                <option value="oil">Замена масла</option>
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
          <div className="md:w-1/4 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Выберите дату
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <input
                className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-3 px-4 pr-8 rounded"
                value={state.date}
                name="date"
                id="date"
                type="date"
                onChange={onChange}
              />
            </div>
          </div>
          <div className="md:w-1/4 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Выберите время
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <select
                className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-3 px-4 pr-8 rounded"
                value={state.time}
                name="time"
                id="time"
                onChange={onChange}
              >
                <option value="" disabled hidden className="text-gray-800">
                  Время записи
                </option>
                {timeList.map((it, id) => {
                  return <option key={id}>{it}</option>
                })}
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
          <div className="md:w-1/4 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Номер телефона клиента
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <NumberFormat
                className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-3 px-4 pr-8 rounded"
                format="+7 (###) ###-##-##"
                mask="_"
                name="phone"
                placeholder="Начинайте ввод с 978"
                value={state.phone}
                onChange={onChange}
              />
            </div>
          </div>
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
              placeholder={state.mark.length < 2 ? 'Сначала выберете марку' : 'Выберите модель'}
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
        </div>
      </div>

      <SubmitButtons sendData={sendData} submitText="Создать" />
    </div>
  )
}

export default RazvalCreate
