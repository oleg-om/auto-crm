import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import TaskRow from '../components/tasks/row'
import { updateStatus } from '../redux/reducers/tasks'

const AutopartsOrderList = () => {
  const dispatch = useDispatch()
  const list = useSelector((s) => s.tasks.list)
  const updateStatusLocal = (id, status) => {
    dispatch(updateStatus(id, status))
  }

  return (
    <div className="flex font-medium flex-col w-full">
      {' '}
      {list.map((it) => (
        <TaskRow key={it.id} {...it} updateStatus={updateStatusLocal} />
      ))}{' '}
      <Link to="/autoparts/order/create">Новый заказ</Link>
    </div>
  )
}

export default AutopartsOrderList
