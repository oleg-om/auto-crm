import React from 'react'

const RequestPassword = ({ state, onChange }) => {
  return (
    <div className="md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col">
      <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        htmlFor="grid-first-name"
      >
        Запрашивать пароль на странице Отчет
      </label>
      <div className="flex-shrink w-full inline-block relative mb-3">
        <select
          className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-3 px-4 mb-3"
          value={state.requestPasswordForReport}
          name="requestPasswordForReport"
          id="requestPasswordForReport"
          onChange={onChange}
          defaultValue={false}
        >
          <option value={false}>Нет</option>
          <option value>Да</option>
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
  )
}

export default RequestPassword
