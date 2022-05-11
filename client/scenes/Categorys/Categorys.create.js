import React from 'react'
import { useDispatch } from 'react-redux'
import CategoryCreate from '../../components/categorys/category.create'
import { createCategory } from '../../redux/reducers/categorys'
import Navbar from '../../components/Navbar'

const CategoryNew = () => {
  const dispatch = useDispatch()
  const create = (name) => {
    dispatch(createCategory(name))
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Добавить категорию</h1>

        <CategoryCreate create={create} />
      </div>
    </div>
  )
}

export default CategoryNew
