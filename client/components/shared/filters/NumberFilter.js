import cx from 'classnames'
import React from 'react'
import { defaultSearchState } from '../filter'

const NumberFilter = ({ search, setSearch, showSearch, onEnterPress, activeFilter }) => {
  const onChangeNumber = (e) => {
    const { name, value } = e.target
    setSearch(() => ({
      ...defaultSearchState,
      [name]: value
    }))
  }
  return (
    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
      <label
        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
        htmlFor="grid-first-name"
      >
        Номер заказа
      </label>
      <div className="flex-shrink w-full inline-block relative">
        <input
          className={cx(
            'block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded',
            {
              'border-red-300 focus:border-red-500':
                activeFilter?.number?.length >= 1 && showSearch === true
            }
          )}
          value={search.number}
          name="number"
          type="number"
          onChange={onChangeNumber}
          onKeyDown={onEnterPress}
        />
        <div className="pointer-events-none absolute top-0 mt-2  right-0 flex items-center px-2 text-gray-600">
          <svg
            version="1.1"
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg "
            xlink="http://www.w3.org/1999/xlink "
            x="0px "
            y="0px "
            viewBox="0 0 52.966 52.966 "
            space="preserve "
          >
            <path
              d="M51.704,51.273L36.845,35.82c3.79-3.801,6.138-9.041,6.138-14.82c0-11.58-9.42-21-21-21s-21,9.42-21,21s9.42,21,21,21 c5.083,0,9.748-1.817,13.384-4.832l14.895,15.491c0.196,0.205,0.458,0.307,0.721,0.307c0.25,0,0.499-0.093,0.693-0.279 C52.074,52.304,52.086,51.671,51.704,51.273z
                            M21.983,40c-10.477,0-19-8.523-19-19s8.523-19,19-19s19,8.523,19,19 S32.459,40,21.983,40z "
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default NumberFilter
