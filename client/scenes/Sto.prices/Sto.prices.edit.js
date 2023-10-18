import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import StopriceUpdate from '../../components/stoprices/stoprice.edit'
import Navbar from '../../components/Navbar'
import { updateStoprice, deleteStoprice } from '../../redux/reducers/sto.prices'
import OnLoad from '../Categorys/Onload'

const StopriceEdit = () => {
  OnLoad()
  const { id } = useParams()
  const { type } = useParams()
  const dispatch = useDispatch()
  const list = useSelector((s) => s.stoprices.list).filter((it) => it.id === id)
  const StoCategoryList = useSelector((s) => s.categorys.list)

  const updateStopriceLocal = (idOfItem, name) => {
    dispatch(updateStoprice(idOfItem, name))
  }
  const deleteStopriceLocal = (idOfItem) => {
    dispatch(deleteStoprice(idOfItem))
  }
  const StoTypeList = [
    { value: 'rus', name: 'Отечественные' },
    { value: 'foreign', name: 'Иномарки' },
    { value: 'card', name: 'Безнал' }
  ]

  // const StoCategoryList = [
  //   { name: 'Рулевое управление' },
  //   { name: 'Тормозная система' },
  //   { name: 'Передняя подвеска' },
  //   { name: 'Задняя подвеска' },

  //   { name: 'Двигатель' },
  //   { name: 'Трансмиссия, КПП, мосты' },
  //   { name: 'Выхлопная система' },
  //   { name: 'Другое' },

  //   { name: 'Охлаждающая система' },
  //   { name: 'Передняя подвеска, рулевой механизм' },
  //   { name: 'Топливная система' },
  //   { name: 'Электрика' },
  //   { name: 'Система охлаждения' },
  //   { name: 'Развал-схождение' }
  // ]

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Редатировать услугу</h1>
        {list.map((it) => (
          <StopriceUpdate
            key={id}
            {...it}
            StoTypeList={StoTypeList}
            StoCategoryList={
              StoCategoryList ? StoCategoryList.filter((cat) => cat.type === 'sto') : []
            }
            deleteStoprice={deleteStopriceLocal}
            updateStoprice={updateStopriceLocal}
            type={type}
          />
        ))}
      </div>
    </div>
  )
}

export default StopriceEdit
