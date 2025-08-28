import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import MaterialCreate from '../../components/materials/material.create'
import MaterialImport from '../../components/materials/material.import'
import {
  createMaterial,
  importMaterial,
  deleteMaterialDb,
  getMaterials
} from '../../redux/reducers/materials'
import Navbar from '../../components/Navbar'
import MaterialricesDonwnload from './Materials.donwload'

const MaterialNew = () => {
  const dispatch = useDispatch()
  const materialsFull = useSelector((s) => s.materials.list)
  const create = (name) => {
    dispatch(createMaterial(name))
  }
  const importData = (name) => {
    dispatch(importMaterial(name))
  }
  const clearCollection = () => {
    dispatch(deleteMaterialDb())
  }
  const getMaterial = () => {
    dispatch(getMaterials())
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
            Добавить один материал
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
          <MaterialricesDonwnload />
        </div>
        {type === 'single' ? (
          <div>
            <h1 className="text-3xl py-4 border-b mb-6">Добавить материал</h1>
            <MaterialCreate create={create} materialsFull={materialsFull} />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl py-4 border-b mb-6">Загрузить материалы из Excel</h1>
            <MaterialImport
              create={importData}
              delete={clearCollection}
              getMaterial={getMaterial}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default MaterialNew
