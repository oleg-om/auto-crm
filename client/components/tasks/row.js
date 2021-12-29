import React from 'react'
import cx from 'classnames'
import taskStatuses from '../../lists/task-statuses'

const TaskRow = (props) => {
  const changeStatus = (e) => {
    props.updateStatus(props.id, e.target.value)
  }

  return (
    <div
      className={cx('py-3 w-full  flex md:flex-row flex-col  justify-between px-5 shadow-xl my-2', {
        'bg-green-500': props.status === taskStatuses[2],
        'bg-yellow-200': props.status === taskStatuses[0],
        'bg-green-200': props.status === taskStatuses[1]
      })}
    >
      <div className="mr-4 mb-4 md:mb-0 text-lg font-bold  break-words ">
        <h1>{props.name}</h1>
      </div>
      <div className="mr-4 mb-4 md:mb-0 text-lg font-bold  break-words ">
        <h1>{props.date}</h1>
      </div>
      <div className="flex flex-grow flex-basis-1 md:flex-grow-0 md:flex-basis-0">
        <select className="p-1 w-full" onChange={changeStatus}>
          {taskStatuses.map((it) => {
            return (
              <option key={it} value={it}>
                {it}
              </option>
            )
          })}
        </select>
      </div>
    </div>
  )
}

export default TaskRow
