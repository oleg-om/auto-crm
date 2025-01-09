import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import cx from 'classnames'
import ShinomontazhpriceCreate from '../../components/shinomontazhprices/shinomontazhprice.create'
import ShinomontazhpriceImport from '../../components/shinomontazhprices/shinomontazhprice.import'
import {
  createShinomontazhprice,
  importShinomontazhprice,
  deleteShinomontazhpriceDb,
  getShinomontazhprices
} from '../../redux/reducers/shinomotazh.prices'
import Navbar from '../../components/Navbar'
import ShinomontazhPricesDonwload from './Shinomontazh.prices.donwload'

const ShinomontazhpriceNew = () => {
  const { type } = useParams()
  const dispatch = useDispatch()
  const create = (name) => {
    dispatch(createShinomontazhprice(name))
  }
  const importData = (name) => {
    dispatch(importShinomontazhprice(name))
  }
  const clearCollection = () => {
    dispatch(deleteShinomontazhpriceDb())
  }
  const getShinomontazhprice = () => {
    dispatch(getShinomontazhprices())
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
          <ShinomontazhPricesDonwload />
        </div>
        {typeOfLoad === 'single' ? (
          <div>
            <h1 className="text-3xl py-4 border-b mb-6">Добавить услугу</h1>
            <ShinomontazhpriceCreate create={create} type={type} />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl py-4 border-b mb-6">Загрузить материалы из Excel</h1>
            <ShinomontazhpriceImport
              create={importData}
              delete={clearCollection}
              getShinomontazhprice={getShinomontazhprice}
              type={type}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ShinomontazhpriceNew
