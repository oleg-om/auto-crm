import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import ShinomontazhpriceUpdate from '../../components/shinomontazhprices/shinomontazhprice.edit'
import Navbar from '../../components/Navbar'
import {
  updateShinomontazhprice,
  deleteShinomontazhprice
} from '../../redux/reducers/shinomotazh.prices'
import ShinomontazhTypeList from '../../lists/shinomontazhtype-list'
import ShinomontazhCategoryList from '../../lists/shinomontazhprice-list'

const ShinomontazhpriceEdit = () => {
  const { id } = useParams()
  const { type } = useParams()
  const dispatch = useDispatch()
  const list = useSelector((s) => s.shinomontazhprices.list).filter((it) => it.id === id)
  const updateShinomontazhpriceLocal = (idOfItem, name) => {
    dispatch(updateShinomontazhprice(idOfItem, name))
  }
  const deleteShinomontazhpriceLocal = (idOfItem) => {
    dispatch(deleteShinomontazhprice(idOfItem))
  }
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Редатировать услугу</h1>
        {list.map((it) => (
          <ShinomontazhpriceUpdate
            key={id}
            {...it}
            ShinomontazhTypeList={ShinomontazhTypeList}
            ShinomontazhCategoryList={ShinomontazhCategoryList}
            deleteShinomontazhprice={deleteShinomontazhpriceLocal}
            updateShinomontazhprice={updateShinomontazhpriceLocal}
            type={type}
          />
        ))}
      </div>
    </div>
  )
}

export default ShinomontazhpriceEdit
