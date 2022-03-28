import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import cx from 'classnames'
import StopriceCreate from '../../components/stoprices/stoprice.create'
import StopriceImport from '../../components/stoprices/stoprice.import'
import {
  createStoprice,
  importStoprice,
  deleteStopriceDb,
  getStoprices
} from '../../redux/reducers/sto.prices'
import Navbar from '../../components/Navbar'

const StopriceNew = () => {
  const { type } = useParams()
  const dispatch = useDispatch()
  const create = (name) => {
    dispatch(createStoprice(name))
  }
  const importData = (name) => {
    dispatch(importStoprice(name))
  }
  const clearCollection = () => {
    dispatch(deleteStopriceDb())
  }
  const getStoprice = () => {
    dispatch(getStoprices())
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
            <StopriceCreate create={create} type={type} />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl py-4 border-b mb-6">Загрузить материалы из Excel</h1>
            <StopriceImport
              create={importData}
              delete={clearCollection}
              getStoprice={getStoprice}
              type={type}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default StopriceNew
