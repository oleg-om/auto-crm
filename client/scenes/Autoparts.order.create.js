import React from 'react'
import { useDispatch } from 'react-redux'
import AutopartsMainCreate from '../components/tasks/autoparts.main.create'
import { createTask } from '../redux/reducers/tasks'

const AutopartsOrderCreate = () => {
  const dispatch = useDispatch()
  const create = (name) => {
    dispatch(createTask(name))
  }

  return (
    <div className="flex font-medium flex-col w-full">
      <AutopartsMainCreate create={create} />
    </div>
  )
}

export default AutopartsOrderCreate
