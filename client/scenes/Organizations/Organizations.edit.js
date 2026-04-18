import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import OrganizationUpdate from '../../components/organizations/organization.edit'
import Navbar from '../../components/Navbar'
import { updateOrganization, deleteOrganization } from '../../redux/reducers/organizations'

const OrganizationEdit = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const list = useSelector((s) => s.organizations.list).filter((it) => it.id === id)
  const updateOrganizationLocal = (idOfItem, data) => {
    dispatch(updateOrganization(idOfItem, data))
  }
  const deleteOrganizationLocal = (idOfItem) => {
    dispatch(deleteOrganization(idOfItem))
  }
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Редактировать организацию</h1>
        {list.map((it) => (
          <OrganizationUpdate
            key={id}
            {...it}
            deleteOrganization={deleteOrganizationLocal}
            updateOrganization={updateOrganizationLocal}
          />
        ))}
      </div>
    </div>
  )
}

export default OrganizationEdit
