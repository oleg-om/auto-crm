import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import cx from 'classnames'
import WashpriceCreate from '../../components/washprices/washprice.create'
import WashpriceImport from '../../components/washprices/washprice.import'
import {
  createWashprice,
  importWashprice,
  deleteWashpriceDb,
  getWashprices
} from '../../redux/reducers/wash.prices'
import Navbar from '../../components/Navbar'
import OnLoad from '../Categorys/Onload'
import OnLoadWash from '../Wash/Onload'

const WashpriceNew = () => {
  OnLoad()
  OnLoadWash()
  const { type } = useParams()
  const dispatch = useDispatch()
  const WashCategoryList = useSelector((s) => s.categorys.list)

  const create = (name) => {
    dispatch(createWashprice(name))
  }
  const importData = (name) => {
    dispatch(importWashprice(name))
  }
  const clearCollection = () => {
    dispatch(deleteWashpriceDb())
  }
  const getWashprice = () => {
    dispatch(getWashprices())
  }
  const [typeOfLoad, setType] = useState('single')

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
            <WashpriceCreate
              create={create}
              type={type}
              WashCategoryList={
                WashCategoryList ? WashCategoryList.filter((cat) => cat.type === 'wash') : []
              }
            />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl py-4 border-b mb-6">Загрузить материалы из Excel</h1>
            <WashpriceImport
              create={importData}
              delete={clearCollection}
              getWashprice={getWashprice}
              type={type}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default WashpriceNew
