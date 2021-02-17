import React from 'react'
import cx from 'classnames'

const Employee = ({ employeeList, auth, state, checkboxEmployeeChange }) => {
  return (
    <div className="md:flex md:flex-row -mx-3">
      <div className="px-3 mb-6 md:mb-0 w-full">
        <label
          className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
          htmlFor="grid-first-name"
        >
          Исполнители
        </label>
        <div className="flex flex-col w-full relative">
          {employeeList ? (
            employeeList
              .filter(
                (it) => it.role.includes('Работник шиномонтажа') && it.address.includes(auth.place)
              )
              .map((item) => (
                <button
                  className={cx('mb-3 flex flex-row rounded bg-gray-200 w-full text-lg', {
                    'bg-green-200 hover:bg-green-300': state.employee.includes(item.id),
                    'bg-gray-100 hover:bg-gray-300': !state.employee.includes(item.id)
                  })}
                  key={item.id}
                  type="button"
                  name={item.id}
                  onClick={checkboxEmployeeChange}
                >
                  <label htmlFor={item.id} className="w-full h-full p-2 text-left inline-block">
                    <input
                      className="mr-4"
                      key={item.id}
                      name={item.id}
                      id={item.id}
                      checked={state.employee.find((it) => it === item.id)}
                      type="checkbox"
                    />
                    {item.name} {item.surname}
                  </label>
                </button>
              ))
          ) : (
            <p>Сотрудники не найдены</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Employee
