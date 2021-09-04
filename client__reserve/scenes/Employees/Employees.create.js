import React from 'react'
import { useDispatch } from 'react-redux'
import EmployeeCreate from '../../components/employees/employee.create'
import { createEmployee } from '../../redux/reducers/employees'
import Navbar from '../../components/Navbar'

const EmployeeNew = () => {
  const dispatch = useDispatch()
  const create = (name) => {
    dispatch(createEmployee(name))
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Добавить сотрудника</h1>

        <EmployeeCreate create={create} />
      </div>
    </div>
  )
}

export default EmployeeNew
