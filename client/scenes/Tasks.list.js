import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import TaskRow from '../components/tasks/row'
import RowCreate from '../components/tasks/row.create'
import { createTask, updateStatus } from '../redux/reducers/tasks'

const TaskList = () => {
  const dispatch = useDispatch()
  const list = useSelector((s) => s.tasks.list)
  const create = (name) => {
    dispatch(createTask(name))
  }
  const updateStatusLocal = (id, status) => {
    dispatch(updateStatus(id, status))
  }

  return (
    <div className="flex font-medium flex-col w-full">
      {' '}
      {list.map((it) => (
        <TaskRow key={it.id} {...it} updateStatus={updateStatusLocal} />
      ))}{' '}
      <RowCreate create={create} />
    </div>
  )
}

export default TaskList
