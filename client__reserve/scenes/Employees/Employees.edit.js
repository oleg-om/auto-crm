import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import EmployeeUpdate from '../../components/employees/employee.edit'
import Navbar from '../../components/Navbar'
import { updateEmployee, deleteEmployee } from '../../redux/reducers/employees'

const EmployeeEdit = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const list = useSelector((s) => s.employees.list).filter((it) => it.id === id)
  const updateEmployeeLocal = (idOfItem, name) => {
    dispatch(updateEmployee(idOfItem, name))
  }
  const deleteEmployeeLocal = (idOfItem) => {
    dispatch(deleteEmployee(idOfItem))
  }
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Редатировать сотрудника</h1>
        {list.map((it) => (
          <EmployeeUpdate
            key={id}
            {...it}
            deleteEmployee={deleteEmployeeLocal}
            updateEmployee={updateEmployeeLocal}
          />
        ))}
      </div>
    </div>
  )
}

export default EmployeeEdit
