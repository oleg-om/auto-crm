import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
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

const ShinomontazhpriceNew = () => {
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
  const [type, setType] = useState('single')

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <div className="flex flex-row mt-4">
          <button
            className={cx('my-1 py-1 mr-2 px-3 text-white hover:text-white rounded-lg', {
              'bg-green-500 text-base hover:bg-green-700': type === 'single',
              'bg-gray-500 text-base hover:bg-gray-700': type !== 'single'
            })}
            onClick={() => setType('single')}
            type="submit"
          >
            Добавить услугу
          </button>
          <button
            className={cx('my-1 py-1 mr-2 px-3 text-white hover:text-white rounded-lg', {
              ' bg-green-500 text-base hover:bg-green-700': type === 'import',
              'bg-gray-500 text-base hover:bg-gray-700': type !== 'import'
            })}
            onClick={() => setType('import')}
            type="submit"
          >
            Загрузить из Excel
          </button>
        </div>
        {type === 'single' ? (
          <div>
            <h1 className="text-3xl py-4 border-b mb-6">Добавить материал</h1>
            <ShinomontazhpriceCreate create={create} />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl py-4 border-b mb-6">Загрузить материалы из Excel</h1>
            <ShinomontazhpriceImport
              create={importData}
              delete={clearCollection}
              getShinomontazhprice={getShinomontazhprice}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ShinomontazhpriceNew
