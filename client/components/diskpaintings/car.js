import React, { useEffect } from 'react'
import cx from 'classnames'
import { SwitchToTapKeyboard } from '../../hooks/keyboard'

const DIAMETERS = ['13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']

const Car = ({
  regOpen,
  onChangeRegNumber,
  onDeleteRegNumber,
  onChangeRegnumberUppercaseRussian,
  switchKeyboard,
  acceptRegnumber,
  openRegModal,
  state,
  keyboard,
  options,
  onChangeMark,
  onChangeModel,
  onSearchChange,
  search,
  customer,
  customerOptions,
  activeCustomer,
  setActiveCustomer,
  applyCustomer,
  onChange,
  setOptions,
  stateId,
  hideClass
}) => {
  useEffect(() => {
    fetch('/api/v1/carmark')
      .then((res) => res.json())
      .then((it) => {
        setOptions((prevState) => ({
          model: prevState.model,
          mark: it.data
        }))
      })
    return () => {}
  }, [setOptions])

  useEffect(() => {
    if (stateId.mark !== '') {
      fetch(`/api/v1/carmodel/${stateId.mark}`)
        .then((res) => res.json())
        .then((it) => {
          setOptions((prevState) => ({
            mark: prevState.mark,
            model: it.data
          }))
        })
    }
    return () => {}
  }, [stateId.mark, setOptions])

  return (
    <div className="md:flex md:flex-col -mx-3">
      <div className="px-3 mb-6 md:mb-0 w-full">
        <div className="inline-block text-left w-1/2 pr-5">
          <div>
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="regnumber"
            >
              Гос. номер
            </label>
            <div className="flex-shrink w-full inline-block relative">
              {keyboard === true ? (
                <input
                  className="block appearance-none w-full bg-grey-lighter border-2 border-black focus:border-gray-500 focus:outline-none py-2 px-4 pr-8 rounded-lg"
                  type="text"
                  placeholder="Русскими буквами"
                  value={state.regnumber}
                  name="regnumber"
                  id="regnumber"
                  autoComplete="off"
                  onClick={openRegModal}
                  onChange={keyboard === true ? onChangeRegnumberUppercaseRussian : null}
                />
              ) : (
                <button
                  className="block appearance-none text-left w-full bg-grey-lighter border-2 border-black focus:border-gray-500 focus:outline-none py-2 px-4 pr-8 rounded-lg"
                  value={state.regnumber}
                  name="regnumber"
                  id="regnumber"
                  type="button"
                  onClick={openRegModal}
                >
                  {state.regnumber ? state.regnumber : 'Нажмите для ввода'}
                </button>
              )}
            </div>
          </div>

          <div
            className={cx(
              'absolute p-3 mr-4 max-w-2xl rounded-md shadow bg-gray-200 border-2 border-gray-600 z-50',
              {
                hidden: regOpen === false,
                block: regOpen === true
              }
            )}
          >
            <div className="flex flex-row">
              <div className="w-full flex flex-row mb-2">
                <div className="p-1 w-1/5">
                  <button
                    type="button"
                    className="p-1 m-1 text-xl rounded font-bold bg-blue-200 hover:bg-blue-300 border-main-600 border-2 text-gray-900 w-full h-full"
                    onClick={onDeleteRegNumber}
                  >
                    ←
                  </button>
                </div>
                <div className="p-1 w-3/5">
                  <button
                    type="button"
                    className="p-1 m-1 text-xl rounded font-bold bg-green-200 hover:bg-green-300 border-green-600 border-2 text-gray-900 w-full h-full"
                    onClick={acceptRegnumber}
                  >
                    Ок
                  </button>
                </div>
                <div className="p-1 w-1/5">
                  <button
                    type="button"
                    className="p-1 m-1 text-xl rounded font-bold bg-red-200 hover:bg-red-300 border-red-600 border-2 text-gray-900 w-full h-full"
                    onClick={acceptRegnumber}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <div className="w-1/2 flex flex-wrap mr-2">
                {['А', 'В', 'Е', 'К', 'М', 'Н', 'О', 'Р', 'С', 'Т', 'У', 'Х'].map((letter) => (
                  <div key={letter} className="w-1/3 p-1">
                    <button
                      type="button"
                      className="p-3 m-1 text-lg rounded bg-yellow-200 hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                      onClick={onChangeRegNumber}
                      value={letter}
                    >
                      {letter}
                    </button>
                  </div>
                ))}
              </div>
              <div className="w-1/2 flex flex-wrap ml-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((digit) => (
                  <div key={digit} className="w-1/3 p-1">
                    <button
                      type="button"
                      className="p-3 m-1 text-lg rounded bg-white hover:bg-yellow-300 border-main-400 border-2 text-gray-900 w-full"
                      onClick={onChangeRegNumber}
                      value={digit}
                    >
                      {digit}
                    </button>
                  </div>
                ))}
                <div className="w-2/3 p-1 pl-6">
                  <button
                    type="button"
                    className="flex flex-row p-3 m-1 text-base rounded bg-orange-200 hover:bg-yellow-300 border-orange-600 border-2 text-gray-900 w-full"
                    onClick={switchKeyboard}
                  >
                    Клавиатура
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative inline-block text-left w-1/2">
          <div>
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="searchBlock"
            >
              Авто в базе данных
            </label>
            <div className="flex-shrink inline-flex w-full">
              <div className="w-3/4 relative">
                <select
                  className="w-full block appearance-none bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-2 pl-4 pr-6 rounded-l-lg"
                  value={search}
                  name="search"
                  id="searchBlock"
                  onChange={onSearchChange}
                >
                  <option value="" className="text-gray-800">
                    {customerOptions.length < 1 ? 'Клиентов не найдено' : 'Выберите клиента'}
                  </option>
                  {customerOptions.map((it, index) => (
                    <option key={index} value={it.id}>
                      {it.name}, {it.mark} {it.model} {it.regnumber},{it.phone}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-shrink w-1/4 inline-block relative">
                {customerOptions.length < 1 && !customer.idOfItem && !search ? (
                  <button
                    type="button"
                    className="md:py-1 px-3 w-full h-full text-white text-xs md:text-sm bg-gray-500 hover:text-white rounded-r-lg"
                  >
                    Нет
                  </button>
                ) : null}
                {customerOptions.length >= 1 && activeCustomer === '' && !search ? (
                  <button
                    onClick={applyCustomer}
                    type="button"
                    className="md:py-1 px-3 w-full h-full text-white text-xs md:text-sm bg-main-500 hover:text-white rounded-r-lg"
                  >
                    Выберите клиента
                  </button>
                ) : null}
                {customerOptions.length >= 1 && activeCustomer === '' && search ? (
                  <button
                    onClick={applyCustomer}
                    type="button"
                    className="md:py-1 px-3 w-full h-full text-white text-xs md:text-sm rounded-r-lg bg-green-600 hover:bg-green-700"
                  >
                    Использовать
                  </button>
                ) : null}
                {activeCustomer !== '' && customer.idOfItem && search ? (
                  <button
                    onClick={() => setActiveCustomer('')}
                    type="button"
                    className="md:py-1 px-3 w-full h-full text-white text-xs md:text-sm rounded-r-lg bg-red-600 hover:bg-red-700"
                  >
                    Сбросить
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <SwitchToTapKeyboard keyboard={keyboard} switchKeyboard={switchKeyboard} />
        {customerOptions.length >= 1 && customer.idOfItem && activeCustomer ? (
          <p className="text-left p-1">✔ Вы выбрали клиента</p>
        ) : null}
        {customerOptions.length >= 1 && !customer.idOfItem && !activeCustomer ? (
          <p className="text-left p-1">
            В базе данных найден клиент но вы не выбрали клиента. Будет создан новый клиент
          </p>
        ) : null}
        {state.regnumber && customerOptions.length === 0 && !customer.idOfItem && !activeCustomer ? (
          <p className="text-left p-1">Клиентов не найдено. Будет создан новый клиент</p>
        ) : null}

        <div className="md:flex mb-2 mt-5">
          <div className="bg-blue-400 rounded shadow p-3 w-full flex flex-row">
            <div className={hideClass ? 'w-full px-3 mb-6 md:mb-0' : 'w-1/2 px-3 mb-6 md:mb-0'}>
              <label
                className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
                htmlFor="diametr"
              >
                Диаметр диска
              </label>
              <div className="flex-shrink w-full inline-block relative">
                <select
                  className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-2 px-4 pr-8 rounded"
                  name="diametr"
                  id="diametr"
                  value={state.diametr}
                  autoComplete="off"
                  required
                  onChange={onChange}
                >
                  <option value="" hidden>
                    Выберите диаметр
                  </option>
                  {DIAMETERS.map((d) => (
                    <option key={d} value={d} label={`R${d}`} />
                  ))}
                </select>
              </div>
            </div>
            <div className={hideClass ? 'hidden' : 'w-1/2 px-3 mb-6 md:mb-0'}>
              <label
                className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
                htmlFor="class"
              >
                Класс авто
              </label>
              <div className="flex-shrink w-full inline-block relative">
                <select
                  className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-2 px-4 pr-8 rounded"
                  name="class"
                  id="class"
                  value={state.class}
                  autoComplete="off"
                  required
                  onChange={onChange}
                >
                  <option value="" hidden>Выберите класс</option>
                  <option value="legk">Легковые</option>
                  <option value="gruz">Грузовые</option>
                </select>
                <div className="pointer-events-none absolute top-0 mt-3 right-0 flex items-center px-2 text-gray-600">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-row flex w-full lg:w-1/2 mt-4 mb-5 lg:mb-0 bg-gray-200 rounded-lg shadow p-3">
          <div className="flex items-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="85" height="85">
              <g id="_13-car" data-name="13-car">
                <g id="glyph">
                  <path d="M120,236a52,52,0,1,0,52,52A52.059,52.059,0,0,0,120,236Zm0,76a24,24,0,1,1,24-24A24,24,0,0,1,120,312Z" />
                  <path d="M408,236a52,52,0,1,0,52,52A52.059,52.059,0,0,0,408,236Zm0,76a24,24,0,1,1,24-24A24,24,0,0,1,408,312Z" />
                  <path d="M477.4,193.04,384,176l-79.515-65.975A44.109,44.109,0,0,0,276.526,100H159.38a43.785,43.785,0,0,0-34.359,16.514L74.232,176H40A36.04,36.04,0,0,0,4,212v44a44.049,44.049,0,0,0,44,44h9.145a64,64,0,1,1,125.71,0h162.29a64,64,0,1,1,125.71,0H472a36.04,36.04,0,0,0,36-36V228.632A35.791,35.791,0,0,0,477.4,193.04ZM180,164a12,12,0,0,1-12,12H115.245a6,6,0,0,1-4.563-9.9l34.916-40.9A12,12,0,0,1,154.724,121H168a12,12,0,0,1,12,12Zm60,56H224a12,12,0,0,1,0-24h16a12,12,0,0,1,0,24Zm94.479-43.706-114.507-.266a12,12,0,0,1-11.972-12V133a12,12,0,0,1,12-12h57.548a12,12,0,0,1,7.433,2.58l53.228,42A6,6,0,0,1,334.479,176.294Z" />
                </g>
              </g>
            </svg>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex flex-col w-full">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="mark"
              >
                Марка авто
              </label>
              <div className="flex-shrink w-full inline-block relative">
                <select
                  className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-2 px-4 pr-8 rounded"
                  name="mark"
                  id="mark"
                  value={state.mark}
                  autoComplete="off"
                  required
                  onChange={onChangeMark}
                >
                  <option value="" hidden>
                    Выберите бренд
                  </option>
                  {options.mark
                    .sort((a, b) => {
                      if (a.name > b.name) return 1
                      if (a.name < b.name) return -1
                      return 0
                    })
                    .map((it) => (
                      <option value={it.name} label={it.name} key={it.name} />
                    ))}
                </select>
              </div>
            </div>
            <div className="mt-3 flex flex-col w-full">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="model"
              >
                Модель авто
              </label>
              <div className="flex-shrink w-full inline-block relative">
                <select
                  className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-2 px-4 pr-8 rounded"
                  value={state.model}
                  name="model"
                  id="model"
                  disabled={state.mark.length < 1}
                  autoComplete="off"
                  required
                  onChange={onChangeModel}
                >
                  <option value="" hidden>
                    {state.mark.length < 1 ? 'Сначала выберите марку' : 'Выберите модель'}
                  </option>
                  {state.mark
                    ? options.model
                        .sort((a, b) => {
                          if (a.name > b.name) return 1
                          if (a.name < b.name) return -1
                          return 0
                        })
                        .map((it) => <option value={it.name} label={it.name} key={it.name} />)
                    : null}
                  <option value="Прочее">Прочее</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Car
