import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import PlaceUpdate from '../../components/places/place.edit'
import Navbar from '../../components/Navbar'
import { updatePlace, deletePlace } from '../../redux/reducers/places'

const PlaceEdit = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const list = useSelector((s) => s.places.list).filter((it) => it.id === id)
  const updatePlaceLocal = (idOfItem, name) => {
    dispatch(updatePlace(idOfItem, name))
  }
  const deletePlaceLocal = (idOfItem) => {
    dispatch(deletePlace(idOfItem))
  }
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Изменить адрес</h1>
        {list.map((it) => (
          <PlaceUpdate
            key={id}
            {...it}
            deletePlace={deletePlaceLocal}
            updatePlace={updatePlaceLocal}
          />
        ))}
      </div>
    </div>
  )
}

export default PlaceEdit
