import cx from 'classnames'
import React from 'react'
import storageStatuses from '../../../lists/storages-statuses'
import taskStatuses from '../../../lists/task-statuses'

const StatusFilter = ({ search, setSearch, showSearch, path, activeFilter }) => {
  const onChangeStatus = (e) => {
    const { name, value } = e.target
    setSearch((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const getStatuses = () => {
    if (path.includes('storages')) {
      return storageStatuses
    }
    return taskStatuses
  }

  return (
    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
      <label
        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
        htmlFor="grid-first-name"
      >
        Статус
      </label>
      <div className="flex-shrink w-full inline-block relative">
        <select
          className={cx(
            'block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded',
            {
              'border-red-300 focus:border-red-500': activeFilter?.status && showSearch === true
            }
          )}
          value={search.status}
          name="status"
          onChange={onChangeStatus}
        >
          <option value="" disabled hidden>
            Все
          </option>
          {getStatuses().map((it) => (
            <option key={it}>{it}</option>
          ))}
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

export default StatusFilter
