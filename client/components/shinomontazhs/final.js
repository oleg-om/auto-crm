import React from 'react'
import cx from 'classnames'
import tyresList from '../../lists/tyres/tyres'

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
  tyres
}) => {
  const kuzovCheck = () => {
    if (state.kuzov === 'sedan') return 'Седан'
    if (state.kuzov === 'crossover') return 'Кроссовер'
    if (state.kuzov === 'runflat') return 'RUN FLAT'
    if (state.kuzov === 'gruz') return 'Грузовой'
    if (state.kuzov === 'selhoz') return 'Сельхоз'
    return ''
  }
  return (
    <div>
      <div className="flex flex-row -mx-3">
        <div className="px-3 mb-6 md:mb-0 w-1/3">
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
        <div className="px-3 mb-6 md:mb-0 w-1/3">
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
        <div className="px-3 mb-6 md:mb-0 w-1/3">
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
        <button
          className={cx('mb-3 flex flex-row rounded bg-gray-200 w-full text-lg', {
            'bg-green-200 hover:bg-green-300': tyres.sale === 'yes',
            'bg-gray-100 hover:bg-gray-300': tyres.sale !== 'yes'
          })}
          type="button"
          name="sale"
          onClick={checkboxTyresChange}
        >
          <label htmlFor="sale" className="w-full h-full p-2 text-left inline-block">
            <input className="mr-4" value={tyres.sale} name="sale" id="sale" type="checkbox" />
            Шины куплены у нас
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
      {tyres.sale === 'yes' ? (
        <div className="flex flex-row">
          <div className="mr-2 w-1/2">
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
          <div className="mr-2 w-1/2">
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
    </div>
  )
}

export default Final
