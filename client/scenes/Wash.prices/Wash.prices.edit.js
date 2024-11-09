import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import WashpriceUpdate from '../../components/washprices/washprice.edit'
import Navbar from '../../components/Navbar'
import { updateWashprice, deleteWashprice } from '../../redux/reducers/wash.prices'
import OnLoad from '../Categorys/Onload'
import OnLoadWash from '../Wash/Onload'

const WashpriceEdit = () => {
  OnLoad()
  OnLoadWash()
  const { id } = useParams()
  const { type } = useParams()
  const dispatch = useDispatch()
  const list = useSelector((s) => s.washprices.list).filter((it) => it.id === id)
  const WashCategoryList = useSelector((s) => s.categorys.list)

  const updateWashpriceLocal = (idOfItem, name) => {
    dispatch(updateWashprice(idOfItem, name))
  }
  const deleteWashpriceLocal = (idOfItem) => {
    dispatch(deleteWashprice(idOfItem))
  }
  const WashTypeList = [
    { value: 'legk', name: 'Легковые' },
    { value: 'gruz', name: 'Грузовые' }
  ]

  // const WashCategoryList = [
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
        <h1 className="text-3xl py-4 border-b mb-6">Редактировать услугу</h1>
        {list.map((it) => (
          <WashpriceUpdate
            key={id}
            {...it}
            WashTypeList={WashTypeList}
            WashCategoryList={
              WashCategoryList ? WashCategoryList.filter((cat) => cat.type === 'wash') : []
            }
            deleteWashprice={deleteWashpriceLocal}
            updateWashprice={updateWashpriceLocal}
            type={type}
          />
        ))}
      </div>
    </div>
  )
}

export default WashpriceEdit
