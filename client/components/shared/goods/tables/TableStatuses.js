import React from 'react'
import cx from 'classnames'
import taskStatuses from '../../../../lists/task-statuses'

const statusColor = (props) => {
  //   return {
  //     'bg-yellow-400': props.status === taskStatuses[0],
  //     'bg-orange-400': props.status === taskStatuses[1],
  //     'bg-green-400': props.status === taskStatuses[2],
  //     'bg-blue-400': props.status === taskStatuses[3],
  //     'bg-gray-400': props.status === taskStatuses[4],
  //     'bg-purple-400': props.status === taskStatuses[5],
  //     'bg-red-400': props.status === taskStatuses[6]
  //   }
  return {
    'bg-yellow-400': props.status === taskStatuses[0],
    'bg-orange-400': props.status === taskStatuses[1],
    'bg-green-400': props.status === taskStatuses[2],
    'bg-pink-400': props.status === taskStatuses[3],
    'bg-blue-400': props.status === taskStatuses[4],
    'bg-gray-400': props.status === taskStatuses[5],
    'bg-purple-400': props.status === taskStatuses[6],
    'bg-red-400': props.status === taskStatuses[7]
  }
}

const TablesStatusCell = ({ props }) => {
  return (
    <td className="w-full lg:w-auto block p-2 text-gray-800 text-left text-sm lg:text-center border border-b lg:table-cell relative lg:static whitespace-nowrap">
      <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Статус:</span>
      <div
        className={cx(
          'rounded py-1 px-3 text-xs font-bold justify-center flex',
          statusColor(props)
        )}
      >
        {props.status}
        {props.statusDates.find((it) => it.status === 'Печать сметы') ? (
          <div className="ml-2" title="Ранее печаталась смета">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="18"
              height="18"
              x="0"
              y="0"
              viewBox="0 0 512 512"
              xmlSpace="preserve"
              className="block m-auto"
            >
              <g>
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="m414 80h-316c-5.523 0-10-4.477-10-10v-26c0-24.301 19.699-44 44-44h248c24.301 0 44 19.699 44 44v26c0 5.523-4.477 10-10 10z"
                  fill="#4a5568"
                  data-original="#000000"
                />
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="m458 112h-404c-29.776 0-54 24.224-54 54v188c0 29.776 24.224 54 54 54h34v-80c0-39.701 32.299-72 72-72h192c39.701 0 72 32.299 72 72v80h34c29.776 0 54-24.224 54-54v-188c0-29.776-24.224-54-54-54zm-361.98 120c-13.255 0-24.005-10.745-24.005-24s10.74-24 23.995-24h.01c13.255 0 24 10.745 24 24s-10.745 24-24 24z"
                  fill="#4a5568"
                  data-original="#000000"
                />
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="m352 304h-192c-13.255 0-24 10.745-24 24v80 32c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24v-32-80c0-13.255-10.745-24-24-24z"
                  fill="#4a5568"
                  data-original="#000000"
                />
              </g>
            </svg>
          </div>
        ) : null}
      </div>
    </td>
  )
}

export const CardStatus = ({ props }) => {
  return (
    <div className="text-center md:text-left m-3">
      <div>
        <ul>
          <li>
            <b>Текущий статус заказа:</b>
            <div className={cx('rounded py-1 px-3 text-xs font-bold', statusColor(props))}>
              {props.status}
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default TablesStatusCell
