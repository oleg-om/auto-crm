import React from 'react'
import tyresList from '../../../lists/tyres/tyres'
import sizeOneList from '../../../lists/tyres/sizeone'
import sizeTwoList from '../../../lists/tyres/sizetwo'
import sizeThreeList from '../../../lists/tyres/sizethree'
import indexOneList from '../../../lists/tyres/indexone'
import indexTwoList from '../../../lists/tyres/indextwo'

const TyreColumn = ({ inputField, handleChangeInput, index }) => {
  return (
    <td className="lg:w-auto p-2 text-gray-800 text-center border border-b block table-cell relative static">
      {inputField.mode === 'simple' ? (
        <div className="w-full">
          <input
            className="appearance-none w-full block bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
            type="text"
            placeholder="Например: Зимние шины в размере 205/55 R16"
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
                  value={inputField.brand}
                  autoComplete="off"
                  onChange={(event) => handleChangeInput(index, event)}
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
                  value={inputField.model}
                  autoComplete="off"
                  onChange={(event) => handleChangeInput(index, event)}
                />
                <datalist id="tyres_model_list">
                  {tyresList
                    .filter((item) => item.brand === inputField.brand)
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
            <div className="flex flex-row mt-2">
              <div className="mr-2 w-1/4">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Ширина
                </label>
                <input
                  className="w-full appearance-none block bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                  type="number"
                  name="sizeone"
                  list="sizeone_list"
                  value={inputField.sizeone}
                  autoComplete="off"
                  onChange={(event) => handleChangeInput(index, event)}
                />
                <datalist id="sizeone_list">
                  {sizeOneList.map((it, indexItem) => (
                    <option key={indexItem} value={it} />
                  ))}
                </datalist>
              </div>
              <div className="mr-2 w-1/4">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Высота
                </label>
                <input
                  className="w-full appearance-none block bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                  type="number"
                  name="sizetwo"
                  list="sizetwo_list"
                  value={inputField.sizetwo}
                  autoComplete="off"
                  onChange={(event) => handleChangeInput(index, event)}
                />
                <datalist id="sizetwo_list">
                  {sizeTwoList.map((it, indexItem) => (
                    <option key={indexItem} value={it} />
                  ))}
                </datalist>
              </div>
              <div className="mr-2 w-1/4">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Диаметр
                </label>
                <input
                  className="w-full appearance-none block bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                  type="text"
                  name="sizethree"
                  list="sizethree_list"
                  value={inputField.sizethree}
                  autoComplete="off"
                  onChange={(event) => handleChangeInput(index, event)}
                />
                <datalist id="sizethree_list">
                  {sizeThreeList.map((it, indexItem) => (
                    <option key={indexItem} value={it} />
                  ))}
                </datalist>
              </div>
              <div className="mr-2 w-1/4">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Шипы
                </label>
                <div className="inline-block relative w-full">
                  <select
                    className="appearance-none w-full block bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                    name="stus"
                    list="autoparts_list"
                    value={inputField.stud}
                    onChange={(event) => handleChangeInput(index, event)}
                  >
                    <option value="0" selected className="text-gray-800">
                      Нет
                    </option>
                    <option value="1" className="text-gray-800">
                      Шипованная
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
            <div className="flex flex-row mt-2">
              <div className="mr-2 w-1/4">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Ин. нагрузки
                </label>
                <input
                  className="w-full appearance-none block bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                  type="text"
                  name="indexone"
                  list="indexone_list"
                  value={inputField.indexone}
                  autoComplete="off"
                  onChange={(event) => handleChangeInput(index, event)}
                />
                <datalist id="indexone_list">
                  {indexOneList.map((it, indexItem) => (
                    <option key={indexItem} value={it} />
                  ))}
                </datalist>
              </div>
              <div className="mr-2 w-1/4">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Ин. скорости
                </label>
                <input
                  className="w-full appearance-none block bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                  type="text"
                  name="indextwo"
                  list="indextwo_list"
                  value={inputField.indextwo}
                  autoComplete="off"
                  onChange={(event) => handleChangeInput(index, event)}
                />
                <datalist id="indextwo_list">
                  {indexTwoList.map((it, indexItem) => (
                    <option key={indexItem} value={it} />
                  ))}
                </datalist>
              </div>
              <div className="mr-2 w-1/4">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Сезон
                </label>
                <div className="inline-block relative w-full">
                  <select
                    className="appearance-none w-full block bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                    name="season"
                    list="autoparts_list"
                    value={inputField.season}
                    onChange={(event) => handleChangeInput(index, event)}
                  >
                    <option value="" hidden className="text-gray-800">
                      Сезон
                    </option>
                    <option value="winter" className="text-gray-800">
                      Зима
                    </option>
                    <option value="summer" className="text-gray-800">
                      Лето
                    </option>
                    <option value="all" className="text-gray-800">
                      Всесезонная
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
              <div className="mr-2 w-1/4">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  С дисками
                </label>
                <div className="inline-block relative w-full">
                  <select
                    className="appearance-none w-full block bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                    name="wheels"
                    value={inputField.wheels}
                    onChange={(event) => handleChangeInput(index, event)}
                  >
                    <option value="" hidden className="text-gray-800">
                      Выберите
                    </option>
                    <option value="yes" className="text-gray-800">
                      Да
                    </option>
                    <option value="no" className="text-gray-800">
                      Нет
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
            {inputField.wheels === 'yes' ? (
              <div className="flex flex-row mt-2">
                <div className="mr-2 w-1/4">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold mb-2"
                    htmlFor="grid-first-name"
                  >
                    Тип дисков
                  </label>
                  <div className="inline-block relative w-full">
                    <select
                      className="w-full appearance-none block bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                      type="text"
                      name="wheeltype"
                      value={inputField.wheeltype}
                      autoComplete="off"
                      onChange={(event) => handleChangeInput(index, event)}
                    >
                      <option value="" hidden className="text-gray-800">
                        Тип
                      </option>
                      <option value="legk" className="text-gray-800">
                        Легкосплавные
                      </option>
                      <option value="zh" className="text-gray-800">
                        Железные
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
                <div className="mr-2 w-1/4">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold mb-2"
                    htmlFor="grid-first-name"
                  >
                    Колпачки
                  </label>
                  <div className="inline-block relative w-full">
                    <select
                      className="w-full appearance-none block bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                      type="text"
                      name="kolp"
                      value={inputField.kolp}
                      autoComplete="off"
                      onChange={(event) => handleChangeInput(index, event)}
                    >
                      <option value="" hidden className="text-gray-800">
                        Наличие
                      </option>
                      <option value="yes" className="text-gray-800">
                        Да
                      </option>
                      <option value="no" className="text-gray-800">
                        Нет
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
                <div className="mr-2 w-1/4">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold mb-2"
                    htmlFor="grid-first-name"
                  >
                    Кол-во дисков
                  </label>
                  <input
                    className="appearance-none w-full block bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                    name="wheelsquan"
                    type="number"
                    value={inputField.wheelsquan}
                    onChange={(event) => handleChangeInput(index, event)}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </td>
  )
}

export default TyreColumn
