import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import WashpriceUpdate from '../../components/windowprices/windowprice.edit'
import Navbar from '../../components/Navbar'
import OnLoad from '../Categorys/Onload'
import OnLoadWash from '../Window/Onload'
import { deleteWindowprice, updateWindowprice } from '../../redux/reducers/window.prices'
import { deleteCondprice, updateCondprice } from '../../redux/reducers/cond.prices'
import { getPriceLocation } from './Window.prices.list'
import { getCategoryType } from './Window.prices.create'

const WindowpriceEdit = () => {
  OnLoad()
  OnLoadWash()
  const { id } = useParams()
  const { type } = useParams()
  const dispatch = useDispatch()

  const location = useLocation()
  const currentLocation = `${getPriceLocation(location)}price`

  const list = useSelector((s) => s[`${currentLocation}s`].list).filter((it) => it.id === id)

  const WashCategoryList = useSelector((s) => s.categorys.list)

  const updateFunc = (idOfItem, name) => {
    if (location.pathname.includes('window')) {
      dispatch(updateWindowprice(idOfItem, name))
    } else {
      dispatch(updateCondprice(idOfItem, name))
    }
  }
  const deleteFunc = (idOfItem) => {
    if (location.pathname.includes('window')) {
      dispatch(deleteWindowprice(idOfItem))
    } else {
      dispatch(deleteCondprice(idOfItem))
    }
  }
  const WashTypeList = [
    { value: 'legk', name: 'Легковые' }
    // { value: 'gruz', name: 'Грузовые' }
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
              WashCategoryList
                ? WashCategoryList.filter((cat) => cat.type === getCategoryType(location))
                : []
            }
            deleteFunc={deleteFunc}
            updateFunc={updateFunc}
            type={type}
          />
        ))}
      </div>
    </div>
  )
}

export default WindowpriceEdit
