import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { handleEnterpress } from '../../utils/utils'
import NumberFilter from './filters/NumberFilter'
import PlaceFilter from './filters/PlaceFilter'
import RegNumberFilter from './filters/RegNumberFilter'
import PhoneFilter from './filters/PhoneFilter'
import TyresSizeFilter from './filters/TyresSizeFilter'
import ProcessFilter from './filters/ProcessFilter'
import StatusFilter from './filters/StatusFilter'
import useSaveFilter from '../../hooks/saveFilterParams'

export const defaultSearchState = {
  phone: '',
  number: '',
  status: '',
  vinnumber: '',
  place: '',
  regnumber: '',
  process: '',
  sizeone: '',
  sizetwo: '',
  sizethree: ''
}

function useFilter(num, loadItems) {
  const [showSearch, setShowSearch] = useState(false)

  const dispatch = useDispatch()

  const [search, setSearch] = useState(defaultSearchState)

  const filterWithPage = { ...search, page: num }
  // eslint-disable-next-line no-unused-vars
  const { queryParamsToApi, currentQueryParams, queryStringToObject } = useSaveFilter(
    filterWithPage
  )

  // set filter from query params
  useEffect(() => {
    if (currentQueryParams) {
      setSearch((prevState) => ({
        ...prevState,
        ...queryStringToObject(currentQueryParams)
      }))

      setShowSearch(true)
    }
  }, [currentQueryParams])

  // useEffect(() => {
  //   if (showSearch) {
  //     const phoneArray = search.phone.split(' ')
  //     const phoneToRest = phoneArray[phoneArray.length - 1].replace(/_/g, '')
  //
  //     const searchObjectWithoutPhone = { ...search, phone: null }
  //
  //     if (
  //       (search.phone !== '' && phoneToRest.length > 6) ||
  //       Object.values(searchObjectWithoutPhone).filter((key) => key)?.length > 0
  //     ) {
  //       dispatch(loadItems(queryParamsToApi))
  //     }
  //   }
  // }, [dispatch, num, showSearch, search])

  const applyFilter = () => {
    if (showSearch) {
      const phoneArray = search.phone.split(' ')
      const phoneToRest = phoneArray[phoneArray.length - 1].replace(/_/g, '')

      const searchObjectWithoutPhone = { ...search, phone: null }

      if (
        (search.phone !== '' && phoneToRest.length > 6) ||
        Object.values(searchObjectWithoutPhone).filter((key) => key)?.length > 0
      ) {
        dispatch(loadItems(queryParamsToApi))
      }
    }
  }

  return { search, setSearch, showSearch, setShowSearch, applyFilter }
}

export const ServiceFilter = ({
  filters,
  search,
  setSearch,
  showSearch,
  setShowSearch,
  path,
  applyFilter
}) => {
  const history = useHistory()

  const { navigateWithQueryParams } = useSaveFilter(search)
  const getPath = () => {
    return `/${path}/list/1`
  }

  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const onReset = () => {
    setShowSearch(false)
    setSearch(() => defaultSearchState)
    history.push(getPath())
  }

  const onFilter = () => {
    if (Object.values(search).filter((key) => key)?.length <= 0) {
      notify('Заполните хотябы одно поле')
    } else {
      applyFilter()
      navigateWithQueryParams(getPath())
    }
  }

  const onEnterPress = (e) => {
    handleEnterpress(e, onFilter)
  }

  const isPhone = filters.includes('phone')
  const isNumber = filters.includes('number')
  const isStatus = filters.includes('status')
  const isPlace = filters.includes('place')
  const isRegNumber = filters.includes('regnumber')
  const isProcess = filters.includes('process')
  const isTyresSize = filters.includes('tyresSize')

  return (
    <>
      <div className="mx-auto px-4">
        <div className="py-3 px-4 my-3 rounded-lg shadow bg-white">
          <div className="-mx-3 md:flex md:justify-between">
            {isNumber && (
              <NumberFilter
                search={search}
                setSearch={setSearch}
                showSearch={showSearch}
                onEnterPress={onEnterPress}
              />
            )}
            {isPhone && (
              <PhoneFilter
                search={search}
                setSearch={setSearch}
                showSearch={showSearch}
                onEnterPress={onEnterPress}
              />
            )}
            {isProcess && (
              <ProcessFilter
                search={search}
                setSearch={setSearch}
                showSearch={showSearch}
                path={path}
              />
            )}
            {isTyresSize && (
              <TyresSizeFilter
                search={search}
                setSearch={setSearch}
                showSearch={showSearch}
                onEnterPress={onEnterPress}
              />
            )}
            {isRegNumber && (
              <RegNumberFilter
                search={search}
                setSearch={setSearch}
                showSearch={showSearch}
                onEnterPress={onEnterPress}
              />
            )}
            {isStatus && (
              <StatusFilter
                search={search}
                setSearch={setSearch}
                showSearch={showSearch}
                path={path}
              />
            )}
            {isPlace && (
              <PlaceFilter search={search} setSearch={setSearch} showSearch={showSearch} />
            )}

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
