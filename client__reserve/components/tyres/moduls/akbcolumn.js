import React from 'react'
import akbBrandList from '../../../lists/tyres/akbbrand'
import akbTokList from '../../../lists/tyres/akbtok'
import akbAhList from '../../../lists/tyres/akbah'

const AkbColumn = ({ inputField, handleChangeInput, index }) => {
  return (
    <td className="lg:w-auto p-2 text-gray-800 text-center border border-b block table-cell relative static">
      {inputField.mode === 'simple' ? (
        <div className="w-full">
          <input
            className="appearance-none w-full block bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
            type="text"
            placeholder="Например: Оригинальный аккумулятор на киа рио 3"
            name="tyreItem"
            value={inputField.tyreItem}
            autoComplete="off"
            onChange={(event) => handleChangeInput(index, event)}
          />
        </div>
      ) : (
        <div className="m-1 p-2 rounded shadow bg-gray-200">
          <div>
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
                  placeholder="Например: Bosch"
                  name="brand"
                  list="akbbrand_list"
                  value={inputField.brand}
                  autoComplete="off"
                  onChange={(event) => handleChangeInput(index, event)}
                />
                <datalist id="akbbrand_list">
                  {akbBrandList.map((it, indexItem) => (
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
                  placeholder="Например: S3"
                  name="model"
                  value={inputField.model}
                  autoComplete="off"
                  onChange={(event) => handleChangeInput(index, event)}
                />
              </div>
            </div>
            <div className="flex flex-row mt-2">
              <div className="mr-2 w-1/3">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs text-left font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Размер
                </label>
                <input
                  className="w-full appearance-none block bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                  type="text"
                  name="size"
                  value={inputField.size}
                  autoComplete="off"
                  onChange={(event) => handleChangeInput(index, event)}
                />
              </div>
              <div className="mr-2 w-1/3">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs text-left font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Пусковой ток
                </label>
                <input
                  className="w-full appearance-none block bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                  type="number"
                  name="tok"
                  list="akbtok_list"
                  value={inputField.tok}
                  autoComplete="off"
                  onChange={(event) => handleChangeInput(index, event)}
                />
                <datalist id="akbtok_list">
                  {akbTokList.map((it, indexItem) => (
                    <option key={indexItem} value={it} />
                  ))}
                </datalist>
              </div>
              <div className="mr-2 w-1/3">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs text-left font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Емкость
                </label>
                <input
                  className="w-full appearance-none block bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                  type="number"
                  name="emkost"
                  list="akbah_list"
                  value={inputField.emkost}
                  autoComplete="off"
                  onChange={(event) => handleChangeInput(index, event)}
                />
                <datalist id="akbah_list">
                  {akbAhList.map((it, indexItem) => (
                    <option key={indexItem} value={it} />
                  ))}
                </datalist>
              </div>
            </div>
            <div className="flex flex-row mt-2">
              <div className="mr-2 w-1/2">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs text-left font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Тип
                </label>
                <div className="inline-block relative w-full">
                  <select
                    className="appearance-none w-full block bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                    name="typeakb"
                    list="autoparts_list"
                    value={inputField.typeakb}
                    onChange={(event) => handleChangeInput(index, event)}
                  >
                    <option value="" hidden className="text-gray-800">
                      Тип
                    </option>
                    <option value="euro" className="text-gray-800">
                      Евро
                    </option>
                    <option value="asia" className="text-gray-800">
                      Азия
                    </option>
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
              <div className="mr-2 w-1/2">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs text-left font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Полярность
                </label>
                <div className="inline-block relative w-full">
                  <select
                    className="appearance-none w-full block bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                    name="polar"
                    list="autoparts_list"
                    value={inputField.polar}
                    onChange={(event) => handleChangeInput(index, event)}
                  >
                    <option value="" hidden className="text-gray-800">
                      Полярность
                    </option>
                    <option value="L+" className="text-gray-800">
                      Прямая (+/-)
                    </option>
                    <option value="R+" className="text-gray-800">
                      Обратная (-/+)
                    </option>
                    <option value="uni" className="text-gray-800">
                      Универсальная
                    </option>
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
          </div>
        </div>
      )}
    </td>
  )
}

export default AkbColumn
