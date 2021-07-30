import React from 'react'
import { useDispatch } from 'react-redux'
import PlaceCreate from '../../components/places/place.create'
import { createPlace } from '../../redux/reducers/places'
import Navbar from '../../components/Navbar'

const PlaceNew = () => {
  const dispatch = useDispatch()
  const create = (name) => {
    dispatch(createPlace(name))
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Добавить адрес</h1>

        <PlaceCreate create={create} />
      </div>
    </div>
  )
}

export default PlaceNew
