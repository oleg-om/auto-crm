import React from 'react'
import { useDispatch } from 'react-redux'
import RazvalCreate from '../../components/razval/razval.create'
import { createRazval } from '../../redux/reducers/razvals'
import { createOil } from '../../redux/reducers/oils'
import Navbar from '../../components/Navbar'

const RazvalNew = () => {
  const dispatch = useDispatch()
  const createRazvalOrder = (name) => {
    dispatch(createRazval(name))
  }
  const createOilOrder = (name) => {
    dispatch(createOil(name))
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Добавить запись</h1>

        <RazvalCreate createRazvalOrder={createRazvalOrder} createOilOrder={createOilOrder} />
      </div>
    </div>
  )
}

export default RazvalNew
