import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import cx from 'classnames'
import WindowpriceCreate from '../../components/windowprices/windowprice.create'
import WindowpriceImport from '../../components/washprices/washprice.import'
import {
  createWindowprice,
  importWindowprice,
  deleteWindowpriceDb,
  getWindowprices
} from '../../redux/reducers/window.prices'
import Navbar from '../../components/Navbar'
import OnLoad from '../Categorys/Onload'
import OnLoadWindow from '../Wash/Onload'
import {
  createCondprice,
  deleteCondprice,
  getCondprices,
  importCondprice
} from '../../redux/reducers/cond.prices'

const clearFunc = (location) => {
  if (location.pathname.includes('windowprice')) {
    return deleteWindowpriceDb()
  }
  return deleteCondprice()
}

const importFunc = (name, location) => {
  if (location.pathname.includes('windowprice')) {
    return importWindowprice(name)
  }
  return importCondprice(name)
}

const getPrices = (location) => {
  if (location.pathname.includes('windowprice')) {
    return getWindowprices()
  }
  return getCondprices()
}

const createFunc = (name, location) => {
  if (location.pathname.includes('windowprice')) {
    return createWindowprice(name)
  }
  return createCondprice(name)
}

export const getCategoryType = (location) => {
  if (location.pathname.includes('windowprice')) {
    return 'window'
  }
  return 'cond'
}

const WindowpriceNew = () => {
  OnLoad()
  OnLoadWindow()
  const { type } = useParams()

  const location = useLocation()

  const dispatch = useDispatch()
  const WindowCategoryList = useSelector((s) => s.categorys.list)

  const create = (name) => {
    dispatch(createFunc(name, location))
  }
  const importData = (name) => {
    dispatch(importFunc(name, location))
  }
  const clearCollection = () => {
    dispatch(clearFunc(location))
  }
  const getWindowprice = () => {
    dispatch(getPrices(location))
  }
  const [typeOfLoad, setType] = useState('single')

  const WindowTypeList = [
    { value: 'legk', name: 'Легковые' }
    // { value: 'gruz', name: 'Грузовые' }
  ]

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <div className="flex flex-row mt-4">
          <button
            className={cx('my-1 py-1 mr-2 px-3 text-white hover:text-white rounded-lg', {
              'bg-green-500 text-base hover:bg-green-700': typeOfLoad === 'single',
              'bg-gray-500 text-base hover:bg-gray-700': typeOfLoad !== 'single'
            })}
            onClick={() => setType('single')}
            type="submit"
          >
            Добавить услугу
          </button>
          <button
            className={cx('my-1 py-1 mr-2 px-3 text-white hover:text-white rounded-lg', {
              ' bg-green-500 text-base hover:bg-green-700': typeOfLoad === 'import',
              'bg-gray-500 text-base hover:bg-gray-700': typeOfLoad !== 'import'
            })}
            onClick={() => setType('import')}
            type="submit"
          >
            Загрузить из Excel
          </button>
        </div>
        {typeOfLoad === 'single' ? (
          <div>
            <h1 className="text-3xl py-4 border-b mb-6">Добавить услугу</h1>
            <WindowpriceCreate
              create={create}
              type={type}
              WindowTypeList={WindowTypeList}
              WindowCategoryList={
                WindowCategoryList
                  ? WindowCategoryList.filter((cat) => cat?.type === getCategoryType(location))
                  : []
              }
            />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl py-4 border-b mb-6">Загрузить материалы из Excel</h1>
            <WindowpriceImport
              create={importData}
              delete={clearCollection}
              getWashprice={getWindowprice}
              type={type}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default WindowpriceNew
