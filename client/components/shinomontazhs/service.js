import React from 'react'
import cx from 'classnames'

const Service = ({
  actualService,
  service,
  checkboxServiceChange,
  servicePlusChange,
  serviceMinusChange,
  servicePriceChange,
  serviceType
}) => {
  console.log(service)
  return (
    <div className="md:flex md:flex-row -mx-3">
      <div className="px-3 mb-6 md:mb-0 w-full">
        <label
          className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
          htmlFor="grid-first-name"
        >
          {serviceType}
        </label>
        <div className="flex flex-col w-full relative">
          <table>
            {actualService ? (
              actualService
                .sort(function (a, b) {
                  if (a.number > b.number) {
                    return 1
                  }
                  if (a.number < b.number) {
                    return -1
                  }
                  return 0
                })
                .map((item) => (
                  <tr
                    key={item.id}
                    className={cx('mb-3 flex flex-row rounded bg-gray-200 w-full text-lg', {
                      'bg-green-200 hover:bg-green-300': service.find((it) =>
                        it.serviceName.includes(item.id)
                      ),
                      'bg-gray-100 hover:bg-gray-300':
                        !service.find((it) => it.serviceName.includes(item.id)) &&
                        item.category !== 'other',
                      'bg-blue-100 hover:bg-blue-300':
                        !service.find((it) => it.serviceName.includes(item.id)) &&
                        item.category === 'other'
                    })}
                  >
                    <td className="w-full">
                      <button
                        className="w-full"
                        key={item.id}
                        type="button"
                        name={item.id}
                        id={item.actualprice}
                        onClick={checkboxServiceChange}
                      >
                        <label
                          htmlFor={item.id}
                          somename={item.name}
                          className="w-full h-full p-2 text-left inline-block"
                        >
                          <input
                            className="mr-4"
                            checked={service.find((it) => it.serviceName.includes(item.id))}
                            key={item.id}
                            name={item.id}
                            id={item.id}
                            placeholder={item.actualprice}
                            somename={item.name}
                            type="checkbox"
                          />
                          {item.name}
                        </label>
                      </button>
                    </td>
                    {item.actualprice ? (
                      <td>
                        <button
                          className="w-full h-full mr-3"
                          key={item.id}
                          type="button"
                          name={item.id}
                          onClick={checkboxServiceChange}
                        >
                          <label
                            htmlFor={item.id}
                            somename={item.name}
                            className="w-full h-full p-2 text-left inline-block"
                          >
                            {item.actualprice}
                          </label>
                        </button>
                      </td>
                    ) : (
                      <td>
                        {item.category !== 'free' ? (
                          <input
                            className="py-1 px-4 bg-white rounded-lg my-1 mr-3 border-green-500 border w-32"
                            placeholder="Цена"
                            type="number"
                            key={item.id}
                            name={item.id}
                            id={item.id}
                            somename={item.name}
                            onChange={servicePriceChange}
                          />
                        ) : (
                          <label
                            htmlFor={item.id}
                            somename={item.name}
                            className="w-full h-full p-2 text-left inline-block"
                          >
                            <div className="py-1 px-4 bg-yellow-400 rounded-lg my-1 mr-3 border-yellow-400 border w-32">
                              Акция
                            </div>
                          </label>
                        )}
                      </td>
                    )}
                    <td className="flex flex-row">
                      {service.find((it) => it.serviceName.includes(item.id)) ? (
                        <button
                          type="button"
                          name={item.id}
                          onClick={
                            service.find((it) => it.serviceName.includes(item.id)).quantity === 1
                              ? checkboxServiceChange
                              : serviceMinusChange
                          }
                          className="py-1 px-4 bg-red-500 text-white font-bold hover:bg-red-700 hover:text-white rounded-lg m-1"
                        >
                          -
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="py-1 px-4 bg-red-500 text-white font-bold hover:bg-red-700 hover:text-white rounded-lg m-1"
                        >
                          -
                        </button>
                      )}
                      <input
                        className="py-1 px-4 bg-white font-bold rounded-lg m-1 border-gray-300 border w-20 lg:max-w-sm"
                        value={
                          service.find((it) => it.serviceName.includes(item.id))
                            ? service.find((it) => it.serviceName.includes(item.id)).quantity
                            : ''
                        }
                        type="text"
                      />
                      {service.find((it) => it.serviceName.includes(item.id)) ? (
                        <button
                          type="button"
                          name={item.id}
                          placeholder={item.actualprice}
                          onClick={servicePlusChange}
                          className="py-1 px-4 bg-blue-500 text-white font-bold hover:bg-blue-700 hover:text-white rounded-lg m-1"
                        >
                          +
                        </button>
                      ) : (
                        // <label htmlFor={item.id} >
                        <label
                          htmlFor={item.id}
                          className="flex items-center py-1 px-4 bg-blue-500 text-white font-bold hover:bg-blue-700 hover:text-white rounded-lg m-1"
                        >
                          +
                        </label>
                        // {/* </label> */}
                      )}
                    </td>
                  </tr>
                ))
            ) : (
              <p>Услуги не найдены</p>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}

export default Service
