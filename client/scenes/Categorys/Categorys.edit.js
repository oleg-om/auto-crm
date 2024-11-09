import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import CategoryUpdate from '../../components/categorys/category.edit'
import Navbar from '../../components/Navbar'
import { updateCategory, deleteCategory } from '../../redux/reducers/categorys'

const CategoryEdit = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const list = useSelector((s) => s.categorys.list).filter((it) => it.id === id)
  const updateCategoryLocal = (idOfItem, name) => {
    dispatch(updateCategory(idOfItem, name))
  }
  const deleteCategoryLocal = (idOfItem) => {
    dispatch(deleteCategory(idOfItem))
  }
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Редактировать категорию</h1>
        {list.map((it) => (
          <CategoryUpdate
            key={id}
            {...it}
            deleteCategory={deleteCategoryLocal}
            updateCategory={updateCategoryLocal}
          />
        ))}
      </div>
    </div>
  )
}

export default CategoryEdit
