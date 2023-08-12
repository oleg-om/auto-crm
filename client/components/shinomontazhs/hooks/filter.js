import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { handleEnterpress } from '../../../utils/utils'

function useFilter(num, loadItems) {
  const [showSearch, setShowSearch] = useState(false)

  const dispatch = useDispatch()
  const [search, setSearch] = useState({
    phone: '',
    number: '',
    status: '',
    vinnumber: '',
    place: '',
    regnumber: ''
  })

  useEffect(() => {
    if (showSearch) {
      const phoneArray = search.phone.split(' ')
      const phoneToRest = phoneArray[phoneArray.length - 1].replace(/_/g, '')
      if (
        (search.phone !== '' && phoneToRest.length > 6) ||
        search.status ||
        search.vin ||
        search.place ||
        search.number ||
        search.regnumber
      ) {
        dispatch(
          loadItems(
            num ? Number(num) : 1,
            search.place ? search.place : '',
            search.number ? search.number : '',
            search.regnumber ? search.regnumber : ''
          )
        )
      }
    }
  }, [dispatch, num, showSearch, search])

  return { search, setSearch, showSearch, setShowSearch }
}

export const ServiceFilter = ({ search, setSearch, showSearch, setShowSearch, path }) => {
  const placesList = useSelector((s) => s.places.list)
  const history = useHistory()

  const getPath = () => {
    return `/${path}/list/1`
  }
  const isBoss = path && path?.includes('boss')
  const onChangeCustomerUppercaseRussian = (e) => {
    const { name, value } = e.target
    setSearch((prevState) => ({
      ...prevState,
      [name]: value
        .toUpperCase()
        .replace(/\s/g, '')
        .replace(/[^а-яё0-9]/i, '')
    }))
  }

  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const onChangeNumber = (e) => {
    const { name, value } = e.target
    setSearch(() => ({
      [name]: value,
      phone: '',
      status: '',
      vinnumber: '',
      place: '',
      regnumber: ''
    }))
  }

  const onChangePlace = (e) => {
    const { name, value } = e.target
    setSearch(() => ({
      [name]: value,
      phone: '',
      number: '',
      status: '',
      vinnumber: '',
      regnumber: ''
    }))
  }

  const onReset = () => {
    setShowSearch(false)
    setSearch(() => ({
      phone: '',
      number: '',
      status: '',
      vinnumber: '',
      place: '',
      regnumber: ''
    }))
    history.push(getPath())
  }
  const onFilter = () => {
    if (
      search.phone === '' &&
      search.number === '' &&
      search.status === '' &&
      search.vinnumber === '' &&
      search.place === '' &&
      search.regnumber === ''
    ) {
      notify('Заполните хотябы одно поле')
    } else {
      setShowSearch(true)
      history.push(getPath())
    }
  }

  const onEterPress = (e) => {
    handleEnterpress(e, onFilter)
  }

  return (
    <>
      <div className="mx-auto px-4">
        <div className="py-3 px-4 my-3 rounded-lg shadow bg-white">
          <div className="-mx-3 md:flex md:justify-between">
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
                        search.number.length >= 1 && showSearch === true
                    }
                  )}
                  value={search.number}
                  name="number"
                  type="number"
                  onChange={onChangeNumber}
                  onKeyDown={onEterPress}
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
            {isBoss ? (
              <>
                <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                    htmlFor="grid-first-name"
                  >
                    Сортировка по точке
                  </label>
                  <div className="flex-shrink w-full inline-block relative">
                    <select
                      className={cx(
                        'block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded',
                        {
                          'border-red-300 focus:border-red-500':
                            search.place.length >= 1 && showSearch === true
                        }
                      )}
                      value={search.place}
                      name="place"
                      onChange={onChangePlace}
                    >
                      <option value="" disabled hidden>
                        Все
                      </option>
                      {placesList.map((it) => {
                        return (
                          <option key={it.id} value={it.id}>
                            {it.name}
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
                <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                    htmlFor="grid-first-name"
                  >
                    Гос номер
                  </label>
                  <div className="flex-shrink w-full inline-block relative">
                    <input
                      className={cx(
                        'block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded',
                        {
                          'border-red-300 focus:border-red-500':
                            search.regnumber && showSearch === true
                        }
                      )}
                      value={search.regnumber}
                      name="regnumber"
                      type="regnumber"
                      onChange={onChangeCustomerUppercaseRussian}
                      onKeyDown={onEterPress}
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
              </>
            ) : null}
            {/* <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Новых заказов
                </label>
                <div className="flex-shrink w-full">
                  <button
                    type="button"
                    className="appearance-none w-full text-left bg-grey-lighter border border-yellow-500 focus:outline-none py-1 px-4 pr-8 rounded"
                  >
                    {revList.filter((it) => it.status === taskStatuses[0]).length}
                  </button>
                </div>
              </div> */}

            <div className="flex content-end  px-3 mb-6 md:mb-0">
              <button
                type="button"
                className="text-sm py-1 px-4 mt-3 lg:mt-6 w-full bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg"
                onClick={onFilter}
              >
                Фильтр
              </button>
              <button
                type="button"
                className="ml-2 text-sm py-1 px-4 mt-3 lg:mt-6 w-full bg-gray-200 text-gray-700 hover:text-gray-600 hover:bg-gray-400 rounded-lg"
                onClick={onReset}
              >
                Сбросить
              </button>
            </div>
          </div>
        </div>
      </div>
      {showSearch ? (
        <div className="mx-2">
          <b className="text-gray-700">Вы применили фильтр</b>
          <button type="button" className="mx-1 hover:text-blue-600" onClick={onReset}>
            ✖
          </button>
        </div>
      ) : null}
    </>
  )
}

export default useFilter
