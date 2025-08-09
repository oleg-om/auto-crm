import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useReactToPrint } from 'react-to-print'
import { NumericFormat as NumberFormat } from 'react-number-format'
import cx from 'classnames'
import ComponentToPrint from './dogovor.print'
import PeredachaToPrint from './peredacha.print'
import VozvratToPrint from './vozvrat.print'
import NakleikaPrint from './nakleika.print'
import UslToPrint from './usl.print'
import 'react-toastify/dist/ReactToastify.css'
// import tyresList from '../../lists/tyres/tyres'
// import sizeOneList from '../../lists/tyres/sizeone'
// import sizeTwoList from '../../lists/tyres/sizetwo'
// import sizeThreeList from '../../lists/tyres/sizethree'
import FirstColumn from './moduls/firstcolumn'
import TyreColumn from './moduls/tyrecolumn'
import Statuses from '../../lists/storages-statuses'
import useSaveFilter from '../../hooks/saveFilterParams'
import SubmitButtons from '../shared/buttons/OrderSubmitButtons'

const dateNow = new Date()
export const dateNew = `${dateNow
  .getDate()
  .toString()
  .replace(/^(\d)$/, '0$1')}.${(dateNow.getMonth() + 1)
  .toString()
  .replace(/^(\d)$/, '0$1')}.${dateNow.getFullYear()} ${dateNow
  .getHours()
  .toString()
  .replace(/^(\d)$/, '0$1')}:${dateNow
  .getMinutes()
  .toString()
  .replace(/^(\d)$/, '0$1')}`

