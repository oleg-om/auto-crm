import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import RazvalUpdate from '../../components/razval/razval.edit'
import Navbar from '../../components/Navbar'
import { updateRazval, deleteRazval } from '../../redux/reducers/razvals'

const RazvalEdit = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const list = useSelector((s) => s.razvals.list).filter((it) => it.id === id)
  const updateRazvalLocal = (idOfItem, name) => {
    dispatch(updateRazval(idOfItem, name))
  }
  const deleteRazvalLocal = (idOfItem) => {
    dispatch(deleteRazval(idOfItem))
  }
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Редактировать сотрудника</h1>
        {list.map((it) => (
          <RazvalUpdate
            key={id}
            {...it}
            deleteRazval={deleteRazvalLocal}
            updateRazval={updateRazvalLocal}
          />
        ))}
      </div>
    </div>
  )
}

export default RazvalEdit
