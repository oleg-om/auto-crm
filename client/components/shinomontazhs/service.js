import React from 'react'
import cx from 'classnames'

const Service = ({ employeeList, state, checkboxRoleChange, servicePlusChange }) => {
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
          <table>
            {employeeList ? (
              employeeList.map((item) => (
                <tr
                  key={item.id}
                  className={cx('mb-3 flex flex-row rounded bg-gray-200 w-full text-lg', {
                    'bg-green-200 hover:bg-green-300': state.service.find((it) =>
                      it.serviceName.includes(item.id)
                    ),
                    'bg-gray-100 hover:bg-gray-300': !state.service.find((it) =>
                      it.serviceName.includes(item.id)
                    )
                  })}
                >
                  <td className="w-full">
                    <button
                      className="w-full"
                      key={item.id}
                      type="button"
                      name={item.id}
                      id={item.R16}
                      onClick={checkboxRoleChange}
                    >
                      <label htmlFor={item.id} className="w-full h-full p-2 text-left inline-block">
                        <input
                          className="mr-4"
                          checked={state.service.index}
                          key={item.id}
                          name={item.id}
                          id={item.id}
                          placeholder={item.R16}
                          defaultChecked={state.role.find((it) => it === item)}
                          type="checkbox"
                        />
                        {item.name}
                      </label>
                    </button>
                  </td>
                  <td>
                    <button
                      className="w-full mr-3"
                      key={item.id}
                      type="button"
                      name={item.id}
                      onClick={checkboxRoleChange}
                    >
                      <label htmlFor={item.id} className="w-full h-full p-2 text-left inline-block">
                        {item.R16}
                      </label>
                    </button>
                  </td>
                  <td className="flex flex-row">
                    <button
                      type="button"
                      className="py-1 px-4 bg-red-500 text-white font-bold hover:bg-red-700 hover:text-white rounded-lg m-1"
                    >
                      -
                    </button>
                    <input
                      className="py-1 px-4 bg-white font-bold rounded-lg m-1 border-gray-300 border max-w-md"
                      value={
                        state.service.find((it) => it.serviceName.includes(item.id))
                          ? state.service.find((it) => it.serviceName.includes(item.id)).quantity
                          : ''
                      }
                      type="text"
                    />
                    <button
                      type="button"
                      name={item.id}
                      onClick={servicePlusChange}
                      className="py-1 px-4 bg-blue-500 text-white font-bold hover:bg-blue-700 hover:text-white rounded-lg m-1"
                    >
                      +
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <p>Сотрудники не найдены</p>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}

export default Service
