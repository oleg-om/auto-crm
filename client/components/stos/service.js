/* eslint-disable no-unneeded-ternary */
import React from 'react'
import cx from 'classnames'
import { useServiceCategories } from '../../hooks/handleServiceCategories'

const Service = ({
  actualService,
  service,
  checkboxServiceChange,
  servicePlusChange,
  serviceMinusChange,
  servicePriceChange,
  dateEnd,
  onServiceQuantityChange
}) => {
  const { category, setCategory, categoryList } = useServiceCategories(actualService, service)

  return (
    <div className="flex flex-col -mx-3">
      <div className="px-3 mb-6 md:mb-0 w-full">
        {/* <label
          className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
          htmlFor="grid-first-name"
        >
          {serviceType}
        </label> */}
        <div className="flex flex-col w-full relative">
          <div className="md:flex mb-5 mt-5">
            <div className="bg-blue-400 rounded shadow p-3 w-full flex flex-row-reverse">
              <div className="w-full px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
                  htmlFor="phone"
                >
                  Категория
                </label>
                <div className="flex-shrink w-full inline-block relative">
                  <select
                    className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-2 px-4 pr-8 rounded"
                    name="category"
                    id="category"
                    value={category}
                    autoComplete="off"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="" hidden>
                      Выберите категорию
                    </option>
                    <option value="choosen" label="Выбранное">
                      Выбранное
                    </option>
                    {categoryList
                      ? categoryList.map((it) => <option value={it} label={it} key={it} />)
                      : null}
                  </select>
                  <div className="pointer-events-none hidden absolute top-0 mt-3 right-0 lg:flex items-center px-2 text-gray-600">
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
          </div>
          <table>
            {actualService && !dateEnd
              ? actualService
                  .filter(
                    (it) =>
                      it.category === category ||
                      (category === 'choosen' &&
                        service.find((ser) => ser.serviceName.includes(it.id)))
                  )
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
                      className={cx('mb-3 flex flex-row rounded w-full text-lg', {
                        'bg-green-200 hover:bg-green-300': service.find((it) =>
                          it.serviceName.includes(item.id)
                        ),
                        'bg-gray-200 hover:bg-gray-300':
                          !service.find((it) => it.serviceName.includes(item.id)) &&
                          item.category !== 'other',
                        'bg-red-200 hover:bg-red-300':
                          !service.find((it) => it.serviceName.includes(item.id)) &&
                          item.category !== 'other' &&
                          (item.name.toLowerCase().includes('груженый') ||
                            item.name.toLowerCase().includes('гружёный') ||
                            item.name.toLowerCase().includes('груженный') ||
                            item.name.toLowerCase().includes('гружённый')),
                        'bg-blue-100 hover:bg-blue-300':
                          !service.find((it) => it.serviceName.includes(item.id)) &&
                          item.category === 'other'
                      })}
                    >
                      <td className="w-full">
                        <button
                          className="w-full h-full"
                          key={item.id}
                          type="button"
                          name={item.id}
                          id={item.actualprice}
                          onClick={checkboxServiceChange}
                          placeholder={item.actualprice}
                        >
                          <label
                            htmlFor={item.id}
                            somename={item.name}
                            somefree={item.free}
                            className="w-full h-full p-2 text-left inline-block"
                            placeholder={item.actualprice}
                          >
                            <input
                              className="mr-4"
                              checked={service.find((it) => it.serviceName.includes(item.id))}
                              key={item.id}
                              name={item.id}
                              id={item.id}
                              somename={item.name}
                              somefree={item.free}
                              type="checkbox"
                              placeholder={item.actualprice}
                            />
                            {item.name}
                          </label>
                        </button>
                      </td>
                      {item.actualprice && (item.free === 'no' || !item.free) ? (
                        <td>
                          <input
                            className="py-1 px-4 bg-white rounded-lg my-1 mr-3 border-green-500 border w-32"
                            placeholder="Цена"
                            type="number"
                            key={item.id}
                            name={item.id}
                            id={item.id}
                            somename={item.name}
                            somefree={item.free}
                            onChange={servicePriceChange}
                            defaultValue={item.actualprice}
                          />
                        </td>
                      ) : (
                        <td>
                          {item.free === 'no' || !item.free ? (
                            <input
                              className="py-1 px-4 bg-white rounded-lg my-1 mr-3 border-green-500 border w-32"
                              placeholder="Цена"
                              type="number"
                              key={item.id}
                              name={item.id}
                              id={item.id}
                              somename={item.name}
                              somefree={item.free}
                              defaultValue={item.actualprice}
                              onChange={servicePriceChange}
                            />
                          ) : (
                            <label
                              htmlFor={item.id}
                              somename={item.name}
                              somefree={item.free}
                              className="w-full h-full p-2 text-left inline-block"
                            >
                              <div className="py-1 px-4 bg-yellow-400 rounded-lg my-1 mr-3 border-yellow-400 border lg:w-32">
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
                            placeholder={item.actualprice}
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
                            placeholder={item.actualprice}
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
                          type="number"
                          somename={item.name}
                          somefree={item.free}
                          name={item.id}
                          someprice={item.actualprice}
                          onChange={onServiceQuantityChange}
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
              : null}
            {!actualService && !dateEnd ? <p>Услуги не найдены</p> : null}

            {dateEnd
              ? service.map((item) => (
                  <tr
                    key={item.id}
                    className="mb-3 flex flex-row rounded w-full text-lg bg-green-200 hover:bg-green-300"
                  >
                    <td className="w-full">
                      <button className="w-full h-full" key={item.id} type="button">
                        <label
                          htmlFor={item.id}
                          className="w-full h-full p-2 text-left inline-block"
                        >
                          <input className="mr-4" checked key={item.id} type="checkbox" />
                          {item.name}
                        </label>
                      </button>
                    </td>
                    {item.price && (item.free === 'no' || !item.free) ? (
                      <td>
                        <button className="w-full h-full mr-3" key={item.id} type="button">
                          <label
                            htmlFor={item.id}
                            className="w-full h-full p-2 text-left inline-block"
                          >
                            {item.price}
                          </label>
                        </button>
                      </td>
                    ) : (
                      <td>
                        {item.free === 'no' || !item.free ? (
                          <input
                            className="py-1 px-4 bg-white rounded-lg my-1 mr-3 border-green-500 border w-32"
                            placeholder="Цена"
                            type="number"
                            key={item.id}
                          />
                        ) : (
                          <label
                            htmlFor={item.id}
                            className="w-full h-full p-2 text-left inline-block"
                          >
                            <div className="py-1 px-4 bg-yellow-400 rounded-lg my-1 mr-3 border-yellow-400 border lg:w-32">
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
                          disabled
                          className="py-1 px-4 bg-red-500 text-white font-bold hover:bg-red-700 hover:text-white rounded-lg m-1"
                        >
                          -
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="py-1 px-4 bg-red-500 text-white font-bold hover:bg-red-700 hover:text-white rounded-lg m-1"
                        >
                          -
                        </button>
                      )}
                      <input
                        className="py-1 px-4 bg-white font-bold rounded-lg m-1 border-gray-300 border w-20 lg:max-w-sm"
                        disabled
                        value={item.quantity}
                        type="text"
                      />
                      {service.find((it) => it.serviceName.includes(item.id)) ? (
                        <button
                          type="button"
                          name={item.id}
                          disabled
                          className="py-1 px-4 bg-blue-500 text-white font-bold hover:bg-blue-700 hover:text-white rounded-lg m-1"
                        >
                          +
                        </button>
                      ) : (
                        <label
                          htmlFor={item.id}
                          className="flex items-center py-1 px-4 bg-blue-500 text-white font-bold hover:bg-blue-700 hover:text-white rounded-lg m-1"
                        >
                          +
                        </label>
                      )}
                    </td>
                  </tr>
                ))
              : null}
          </table>
        </div>
      </div>
      <div className="px-3 my-3 md:mb-0 w-full">
        <label
          className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
          htmlFor="grid-first-name"
        >
          Выбранные услуги
        </label>
        <div className="w-full p-3">
          {service.map((it) => (
            <p key={it.id}>
              {it.name}, {it.price} руб, {it.quantity} шт.
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Service
