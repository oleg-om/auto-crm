import cx from 'classnames'
import React from 'react'
import { useSelector } from 'react-redux'

const ProcessFilter = ({ search, setSearch, showSearch, path, activeFilter }) => {
  const employeeList = useSelector((s) => s.employees.list)
  const onChangePlace = (e) => {
    const { name, value } = e.target
    setSearch((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const getRole = () => {
    if (path && path.includes('autoparts')) {
      return 'Обработка заказов (запчасти)'
    }
    return 'Обработка заказов (инструмент)'
  }

  return (
    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
      <label
        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
        htmlFor="grid-first-name"
      >
        Обработал
      </label>
      <div className="flex-shrink w-full inline-block relative">
        <select
          className={cx(
            'block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded',
            {
              'border-red-300 focus:border-red-500': activeFilter?.process && showSearch === true
            }
          )}
          value={search.process}
          name="process"
          onChange={onChangePlace}
        >
          <option value="" disabled hidden>
            Все
          </option>
          {employeeList
            .filter((it) => it.role.includes(getRole()))
            .map((it) => {
              return (
                <option key={it.id} value={it.id}>
                  {it.name} {it.surname}
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
  )
}

export default ProcessFilter
