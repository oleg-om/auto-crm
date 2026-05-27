import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import DiskpaintingpriceUpdate from '../../components/diskpaintingprices/diskpaintingprice.edit'
import Navbar from '../../components/Navbar'
import { updateDiskpaintingprice, deleteDiskpaintingprice } from '../../redux/reducers/diskpainting.prices'
import OnLoadCategorys from '../Categorys/Onload'

const DiskpaintingpriceEdit = () => {
  OnLoadCategorys()
  const { id } = useParams()
  const dispatch = useDispatch()
  const list = useSelector((s) => s.diskpaintingprices.list).filter((it) => it.id === id)
  const allCategorys = useSelector((s) => s.categorys.list)
  const categoryList = allCategorys ? allCategorys.filter((cat) => cat.type === 'diskpainting') : []

  const updateLocal = (idOfItem, data) => {
    dispatch(updateDiskpaintingprice(idOfItem, data))
  }
  const deleteLocal = (idOfItem) => {
    dispatch(deleteDiskpaintingprice(idOfItem))
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Покраска дисков - редактировать услугу</h1>
        {list.map((it) => (
          <DiskpaintingpriceUpdate
            key={id}
            {...it}
            categoryList={categoryList}
            deleteDiskpaintingprice={deleteLocal}
            updateDiskpaintingprice={updateLocal}
          />
        ))}
      </div>
    </div>
  )
}

export default DiskpaintingpriceEdit
