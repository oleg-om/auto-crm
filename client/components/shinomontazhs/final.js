import React, { useEffect } from 'react'
import cx from 'classnames'
import tyresList from '../../lists/tyres/tyres'
import discountList from '../../lists/discounts'
import sizeOneList from '../../lists/tyres/sizeone'
import sizeTwoList from '../../lists/tyres/sizetwo'

const Final = ({
  //     materialprices,
  // shinomontazhprices,
  //   checkboxServiceChange,
  state,
  service,
  materials,
  onChange,
  onChangeTyres,
  checkboxTyresChange,
  tyres,
  onChangeTermCash,
  setTermCash,
  termCash,
  dateEnd,
  printOne,
  printTwo
}) => {
  const kuzovCheck = () => {
    if (state.kuzov === 'sedan') return 'Седан'
    if (state.kuzov === 'crossover') return 'Кроссовер'
    if (state.kuzov === 'runflat') return 'RUN FLAT'
    if (state.kuzov === 'gruz') return 'Грузовой'
    if (state.kuzov === 'selhoz') return 'Сельхоз'
    return ''
  }

  const applyDiscount = (number) => {
    const disc = state.discount ? state.discount : 0
    const number_percent = (number / 100) * disc

    return Number(number) - Number(number_percent)
  }

  const applyDiscountWithFreeService = (number) => {
    return Number(number) - Number(number)
  }

  function roundTo5(num) {
    return Math.round(num / 5) * 5
  }

  const totalFreeService = service
    .filter((it) => it.free === 'yes')
    .reduce((acc, rec) => acc + rec.price * rec.quantity, 0)
  const totalService = service
    .filter((it) => it.free !== 'yes')
    .reduce((acc, rec) => acc + rec.price * rec.quantity, 0)
  const totalMaterial = materials.reduce((acc, rec) => acc + rec.price * rec.quantity, 0)
  const totalSumm = totalService + totalFreeService + totalMaterial
  const totalSumWithoutMaterials = totalService + totalFreeService
  // const totalWithDiscount = roundTo5(applyDiscount(totalService)) + totalMaterial

  const totalWithDiscount =
    applyDiscountWithFreeService(totalFreeService) +
    roundTo5(applyDiscount(totalService)) +
    totalMaterial

  useEffect(() => {
    if (state.payment === 'termandcash') {
      if (termCash.terminal !== 0) {
        setTermCash((prevState) => ({
          ...prevState,
          cash:
            Number(state.discount || totalFreeService ? totalWithDiscount : totalSumm) -
            (termCash.terminal ? Number(termCash.terminal) : totalWithDiscount)
        }))
      }
      if (termCash.terminal === 0) {
        setTermCash((prevState) => ({
          ...prevState,
          cash: totalWithDiscount
        }))
      }
    }
    return () => {}
  }, [state.payment, termCash.terminal])

  return (
    <div>
      <div className="flex flex-row -mx-3">
        <div className="px-3 mb-6 md:mb-0 w-1/4">
          <label
            className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
            htmlFor="grid-first-name"
          >
            Гос номер
          </label>
          <div className="flex flex-col relative">
            <div className="bg-grey-lighter border-2 border-black py-1 px-2 rounded-lg w-auto">
              {state.regnumber}
            </div>
          </div>
        </div>
        <div className="px-3 mb-6 md:mb-0 w-1/4">
          <label
            className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
            htmlFor="grid-first-name"
          >
            Авто
          </label>
          <div className="flex flex-col relative">
            <div className="py-1 px-2 w-auto">
              {state.mark} {state.model}
            </div>
          </div>
        </div>
        <div className="px-3 mb-6 md:mb-0 w-1/4">
          <label
            className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
            htmlFor="grid-first-name"
          >
            Диаметр, категория
          </label>
          <div className="flex flex-col relative">
            <div className="py-1 px-2 w-auto">
              R{state.diametr}, {kuzovCheck()}
            </div>
          </div>
        </div>
        <div className="px-3 mb-6 md:mb-0 w-1/4">
          <label
            className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
            htmlFor="grid-first-name"
          >
            Номер талона
          </label>
          <div className="flex flex-col relative">
            <div className="py-1 px-2 w-auto">№ {state.talon ? state.talon : ''}</div>
          </div>
        </div>
      </div>
      <div className="flex flex-row -mx-3 mt-5">
        <div className="px-3 mb-6 md:mb-0 w-full">
          <label
            className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
            htmlFor="grid-first-name"
          >
            Услуги
          </label>
          <div className="w-full">
            <div className="w-full">
              <table className="border-collapse w-full">
                <thead>
                  <tr>
                    <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                      Название
                    </th>
                    <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                      Цена
                    </th>
                    <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                      Количество
                    </th>
                    <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 table-cell">
                      Сумма
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {service.map((it) => (
                    <tr
                      key={it.id}
                      className="bg-white lg:hover:bg-gray-100 table-row flex-row flex-no-wrap mb-5 lg:mb-0"
                    >
                      <td className="text-left w-auto p-2 text-gray-800 border border-b table-cell static">
                        {it.name}
                      </td>
                      <td className="w-auto p-2 text-gray-800 text-center border border-b table-cell static">
                        {it.price}
                      </td>
                      <td className="w-auto p-2 text-gray-800 text-center border border-b table-cell static">
                        {it.quantity}
                      </td>
                      <td className="w-auto p-2 text-gray-800 text-center border border-b table-cell static">
                        {it.quantity * it.price}
                      </td>
                    </tr>
                  ))}
                  {materials.map((it) => (
                    <tr
                      key={it.id}
                      className="bg-gray-200 lg:hover:bg-gray-300 table-row flex-row flex-no-wrap mb-5 lg:mb-0"
                    >
                      <td className="text-left w-auto p-2 text-gray-800 border border-b table-cell static">
                        {it.name}
                      </td>
                      <td className="w-auto p-2 text-gray-800 text-center border border-b table-cell static">
                        {it.price}
                      </td>
                      <td className="w-auto p-2 text-gray-800 text-center border border-b table-cell static">
                        {it.quantity}
                      </td>
                      <td className="w-auto p-2 text-gray-800 text-center border border-b table-cell static">
                        {it.quantity * it.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row mt-3">
        {materials.length !== 0 ? (
          <p className="mr-3">Услуги: {totalSumWithoutMaterials} руб.</p>
        ) : null}
        {materials.length !== 0 ? <p className="mr-3">Материалы: {totalMaterial} руб.</p> : null}
        <p className="mr-3">Общая сумма: {totalSumm} руб.</p>
      </div>
      {state.discount || totalFreeService ? (
        <div className="flex flex-row mt-3">
          <p>Сумма со скидкой: {totalWithDiscount} руб.</p>
        </div>
      ) : null}
      {dateEnd ? (
        <div className="flex flex-row mt-3">
          <div className="w-1/2 pr-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-xs font-bold mb-2"
              htmlFor="discount"
            >
              Выберите скидку
            </label>
            <div className="flex-shrink w-full inline-block relative">
              <select
                className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-2 px-4 pr-8 rounded"
                name="discount"
                id="discount"
                value={state.discount}
                autoComplete="off"
                required
                onChange={onChange}
              >
                <option value="">Без скидки</option>
                {discountList.map((it) => (
                  <option value={it} label={`${it}%`} key={it} />
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
          <div className="w-1/2 pl-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-xs font-bold mb-2"
              htmlFor="discount"
            >
              Оплачено
            </label>
            <div className="flex-shrink w-full inline-block relative">
              <select
                className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-2 px-4 pr-8 rounded"
                name="payment"
                id="payment"
                value={state.payment}
                autoComplete="off"
                required
                onChange={onChange}
              >
                <option value="">Выберите статус оплаты</option>
                <option value="yes">Оплачено</option>
                <option value="card">Безнал</option>
                <option value="terminal">Терминал</option>
                <option value="termandcash">Терминал + наличные</option>
                <option value="no">Не оплачено</option>
                <option value="cancel">Отмена</option>
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
      ) : null}
      {state.payment === 'termandcash' ? (
        <div className="flex flex-row">
          <div className="mr-2 w-1/4">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs text-left font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Терминал
            </label>
            <input
              className="appearance-none w-full block bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
              type="number"
              name="terminal"
              value={termCash.terminal ? termCash.terminal : 0}
              autoComplete="off"
              onChange={onChangeTermCash}
            />
          </div>
          <div className="mr-2 w-1/4">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs text-left font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Наличные
            </label>
            <input
              className="appearance-none w-full block bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
              type="number"
              name="cash"
              value={termCash.cash}
              autoComplete="off"
            />
          </div>
        </div>
      ) : null}
      <div className="flex flex-row mt-3">
        <button
          className={cx('mb-3 flex flex-row rounded bg-gray-200 w-full text-lg', {
            'bg-green-200 hover:bg-green-300': tyres?.sale === 'yes',
            'bg-gray-100 hover:bg-gray-300': tyres?.sale !== 'yes'
          })}
          type="button"
          name="sale"
          onClick={checkboxTyresChange}
        >
          <label htmlFor="sale" className="w-full h-full p-2 text-left inline-block">
            <input
              className="mr-4"
              value={tyres?.sale}
              checked={tyres?.sale === 'yes'}
              name="sale"
              id="sale"
              type="checkbox"
            />
            {tyres?.sale !== 'yes' ? 'Шины куплены не у нас' : 'Шины куплены у нас'}
          </label>
        </button>
        {/* <label htmlFor="sale" className="w-full h-full p-2 text-left inline-block">
          <input
            className="mr-4"
            value={tyres.sale}
            name="sale"
            id="sale"
            onChange={checkboxTyresChange}
            type="checkbox"
          />
          Шины куплены у нас
        </label> */}
      </div>
      {tyres?.sale === 'yes' ? (
        <div className="flex flex-row">
          <div className="mr-2 w-1/4">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs text-left font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Ширина
            </label>
            <input
              className="appearance-none w-full block bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
              type="number"
              name="sizeone"
              list="sizeone_list"
              value={tyres.sizeone}
              autoComplete="off"
              onChange={onChangeTyres}
            />
            <datalist id="sizeone_list">
              {sizeOneList.map((it, indexItem) => (
                <option key={indexItem} value={it} />
              ))}
            </datalist>
          </div>
          <div className="mr-2 w-1/4">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs text-left font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Высота
            </label>
            <input
              className="appearance-none w-full block bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
              type="number"
              name="sizetwo"
              list="sizetwo_list"
              value={tyres.sizetwo}
              autoComplete="off"
              onChange={onChangeTyres}
            />
            <datalist id="sizetwo_list">
              {sizeTwoList.map((it, indexItem) => (
                <option key={indexItem} value={it} />
              ))}
            </datalist>
          </div>
          <div className="mr-2 w-auto">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs text-left font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Диаметр
            </label>
            <div className="appearance-none w-full block bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4">
              {state.diametr}
            </div>
          </div>
          <div className="mr-2 w-1/4">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs text-left font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Бренд
            </label>
            <input
              className="appearance-none w-full block bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
              type="text"
              placeholder="Например: Nokian"
              name="brand"
              list="tyres_list"
              value={tyres.brand}
              autoComplete="off"
              onChange={onChangeTyres}
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
          <div className="mr-2 w-1/4">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs text-left font-bold mb-2"
              htmlFor="grid-first-name"
            >
              Модель
            </label>
            <input
              className="appearance-none w-full block bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
              type="text"
              placeholder="Например: Nordman"
              name="model"
              list="tyres_model_list"
              value={tyres.model}
              autoComplete="off"
              onChange={onChangeTyres}
            />
            <datalist id="tyres_model_list">
              {tyresList
                .filter((item) => item.brand === tyres.brand)
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
      ) : null}
      <div className="flex flex-row -mx-3 mt-5">
        <div className="w-full px-3 mb-6 md:mb-0">
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
      {dateEnd ? (
        <div className="flex flex-row -mx-3 mt-5">
          <button
            type="submit"
            className="py-2 px-3 bg-main-600 text-white text-sm hover:bg-main-700 hover:text-white rounded-full h-22 w-22"
            onClick={() =>
              printOne(totalSumWithoutMaterials, totalMaterial, totalSumm, totalWithDiscount)
            }
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

              <p> Печать предчека</p>
            </div>
          </button>
          <button
            type="submit"
            onClick={() =>
              printTwo(totalSumWithoutMaterials, totalMaterial, totalSumm, totalWithDiscount)
            }
            className="ml-3 py-2 px-3 bg-green-600 text-white text-sm hover:bg-green-700 hover:text-white rounded-full h-22 w-22"
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

              <p> Печать двух предчеков</p>
            </div>
          </button>
        </div>
      ) : null}
      {dateEnd ? (
        <p className="mt-2">
          После того как вы заверишили работу, менять услуги и материалы невозможно
        </p>
      ) : null}
    </div>
  )
}

export default Final
