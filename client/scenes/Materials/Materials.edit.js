import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import MaterialUpdate from '../../components/materials/material.edit'
import Navbar from '../../components/Navbar'
import { updateMaterial, deleteMaterial } from '../../redux/reducers/materials'

const MaterialEdit = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const list = useSelector((s) => s.materials.list).filter((it) => it.id === id)
  const materialsFull = useSelector((s) => s.materials.list)
  const updateMaterialLocal = (idOfItem, name) => {
    dispatch(updateMaterial(idOfItem, name))
  }
  const deleteMaterialLocal = (idOfItem) => {
    dispatch(deleteMaterial(idOfItem))
  }
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Редактировать материал</h1>
        {list.map((it) => (
          <MaterialUpdate
            key={id}
            {...it}
            deleteMaterial={deleteMaterialLocal}
            updateMaterial={updateMaterialLocal}
            materialsFull={materialsFull}
          />
        ))}
      </div>
    </div>
  )
}

export default MaterialEdit
