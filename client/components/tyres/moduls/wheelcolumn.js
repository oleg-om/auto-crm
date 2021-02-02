import React from 'react'
import sizeThreeList from '../../../lists/tyres/sizethree'
import wheelDiaList from '../../../lists/tyres/wheeldia'
import wheelEtList from '../../../lists/tyres/wheelet'
import wheelPcdList from '../../../lists/tyres/wheelpcd'
import wheelWidthList from '../../../lists/tyres/wheelwidth'
import wheelBrandList from '../../../lists/tyres/wheelbrand'

const WheelColumn = ({ inputField, handleChangeInput, index }) => {
  return (
    <td className="lg:w-auto p-2 text-gray-800 text-center border border-b block table-cell relative static">
      {inputField.mode === 'simple' ? (
        <div className="w-full">
          <input
            className="appearance-none w-full block bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
            type="text"
            placeholder="Например: Оригинальные диски R17 на форд фокус 3"
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
                  placeholder="Например: Кик"
                  name="brand"
                  list="wheelbrand_list"
                  value={inputField.brand}
                  autoComplete="off"
                  onChange={(event) => handleChangeInput(index, event)}
                />
                <datalist id="wheelbrand_list">
                  {wheelBrandList.map((it, indexItem) => (
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
                  placeholder="Например: КС670"
                  name="model"
                  value={inputField.model}
                  autoComplete="off"
                  onChange={(event) => handleChangeInput(index, event)}
                />
              </div>
            </div>
            <div className="flex flex-row mt-2">
              <div className="mr-2 w-1/4">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs text-left font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Диаметр
                </label>
                <input
                  className="w-full appearance-none block bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                  type="text"
                  name="diametr"
                  list="sizethree_list"
                  value={inputField.diametr}
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
                  className="block uppercase tracking-wide text-grey-darker text-xs text-left font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  PCD
                </label>
                <input
                  className="w-full appearance-none block bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                  type="text"
                  name="pcd"
                  list="wheelpcd_list"
                  value={inputField.pcd}
                  autoComplete="off"
                  onChange={(event) => handleChangeInput(index, event)}
                />
                <datalist id="wheelpcd_list">
                  {wheelPcdList.map((it, indexItem) => (
                    <option key={indexItem} value={it} />
                  ))}
                </datalist>
              </div>
              <div className="mr-2 w-1/4">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs text-left font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Вылет (ET)
                </label>
                <input
                  className="w-full appearance-none block bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                  type="number"
                  name="et"
                  list="wheelet_list"
                  value={inputField.et}
                  autoComplete="off"
                  onChange={(event) => handleChangeInput(index, event)}
                />
                <datalist id="wheelet_list">
                  {wheelEtList.map((it, indexItem) => (
                    <option key={indexItem} value={it} />
                  ))}
                </datalist>
              </div>
              <div className="mr-2 w-1/4">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs text-left font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Ступица (D)
                </label>
                <input
                  className="w-full appearance-none block bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                  type="text"
                  name="dia"
                  list="wheeldia_list"
                  value={inputField.dia}
                  autoComplete="off"
                  onChange={(event) => handleChangeInput(index, event)}
                />
                <datalist id="wheeldia_list">
                  {wheelDiaList.map((it, indexItem) => (
                    <option key={indexItem} value={it} />
                  ))}
                </datalist>
              </div>
            </div>
            <div className="flex flex-row mt-2">
              <div className="mr-2 w-1/3">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs text-left font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Ширина
                </label>
                <div className="inline-block relative w-full">
                  <input
                    className="appearance-none w-full block bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                    name="wheelwidth"
                    type="text"
                    list="wheelwidth_list"
                    value={inputField.wheelwidth}
                    onChange={(event) => handleChangeInput(index, event)}
                  />
                  <datalist id="wheelwidth_list">
                    {wheelWidthList.map((it, indexItem) => (
                      <option key={indexItem} value={it} />
                    ))}
                  </datalist>
                </div>
              </div>
              <div className="mr-2 w-1/3">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs text-left font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Тип диска
                </label>
                <div className="inline-block relative w-full">
                  <select
                    className="appearance-none w-full block bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                    name="typewheel"
                    list="autoparts_list"
                    value={inputField.typewheel}
                    onChange={(event) => handleChangeInput(index, event)}
                  >
                    <option value="" hidden className="text-gray-800">
                      Тип
                    </option>
                    <option value="lit" className="text-gray-800">
                      Литой
                    </option>
                    <option value="sht" className="text-gray-800">
                      Штампованный
                    </option>
                    <option value="kov" className="text-gray-800">
                      Кованный
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
              <div className="mr-2 w-1/3">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs text-left font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Цвет
                </label>
                <div className="inline-block relative w-full">
                  <input
                    className="appearance-none w-full block bg-grey-lighter text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                    name="color"
                    type="text"
                    value={inputField.color}
                    onChange={(event) => handleChangeInput(index, event)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </td>
  )
}

export default WheelColumn
