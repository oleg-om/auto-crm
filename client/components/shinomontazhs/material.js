import React, { useEffect, useState } from 'react'
import cx from 'classnames'

const Material = ({
  materialprices,
  materials,
  checkboxMaterialChange,
  materialPlusChange,
  materialMinusChange,
  materialPriceChange
}) => {
  const options = Array.from(
    new Set(materialprices.reduce((acc, rec) => [...acc, rec.category], []))
  )
  const [state, setState] = useState('')
  const [actualMaterial, setActualMaterial] = useState([])
  const onChange = (e) => {
    const { value } = e.target
    setState(value)
  }
  useEffect(() => {
    if (state === '' && options !== undefined && options.length > 1) {
      setState(options.find((it) => it))
    }
    return () => {}
  }, [state, options])
  useEffect(() => {
    if (state) {
      setActualMaterial(materialprices.filter((it) => it.category === state))
    }
    return () => {}
  }, [state, materialprices])
  return (
    <div className="flex flex-col -mx-3">
      <div className="px-3 mb-6 md:mb-0 w-full">
        <label
          className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
          htmlFor="grid-first-name"
        >
          Выберите материалы
        </label>
        <div className="flex-shrink w-1/2 inline-block relative">
          <select
            className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-2 px-4 pr-8 rounded"
            value={state}
            required
            onChange={onChange}
          >
            <option hidden value="">
              Выберите категорию
            </option>
            {options
              .sort(function (a, b) {
                if (a > b) {
                  return 1
                }
                if (a < b) {
                  return -1
                }
                return 0
              })
              .map((it) => (
                <option key={it} value={it}>
                  {it}
                </option>
              ))}
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
        <div className="flex flex-col w-full relative mt-3">
          <table>
            {actualMaterial ? (
              actualMaterial
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
                      'bg-green-200 hover:bg-green-300': materials.find((it) =>
                        it.serviceName.includes(item.id)
                      ),
                      'bg-gray-100 hover:bg-gray-300':
                        !materials.find((it) => it.serviceName.includes(item.id)) &&
                        item.category !== 'other',
                      'bg-blue-100 hover:bg-blue-300':
                        !materials.find((it) => it.serviceName.includes(item.id)) &&
                        item.category === 'other'
                    })}
                  >
                    <td className="w-full">
                      <button
                        className="w-full h-full"
                        key={item.id}
                        type="button"
                        name={item.id}
                        id={item.price}
                        onClick={checkboxMaterialChange}
                      >
                        <label
                          htmlFor={item.id}
                          somename={item.name}
                          className="w-full h-full p-2 text-left inline-block"
                        >
                          <input
                            className="mr-4"
                            checked={materials.find((it) => it.serviceName.includes(item.id))}
                            key={item.id}
                            name={item.id}
                            id={item.id}
                            placeholder={item.price}
                            somename={item.name}
                            type="checkbox"
                          />
                          {item.name}
                        </label>
                      </button>
                    </td>
                    {item.price ? (
                      <td>
                        <button
                          className="w-full h-full mr-3"
                          key={item.id}
                          type="button"
                          name={item.id}
                          onClick={checkboxMaterialChange}
                        >
                          <label
                            htmlFor={item.id}
                            somename={item.name}
                            className="w-full h-full p-2 text-left inline-block"
                          >
                            {item.price}
                          </label>
                        </button>
                      </td>
                    ) : (
                      <td>
                        <input
                          className="py-1 px-4 bg-white rounded-lg my-1 mr-3 border-green-500 border w-32"
                          placeholder="Цена"
                          type="number"
                          key={item.id}
                          name={item.id}
                          id={item.id}
                          somename={item.name}
                          onChange={materialPriceChange}
                        />
                      </td>
                    )}
                    <td className="flex flex-row">
                      {materials.find((it) => it.serviceName.includes(item.id)) ? (
                        <button
                          type="button"
                          name={item.id}
                          onClick={
                            materials.find((it) => it.serviceName.includes(item.id)).quantity === 1
                              ? checkboxMaterialChange
                              : materialMinusChange
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
                          materials.find((it) => it.serviceName.includes(item.id))
                            ? materials.find((it) => it.serviceName.includes(item.id)).quantity
                            : ''
                        }
                        type="text"
                      />
                      {materials.find((it) => it.serviceName.includes(item.id)) ? (
                        <button
                          type="button"
                          name={item.id}
                          placeholder={item.price}
                          onClick={materialPlusChange}
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

      <div className="px-3 my-3 md:mb-0 w-full">
        <label
          className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
          htmlFor="grid-first-name"
        >
          Выбранные материалы
        </label>
        <div className="w-full p-3">
          {materials.map((it) => (
            <p key={it.id}>
              {it.name}, {it.price} руб, {it.quantity} шт.
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Material
