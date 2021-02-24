import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ShinomontazhTypeList from '../../lists/shinomontazhtype-list'
import ShinomontazhCategoryList from '../../lists/shinomontazhprice-list'

const ShinomontazhpriceCreate = (props) => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const history = useHistory()
  const [state, setState] = useState({
    name: '',
    category: '',
    type: '',
    R13: '',
    R14: '',
    R15: '',
    R16: '',
    R17: '',
    R18: '',
    R19: '',
    R20: '',
    R21: '',
    R22: '',
    R23: '',
    R24: '',
    R13C: '',
    R14C: '',
    R15C: '',
    R16C: '',
    R17C: '',
    R175: '',
    R195: '',
    R20240: '',
    R20280: '',
    R20320: '',
    R225: '',
    R245: '',
    R8: '',
    R9: '',
    R10: '',
    R12: '',
    R165: '',
    R25: '',
    R26: '',
    R28: '',
    R30: '',
    R32: '',
    R33: '',
    R34: '',
    R38: '',
    R42: '',
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
      history.push('/shinomontazhprice/list')
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
                {ShinomontazhTypeList.map((it) => (
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
                  {ShinomontazhCategoryList.map((it) => (
                    <option key={it.value} value={it.value}>
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
        {state.type === 'legk' && state.category ? (
          <div className="-mx-3 md:flex flex-wrap mt-3">
            <div className="md:w-1/5 px-3 mb-6 md:mb-0 flex flex-col">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                R13
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R13}
                name="R13"
                id="R13"
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
                R14
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R14}
                name="R14"
                id="R14"
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
                R15
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R15}
                name="R15"
                id="R15"
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
                R16
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R16}
                name="R16"
                id="R16"
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
                R17
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R17}
                name="R17"
                id="R17"
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
                R18
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R18}
                name="R18"
                id="R18"
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
                R19
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R19}
                name="R19"
                id="R19"
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
                R20
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R20}
                name="R20"
                id="R20"
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
                R21
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R21}
                name="R21"
                id="R21"
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
                R22
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R22}
                name="R22"
                id="R22"
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
                R23
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R23}
                name="R23"
                id="R23"
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
                R24
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R24}
                name="R24"
                id="R24"
                type="number"
                placeholder="Введите цену"
                onChange={onChange}
              />
            </div>
          </div>
        ) : null}
        {state.type === 'gruz' ? (
          <div className="-mx-3 md:flex flex-wrap mt-3">
            <div className="md:w-1/5 px-3 mb-6 md:mb-0 flex flex-col">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                R13C
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R13C}
                name="R13C"
                id="R13C"
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
                R14C
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R14C}
                name="R14C"
                id="R14C"
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
                R15C
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R15C}
                name="R15C"
                id="R15C"
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
                R16С
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R16C}
                name="R16C"
                id="R16C"
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
                R17С
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R17C}
                name="R17C"
                id="R17C"
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
                R17,5
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R175}
                name="R175"
                id="R175"
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
                R19,5
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R195}
                name="R195"
                id="R195"
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
                R20
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R20}
                name="R20"
                id="R20"
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
                R20-240
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R20240}
                name="R20240"
                id="R20240"
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
                R20-280
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R20280}
                name="R20280"
                id="R20280"
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
                R20-320
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R20320}
                name="R20320"
                id="R20320"
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
                R22,5
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R225}
                name="R225"
                id="R225"
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
                R23
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R23}
                name="R23"
                id="R23"
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
                R24
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R24}
                name="R24"
                id="R24"
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
                R24,5
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R245}
                name="R245"
                id="R245"
                type="number"
                placeholder="Введите цену"
                onChange={onChange}
              />
            </div>
          </div>
        ) : null}
        {state.type === 'selhoz' ? (
          <div className="-mx-3 md:flex flex-wrap mt-3">
            <div className="md:w-1/5 px-3 mb-6 md:mb-0 flex flex-col">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                R8
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R8}
                name="R8"
                id="R8"
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
                R9
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R9}
                name="R9"
                id="R9"
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
                R10
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R10}
                name="R10"
                id="R10"
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
                R12
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R12}
                name="R12"
                id="R12"
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
                R15
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R15}
                name="R15"
                id="R15"
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
                R16,5
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R165}
                name="R165"
                id="R165"
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
                R18
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R18}
                name="R18"
                id="R18"
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
                R20
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R20}
                name="R20"
                id="R20"
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
                R24
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R24}
                name="R24"
                id="R24"
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
                R25
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R25}
                name="R25"
                id="R25"
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
                R26
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R26}
                name="R26"
                id="R26"
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
                R28
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R28}
                name="R28"
                id="R28"
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
                R30
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R30}
                name="R30"
                id="R30"
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
                R32
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R32}
                name="R32"
                id="R32"
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
                R33
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R33}
                name="R33"
                id="R33"
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
                R34
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R34}
                name="R34"
                id="R34"
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
                R38
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R38}
                name="R33"
                id="R33"
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
                R42
              </label>
              <input
                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
                value={state.R42}
                name="R42"
                id="R42"
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
          to="/shinomontazhprice/list"
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

export default ShinomontazhpriceCreate
