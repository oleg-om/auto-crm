import React from 'react'
import cx from 'classnames'


const Employee = ({ employeeList, auth, state, checkboxRoleChange }) => {
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
          {employeeList
            .filter(
              (it) => it.role.includes('Работник шиномонтажа') && it.address.includes(auth.place)
            )
            .map((item) => (
              <button
                className={cx('mb-3 flex flex-row rounded bg-gray-200 w-full text-xl', {
                  'bg-green-400 hover:bg-green-500 text-white': state.role.includes(item.id),
                  'bg-gray-100 hover:bg-gray-300': !state.role.includes(item.id)
                })}
                key={item.id}
                type="button"
                name={item.id}
                onClick={checkboxRoleChange}
              >
                {console.log(state.role.includes(item.id))}
                <label htmlFor={item.id} className="w-full h-full p-2 text-left inline-block">
                  <input
                    className="mr-4"
                    checked={state.role.index}
                    key={item.id}
                    name={item.id}
                    id={item.id}
                    defaultChecked={state.role.find((it) => it === item)}
                    type="checkbox"
                  />
                  {item.name} {item.surname}
                </label>
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Employee
