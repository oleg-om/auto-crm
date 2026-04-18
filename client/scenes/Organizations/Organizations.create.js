import React from 'react'
import { useDispatch } from 'react-redux'
import OrganizationCreate from '../../components/organizations/organization.create'
import { createOrganization } from '../../redux/reducers/organizations'
import Navbar from '../../components/Navbar'

const OrganizationNew = () => {
  const dispatch = useDispatch()
  const create = (data) => {
    dispatch(createOrganization(data))
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Добавить организацию</h1>

        <OrganizationCreate create={create} />
      </div>
    </div>
  )
}

export default OrganizationNew
