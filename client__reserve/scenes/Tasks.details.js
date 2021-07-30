import React from 'react'
import { useParams } from 'react-router-dom'

const TaskList = () => {
  const { id } = useParams()

  return <div> Task Details {id}</div>
}

export default TaskList