const StoragesUpdate = (props) => {
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  // const componentRef = useRef()
  const dogovorRef = useRef()
  const peredachaRef = useRef()
  const vozratRef = useRef()
  const nakleikaRef = useRef()
  const uslRef = useRef()

  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current
  // })
  const handlePrintDogovor = useReactToPrint({
    content: () => dogovorRef.current
  })
  const handlePrintPeredacha = useReactToPrint({
    content: () => peredachaRef.current
  })

  const handlePrintVozvrat = useReactToPrint({
    content: () => vozratRef.current
  })

  const handlePrintNakleika = useReactToPrint({
    content: () => nakleikaRef.current
  })

  const handlePrintUsl = useReactToPrint({
    content: () => uslRef.current
  })

  const list = useSelector((s) => s.places.list)
  const employeeList = useSelector((s) => s.employees.list)

  const [inputFields, setInputFields] = useState(props.preorder)

  const [state, setState] = useState({
    employee: props.employee,
    place: props.place,
    regnumber: props.regnumber,
    mark: props.mark,
    model: props.model,
    preorder: props.preorder,
    name: props.name,
    phone: props.phone,
    comment: props.comment,
    payment: props.payment,
    dateStart: props.dateStart,
    dateFinish: props.dateFinish,
    currentplace: props.currentplace,
    status: props.status,
    doplata: props.doplata,
    comment2: props?.comment2 || '',
    phoneSecond: props?.phoneSecond || ''
  })

  useEffect(() => {
    if (state.payment === 'free') {
      setState((prevState) => ({
        ...prevState,
        comment: 0
      }))
    }
    return () => {}
  }, [state.payment])

  const onChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const onChangeCustomer = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const onChangeDateFinish = (e) => {
    const { id } = e.target
    const date = new Date(state.dateStart)
    const modifiedDate = date.setMonth(Number(date.getMonth()) + Number(id))
    const today = new Date(modifiedDate).toISOString().substr(0, 10)
    setState((prevState) => ({
      ...prevState,
      dateFinish: today
    }))
  }

  const { navigateWithQueryParams, searchParamsToUrl } = useSaveFilter()

  const sendData = () => {
    if (!state.employee) notify('Заполните поле Принял заказ')
    if (!state.place) notify('Заполните поле Заказ принят на точке')
    if (!state.regnumber) notify('Заполните поле Гос. номер')
    if (!state.mark) notify('Укажите марку авто')
    if (!state.model) notify('Укажите модель авто')
    if (!state.name) notify('Заполните поле ФИО клиента')
    if (!state.phone) notify('Заполните поле Телефон')
    if (!state.dateStart) notify('Заполните обе даты')
    if (!state.payment) notify('Заполните поле оплата')
    if (!state.dateFinish) notify('Заполните обе даты')
    if (state.preorder.length === 0) notify('Заполните хранение')
    else if (
      state.employee &&
      state.place &&
      state.regnumber &&
      state.mark &&
      state.model &&
      state.name &&
      state.phone
    ) {
      if (state.status === props.status && state.currentplace === props.currentplace) {
        props.updateStorage(props.id, state)
      } else if (state.status !== props.status && state.currentplace === props.currentplace) {
        props.updateStorage(props.id, {
          ...state,
          statusDates: [...props.statusDates, { status: state.status, date: dateNew }]
        })
      } else if (state.status === props.status && state.currentplace !== props.currentplace) {
        props.updateStorage(props.id, {
          ...state,
          statusDates: [
            ...props.statusDates,
            {
              status: `Перемещение на ${list.find((pl) => pl.id === state.currentplace).name}`,
              date: dateNew
            }
          ]
        })
      } else if (state.status !== props.status && state.currentplace !== props.currentplace) {
        props.updateStorage(props.id, {
          ...state,
          statusDates: [
            ...props.statusDates,
            {
              status: `Перемещение на ${list.find((pl) => pl.id === state.currentplace).name}`,
              date: dateNew
            },
            { status: state.status, date: dateNew }
          ]
        })
      }
      navigateWithQueryParams(`/storages/order/list/${props.num || ''}`, searchParamsToUrl)
      notify('Хранение обновлено')
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
        <div className="md:flex md:flex-row -mx-3 mb-3">
          <div className="w-full px-3 mb-6 md:mb-0">
            <p className="mb-3">
              Номер хранения: <b>{props.id_storages}</b>
            </p>
            <div className="flex flex-row">
              <div className="w-3/4 flex flex-col">
                <div className="flex flex-row">
                  <div className="mb-5 w-1/2 pr-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      Принял хранение
                    </label>
                    <div className="flex-shrink w-full inline-block relative mb-3">
                      <select
                        className="block appearance-none w-full bg-gray-100 border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                        value={props.employee}
                        name="employee"
                        id="employee"
                        disabled
                        onChange={onChange}
                      >
                        <option value="" disabled hidden className="text-gray-800">
                          Выберите сотрудника
                        </option>
                        {employeeList
                          .filter((it) => it.role.includes('Хранение'))
                          .map((it, index) => {
                            return (
                              <option value={it.id} key={index}>
                                {it.name} {it.surname}
                              </option>
                            )
                          })}
                      </select>
                    </div>
                  </div>
                  <div className="mb-5 w-1/2 pl-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      Хранение принято на точке
                    </label>
                    <div className="flex-shrink w-full inline-block relative mb-3">
                      <select
                        className="block appearance-none w-full bg-gray-100 border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                        value={props.place}
                        name="place"
                        id="place"
                        disabled
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
                    </div>
                  </div>
                </div>
                <div className="flex flex-row">
                  <div className="mb-5 w-1/2 pr-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      Авто
                    </label>
                    <div
                      className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
                      type="text"
                      name="regnumber"
                      id="regnumber"
                    >
                      {props.mark} {props.model}, {props.regnumber}
                    </div>
                  </div>
                  <div className="mb-5 w-1/2 pl-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      Изменить статус хранения
                    </label>
                    <div className="flex-shrink w-full inline-block relative mb-3">
                      <select
                        className="block appearance-none w-full bg-gray-100 border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                        value={state.status}
                        name="status"
                        onChange={onChange}
                      >
                        {Statuses.map((it) => (
                          <option key={it}>{it}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute top-0 mt-2 right-0 flex items-center px-2 text-gray-600">
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
              <div className="flex flex-row w-1/4 text-right">
                <div className="flex flex-col w-1/2">
                  <div className="mb-5 w-full pl-3">
                    <button
                      type="submit"
                      onClick={handlePrintDogovor}
                      className="py-2 px-3 bg-main-600 text-white text-sm hover:bg-main-700 hover:text-white rounded-full h-22 w-22"
                    >
                      <div className="flex flex-row">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          version="1.1"
                          width="20"
                          height="20"
                          x="0"
                          y="0"
                          viewBox="0 0 512 512"
                          xmlSpace="preserve"
                          className="mr-2"
                        >
                          <g>
                            <path
                              xmlns="http://www.w3.org/2000/svg"
                              d="m414 80h-316c-5.523 0-10-4.477-10-10v-26c0-24.301 19.699-44 44-44h248c24.301 0 44 19.699 44 44v26c0 5.523-4.477 10-10 10z"
                              fill="#ffffff"
                              data-original="#000000"
                            />
                            <path
                              xmlns="http://www.w3.org/2000/svg"
                              d="m458 112h-404c-29.776 0-54 24.224-54 54v188c0 29.776 24.224 54 54 54h34v-80c0-39.701 32.299-72 72-72h192c39.701 0 72 32.299 72 72v80h34c29.776 0 54-24.224 54-54v-188c0-29.776-24.224-54-54-54zm-361.98 120c-13.255 0-24.005-10.745-24.005-24s10.74-24 23.995-24h.01c13.255 0 24 10.745 24 24s-10.745 24-24 24z"
                              fill="#ffffff"
                              data-original="#000000"
                            />
                            <path
                              xmlns="http://www.w3.org/2000/svg"
                              d="m352 304h-192c-13.255 0-24 10.745-24 24v80 32c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24v-32-80c0-13.255-10.745-24-24-24z"
                              fill="#ffffff"
                              data-original="#000000"
                            />
                          </g>
                        </svg>

                        <p> Договор</p>
                      </div>
                      <div className="hidden">
                        <ComponentToPrint
                          ref={dogovorRef}
                          props={props}
                          set={props.settings.find((it) => it.helpphone)}
                          placesList={props.placesList}
                        />
                      </div>
                    </button>
                  </div>
                  <div className="mb-5 w-full pl-3">
                    <button
                      type="submit"
                      onClick={handlePrintPeredacha}
                      className="py-2 px-3 bg-main-600 text-white text-sm hover:bg-main-700 hover:text-white rounded-full h-22 w-22"
                    >
                      <div className="flex flex-row">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          version="1.1"
                          width="20"
                          height="20"
                          x="0"
                          y="0"
                          viewBox="0 0 512 512"
                          xmlSpace="preserve"
                          className="mr-2"
                        >
                          <g>
                            <path
                              xmlns="http://www.w3.org/2000/svg"
                              d="m414 80h-316c-5.523 0-10-4.477-10-10v-26c0-24.301 19.699-44 44-44h248c24.301 0 44 19.699 44 44v26c0 5.523-4.477 10-10 10z"
                              fill="#ffffff"
                              data-original="#000000"
                            />
                            <path
                              xmlns="http://www.w3.org/2000/svg"
                              d="m458 112h-404c-29.776 0-54 24.224-54 54v188c0 29.776 24.224 54 54 54h34v-80c0-39.701 32.299-72 72-72h192c39.701 0 72 32.299 72 72v80h34c29.776 0 54-24.224 54-54v-188c0-29.776-24.224-54-54-54zm-361.98 120c-13.255 0-24.005-10.745-24.005-24s10.74-24 23.995-24h.01c13.255 0 24 10.745 24 24s-10.745 24-24 24z"
                              fill="#ffffff"
                              data-original="#000000"
                            />
                            <path
                              xmlns="http://www.w3.org/2000/svg"
                              d="m352 304h-192c-13.255 0-24 10.745-24 24v80 32c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24v-32-80c0-13.255-10.745-24-24-24z"
                              fill="#ffffff"
                              data-original="#000000"
                            />
                          </g>
                        </svg>

                        <p>Передача</p>
                      </div>
                    </button>

                    <div className="hidden">
                      <PeredachaToPrint ref={peredachaRef} props={props} />
                    </div>
                  </div>
                  <div className="mb-5 w-full pl-3">
                    <button
                      type="submit"
                      onClick={handlePrintVozvrat}
                      className="py-2 px-3 bg-main-600 text-white text-sm hover:bg-main-700 hover:text-white rounded-full h-22 w-22"
                    >
                      <div className="flex flex-row">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          version="1.1"
                          width="20"
                          height="20"
                          x="0"
                          y="0"
                          viewBox="0 0 512 512"
                          xmlSpace="preserve"
                          className="mr-2"
                        >
                          <g>
                            <path
                              xmlns="http://www.w3.org/2000/svg"
                              d="m414 80h-316c-5.523 0-10-4.477-10-10v-26c0-24.301 19.699-44 44-44h248c24.301 0 44 19.699 44 44v26c0 5.523-4.477 10-10 10z"
                              fill="#ffffff"
                              data-original="#000000"
                            />
                            <path
                              xmlns="http://www.w3.org/2000/svg"
                              d="m458 112h-404c-29.776 0-54 24.224-54 54v188c0 29.776 24.224 54 54 54h34v-80c0-39.701 32.299-72 72-72h192c39.701 0 72 32.299 72 72v80h34c29.776 0 54-24.224 54-54v-188c0-29.776-24.224-54-54-54zm-361.98 120c-13.255 0-24.005-10.745-24.005-24s10.74-24 23.995-24h.01c13.255 0 24 10.745 24 24s-10.745 24-24 24z"
                              fill="#ffffff"
                              data-original="#000000"
                            />
                            <path
                              xmlns="http://www.w3.org/2000/svg"
                              d="m352 304h-192c-13.255 0-24 10.745-24 24v80 32c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24v-32-80c0-13.255-10.745-24-24-24z"
                              fill="#ffffff"
                              data-original="#000000"
                            />
                          </g>
                        </svg>

                        <p> Возврат</p>
                      </div>
                    </button>
                    <div className="hidden">
                      <VozvratToPrint ref={vozratRef} props={props} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-1/2">
                  <div className="mb-5 w-full pl-3">
                    <button
                      type="submit"
                      onClick={handlePrintNakleika}
                      className="py-2 px-3 bg-main-600 text-white text-sm hover:bg-main-700 hover:text-white rounded-full h-22 w-22"
                    >
                      <div className="flex flex-row">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          version="1.1"
                          width="20"
                          height="20"
                          x="0"
                          y="0"
                          viewBox="0 0 512 512"
                          xmlSpace="preserve"
                          className="mr-2"
                        >
                          <g>
                            <path
                              xmlns="http://www.w3.org/2000/svg"
                              d="m414 80h-316c-5.523 0-10-4.477-10-10v-26c0-24.301 19.699-44 44-44h248c24.301 0 44 19.699 44 44v26c0 5.523-4.477 10-10 10z"
                              fill="#ffffff"
                              data-original="#000000"
                            />
                            <path
                              xmlns="http://www.w3.org/2000/svg"
                              d="m458 112h-404c-29.776 0-54 24.224-54 54v188c0 29.776 24.224 54 54 54h34v-80c0-39.701 32.299-72 72-72h192c39.701 0 72 32.299 72 72v80h34c29.776 0 54-24.224 54-54v-188c0-29.776-24.224-54-54-54zm-361.98 120c-13.255 0-24.005-10.745-24.005-24s10.74-24 23.995-24h.01c13.255 0 24 10.745 24 24s-10.745 24-24 24z"
                              fill="#ffffff"
                              data-original="#000000"
                            />
                            <path
                              xmlns="http://www.w3.org/2000/svg"
                              d="m352 304h-192c-13.255 0-24 10.745-24 24v80 32c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24v-32-80c0-13.255-10.745-24-24-24z"
                              fill="#ffffff"
                              data-original="#000000"
                            />
                          </g>
                        </svg>

                        <p>Наклейка</p>
                      </div>
                    </button>
                    <div className="hidden">
                      <NakleikaPrint
                        ref={nakleikaRef}
                        props={props}
                        helpphone={props.settings.map((it) => it.helpphone)}
                        placesList={props.placesList}
                      />
                    </div>
                  </div>
                  <div className="mb-5 w-full pl-3">
                    <button
                      type="submit"
                      onClick={handlePrintUsl}
                      className="py-2 px-3 bg-main-600 text-white text-sm hover:bg-main-700 hover:text-white rounded-full h-22 w-22"
                    >
                      <div className="flex flex-row">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          version="1.1"
                          width="20"
                          height="20"
                          x="0"
                          y="0"
                          viewBox="0 0 512 512"
                          xmlSpace="preserve"
                          className="mr-2"
                        >
                          <g>
                            <path
                              xmlns="http://www.w3.org/2000/svg"
                              d="m414 80h-316c-5.523 0-10-4.477-10-10v-26c0-24.301 19.699-44 44-44h248c24.301 0 44 19.699 44 44v26c0 5.523-4.477 10-10 10z"
                              fill="#ffffff"
                              data-original="#000000"
                            />
                            <path
                              xmlns="http://www.w3.org/2000/svg"
                              d="m458 112h-404c-29.776 0-54 24.224-54 54v188c0 29.776 24.224 54 54 54h34v-80c0-39.701 32.299-72 72-72h192c39.701 0 72 32.299 72 72v80h34c29.776 0 54-24.224 54-54v-188c0-29.776-24.224-54-54-54zm-361.98 120c-13.255 0-24.005-10.745-24.005-24s10.74-24 23.995-24h.01c13.255 0 24 10.745 24 24s-10.745 24-24 24z"
                              fill="#ffffff"
                              data-original="#000000"
                            />
                            <path
                              xmlns="http://www.w3.org/2000/svg"
                              d="m352 304h-192c-13.255 0-24 10.745-24 24v80 32c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24v-32-80c0-13.255-10.745-24-24-24z"
                              fill="#ffffff"
                              data-original="#000000"
                            />
                          </g>
                        </svg>

                        <p>Условия</p>
                      </div>
                    </button>
                    <div className="hidden">
                      <UslToPrint ref={uslRef} props={props} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="-mx-3 md:flex flex-wrap mb-3">
          <div className="mb-5 w-1/2 pl-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Текущее место хранения
            </label>
            <div className="flex-shrink w-full inline-block relative mb-3">
              <select
                className="block appearance-none w-full bg-gray-100 border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                value={state.currentplace}
                name="currentplace"
                id="currentplace"
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

          <div className="md:w-1/4 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-gray-800 px-3 bg-green-300 rounded text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Дата начала
            </label>
            <input
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
              value={state.dateStart}
              name="dateStart"
              id="dateStart"
              disabled
              type="date"
              autoComplete="off"
              required
              onChange={onChange}
            />
          </div>
          <div className="md:w-1/4 px-3 mb-6 md:mb-0 flex flex-col">
            <label
              className="block uppercase tracking-wide text-gray-800 px-3 bg-green-300 rounded text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Дата завершения
            </label>
            <input
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
              value={state.dateFinish}
              name="dateFinish"
              id="dateFinish"
              type="date"
              autoComplete="off"
              required
              onChange={onChange}
            />
            <div className="flex flex-row">
              <button
                type="button"
                className=" px-2 mx-2  w-1/5  rounded-lg bg-main-600 hover:bg-blue-400 text-white text-sm"
                id="1"
                onClick={onChangeDateFinish}
              >
                +1
              </button>
              <button
                type="button"
                className=" px-2 mx-2 w-1/5 rounded-lg bg-main-600 hover:bg-blue-400 text-white text-sm"
                id="2"
                onClick={onChangeDateFinish}
              >
                +2
              </button>
              <button
                type="button"
                className=" px-2 mx-2 w-1/5 rounded-lg bg-main-600 hover:bg-blue-400 text-white text-sm"
                id="3"
                onClick={onChangeDateFinish}
              >
                +3
              </button>
              <button
                type="button"
                className=" px-2 mx-2 w-1/5 rounded-lg bg-main-600 hover:bg-blue-400 text-white text-sm"
                id="7"
                onClick={onChangeDateFinish}
              >
                +7
              </button>
              <button
                type="button"
                className=" px-2 mx-2 w-1/5 rounded-lg bg-main-600 hover:bg-blue-400 text-white text-sm"
                id="12"
                onClick={onChangeDateFinish}
              >
                +12
              </button>
            </div>
          </div>
        </div>
        <div className="-mx-3 md:flex mb-2">
          <div className="md:w-1/3 px-3 mb-6 md:mb-0">
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
          <div className="md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              ФИО клиента
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
          <div className="md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              Оплата
            </label>
            <div className="flex-shrink w-full inline-block relative">
              <select
                className={cx(
                  'block appearance-none w-full bg-gray-100 border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 mb-3 rounded',
                  {
                    'bg-green-200': state.payment === 'yes',
                    'bg-red-200': state.payment === 'no',
                    'bg-yellow-200': state.payment === 'free'
                  }
                )}
                name="payment"
                id="payment"
                value={state.payment}
                autoComplete="off"
                required
                onChange={onChange}
              >
                <option value="yes">Оплачено</option>
                <option value="no">Не оплачено</option>
                <option value="free">Акция (бесплатно)</option>
              </select>
              <div className="pointer-events-none hidden absolute top-0 mt-2 right-0 lg:flex items-center px-2 text-gray-600">
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

        <div className="-mx-3 md:flex mb-2">
          <div className="md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              Дополнительный номер телефона
            </label>
            <NumberFormat
              format="+7 (###) ###-##-##"
              mask="_"
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
              type="text"
              placeholder="Начинайте ввод с 978"
              value={state.phoneSecond}
              name="phoneSecond"
              id="phoneSecond"
              onChange={onChangeCustomer}
            />
          </div>
        </div>

        {/* <div className="flex flex-col mb-5 bg-green-200 rounded-lg p-3">
          <p className="flex flex-row mb-2 text-lg font-mono font-extrabold">Шины</p>
          <div className="flex flex-row w-full">
            <div className="mr-2 md:w-2/12">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Ширина
              </label>
              <input
                className="appearance-none w-full block bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                type="number"
                name="sizeone"
                list="sizeone_list"
                value={state.sizeone}
                autoComplete="off"
                onChange={onChange}
              />
              <datalist id="sizeone_list">
                {sizeOneList.map((it, indexItem) => (
                  <option key={indexItem} value={it} />
                ))}
              </datalist>
            </div>
            <div className="mr-2 md:w-2/12">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Высота
              </label>
              <input
                className="appearance-none w-full block bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                type="number"
                name="sizetwo"
                list="sizetwo_list"
                value={state.sizetwo}
                autoComplete="off"
                onChange={onChange}
              />
              <datalist id="sizetwo_list">
                {sizeTwoList.map((it, indexItem) => (
                  <option key={indexItem} value={it} />
                ))}
              </datalist>
            </div>
            <div className="mr-2 md:w-2/12">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Диаметр
              </label>
              <input
                className="appearance-none w-full block bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                type="number"
                name="sizethree"
                list="sizethree_list"
                value={state.sizethree}
                autoComplete="off"
                onChange={onChange}
              />
              <datalist id="sizethree_list">
                {sizeThreeList.map((it, indexItem) => (
                  <option key={indexItem} value={it} />
                ))}
              </datalist>
            </div>
            <div className="mr-2 md:w-3/12">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Бренд
              </label>
              <input
                className="appearance-none w-full block bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                type="text"
                placeholder="Например: Nokian"
                name="brand"
                list="tyres_list"
                value={state.brand}
                autoComplete="off"
                onChange={onChange}
              />
              <datalist id="tyres_list">
                {tyresList
                  .reduce((acc, rec) => [...acc, rec.brand], [])
                  .filter((item, id, array) => array.indexOf(item) === id)
                  .sort(function (a, b) {
                    if (a > b) {
                      return 1
                    }
                    if (a < b) {
                      return -1
                    }
                    return 0
                  })
                  .map((it, indexItem) => (
                    <option key={indexItem} value={it} />
                  ))}
              </datalist>
            </div>
            <div className="mr-2 md:w-3/12">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Модель
              </label>
              <input
                className="appearance-none w-full block bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                type="text"
                placeholder="Например: Nordman"
                name="model"
                list="tyres_model_list"
                value={state.model}
                autoComplete="off"
                onChange={onChange}
              />
              <datalist id="tyres_model_list">
                {tyresList
                  .filter((item) => item.brand === state.brand)
                  .reduce((acc, rec) => [...acc, rec.model], [])
                  .filter((item, id, array) => array.indexOf(item) === id)
                  .sort(function (a, b) {
                    if (a > b) {
                      return 1
                    }
                    if (a < b) {
                      return -1
                    }
                    return 0
                  })
                  .map((it, indexItem) => (
                    <option key={indexItem} value={it} />
                  ))}
              </datalist>
            </div>
          </div>
        </div> */}

        <div className="-mx-3 md:flex mb-2">
          <div className="md:w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              Хранение
            </label>
            <table className="border-collapse w-full">
              <thead>
                <tr>
                  <th className="p-3 font-bold uppercase bg-green-300 text-gray-800 border border-gray-300 table-cell">
                    Тип
                  </th>
                  <th className="p-3 font-bold uppercase bg-green-300 text-gray-800 border border-gray-300 table-cell w-full">
                    Наименование
                  </th>
                  <th className="p-3 font-bold uppercase bg-green-300 text-sm text-gray-800 border border-gray-300 table-cell whitespace-nowrap">
                    Кол-во
                  </th>

                  <th className="p-3 font-bold uppercase bg-green-300 text-gray-800 border border-gray-300 table-cell">
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
                    <TyreColumn
                      inputField={inputField}
                      handleChangeInput={handleChangeInput}
                      index={index}
                    />

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

        <div className="-mx-3 md:flex my-2">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              {state.payment === 'free'
                ? 'Цена (по умолчанию равна 0 при покупке новых шин)'
                : 'Цена'}
            </label>
            <input
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
              type="number"
              placeholder="Сумма хранения"
              value={state.comment}
              disabled={state.payment === 'free'}
              name="comment"
              id="comment"
              onChange={onChange}
            />
          </div>
          <div className="w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              Доплата за просрочку
            </label>
            <input
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
              type="number"
              placeholder="Доплата за просрочку"
              value={state.doplata}
              disabled={state.payment === 'free'}
              name="doplata"
              id="doplata"
              onChange={onChange}
            />
          </div>
        </div>

        <div className="-mx-3 md:flex my-2">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              Комментарий
            </label>
            <input
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4 mb-3"
              placeholder="Комментарий"
              value={state.comment2}
              name="comment2"
              id="comment2"
              onChange={onChange}
            />
          </div>
        </div>

        <div className="md:m-3 lg:flex rounded-lg px-6 py-2 w-auto shadow bg-gray-100 my-2">
          <div className="text-center md:text-left m-3">
            <h2>История хранения</h2>
            <div>
              <ul>
                <li>
                  <b>Хранение принято: </b>{' '}
                  {`${new Date(props.date)
                    .getDate()
                    .toString()
                    .replace(/^(\d)$/, '0$1')}.${(new Date(props.date).getMonth() + 1)
                    .toString()
                    .replace(/^(\d)$/, '0$1')}.${new Date(props.date).getFullYear()} ${new Date(
                    props.date
                  ).getHours()}:${new Date(props.date)
                    .getMinutes()
                    .toString()
                    .replace(/^(\d)$/, '0$1')}`}
                </li>

                {props.statusDates.map((it) => (
                  <li key={it.date}>
                    <b>{it.status}: </b> {it.date}{' '}
                    {it?.shinomontazh_id ? (
                      <Link to={`/shinomontazh/edit/${it?.shinomontazh_id}`}>
                        , Шиномонтаж: {it?.shinomontazh_id}
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <SubmitButtons sendData={sendData} />
    </div>
  )
}

export default StoragesUpdate
