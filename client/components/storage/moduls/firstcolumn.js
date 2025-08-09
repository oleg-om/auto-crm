import React from 'react'

const FirstColumn = ({ inputField, handleChangeInput, index }) => {
  return (
    <td className="lg:w-auto p-2 text-gray-800 text-center border border-b block table-cell relative static">
      <div className="flex-shrink w-full">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold mb-2"
          htmlFor="grid-first-name"
        >
          Тип
        </label>
        <div className="flex-shrink w-full inline-block relative mb-3">
          <select
            className="appearance-none block w-auto bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 pl-4"
            name="type"
            value={inputField.type}
            disabled
            onChange={(event) => handleChangeInput(index, event)}
          >
            <option value="" hidden disabled className="text-gray-800">
              Выберите тип
            </option>
            <option value="1" className="text-gray-800">
              Шины
            </option>
            <option value="2" className="text-gray-800">
              Диски
            </option>
            <option value="3" className="text-gray-800">
              АКБ
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
      <div className="flex-shrink w-full">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold mb-2"
          htmlFor="grid-first-name"
        >
          Режим
        </label>
        <div className="flex-shrink w-full inline-block relative">
          <select
            className="appearance-none w-full block bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4  pr-8"
            name="mode"
            value={inputField.mode}
            onChange={(event) => handleChangeInput(index, event)}
          >
            <option value="full" className="text-gray-800">
              Полный
            </option>
            <option value="simple" className="text-gray-800">
              Простой
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
    </td>
  )
}

export default FirstColumn
