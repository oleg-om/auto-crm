import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cx from 'classnames'
import DiskpaintingpriceCreate from '../../components/diskpaintingprices/diskpaintingprice.create'
import {
  createDiskpaintingprice,
  deleteDiskpaintingpriceDb,
  getDiskpaintingprices
} from '../../redux/reducers/diskpainting.prices'
import Navbar from '../../components/Navbar'
import OnLoadCategorys from '../Categorys/Onload'

const DiskpaintingpriceNew = () => {
  OnLoadCategorys()
  const dispatch = useDispatch()
  const allCategorys = useSelector((s) => s.categorys.list)
  const categoryList = allCategorys ? allCategorys.filter((cat) => cat.type === 'diskpainting') : []

  const create = (data) => {
    dispatch(createDiskpaintingprice(data))
  }
  const clearCollection = () => {
    dispatch(deleteDiskpaintingpriceDb())
  }
  const reload = () => {
    dispatch(getDiskpaintingprices())
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
            type="button"
          >
            Добавить услугу
          </button>
          <button
            className={cx('my-1 py-1 mr-2 px-3 text-white hover:text-white rounded-lg', {
              'bg-red-500 text-base hover:bg-red-700': typeOfLoad === 'clear',
              'bg-gray-500 text-base hover:bg-gray-700': typeOfLoad !== 'clear'
            })}
            onClick={() => {
              clearCollection()
              reload()
            }}
            type="button"
          >
            Очистить все
          </button>
        </div>
        <div>
          <h1 className="text-3xl py-4 border-b mb-6">Покраска дисков - добавить услугу</h1>
          <DiskpaintingpriceCreate create={create} categoryList={categoryList} />
        </div>
      </div>
    </div>
  )
}

export default DiskpaintingpriceNew
