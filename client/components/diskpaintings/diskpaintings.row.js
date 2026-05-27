import React from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import taskStatuses from '../../../common/enums/shinomontazh-statuses'

const DiskpaintingsRow = (props) => {
  const createDate = new Date(props.dateStart)
  const finishDate = new Date(props.dateFinish)

  const totalService = (props.services || [])
    .filter((it) => it.free !== 'yes')
    .reduce((acc, rec) => acc + rec.price * rec.quantity, 0)

  const applyDiscount = (number) => {
    const disc = props.discount ? props.discount : 0
    const numberPercent = (number / 100) * disc
    return Number(number) - Number(numberPercent)
  }

  function roundTo5(num) {
    return Math.round(num / 5) * 5
  }

  const totalMaterial = (props.material || []).reduce((acc, rec) => acc + rec.price * rec.quantity, 0)
  const totalWithDiscount =
    roundTo5(applyDiscount(totalService)) +
    totalMaterial

  return (
    <tr
      className={cx('table-row flex-row flex-no-wrap mb-0', {
        'bg-white hover:bg-gray-100': props.status !== taskStatuses[2],
        'bg-blue-200 hover:bg-blue-300': props.status === taskStatuses[2],
        'bg-yellow-200 hover:bg-yellow-300': props.status === taskStatuses[3] && props.beznalPaid,
        'bg-purple-200 hover:bg-purple-300': props.status === taskStatuses[4] || props.status === taskStatuses[6],
        'bg-red-300 hover:bg-red-400': props.status === taskStatuses[5]
      })}
    >
      <td className="w-auto p-2 text-gray-800 text-sm text-center border border-b table-cell static">
        {props.id_diskpaintings}
      </td>
      <td className="w-auto p-2 text-gray-800 text-sm text-center border border-b table-cell static">
        {props.mark} {props.model}
      </td>
      <td className="w-auto p-2 text-gray-800 text-sm text-center border border-b table-cell static">
        {props.organization ? props.organization.name : props.regnumber}
      </td>
      <td className="w-auto p-2 text-gray-800 text-sm text-center border border-b table-cell static">
        <div
          className={cx('rounded py-1 px-3 text-xs font-bold', {
            'bg-orange-400': props.status === taskStatuses[0],
            'bg-green-400': props.status === taskStatuses[1],
            'bg-blue-400': props.status === taskStatuses[2],
            'bg-yellow-400': props.status === taskStatuses[3],
            'bg-purple-400': props.status === taskStatuses[4] || props.status === taskStatuses[6],
            'bg-red-500': props.status === taskStatuses[5]
          })}
        >
          {props.status}
        </div>
      </td>
      <td className="w-auto p-2 text-gray-800 text-sm text-center border border-b table-cell static">
        {`${createDate.getDate().toString().replace(/^(\d)$/, '0$1')}.${(createDate.getMonth() + 1)
          .toString()
          .replace(/^(\d)$/, '0$1')}.${createDate.getFullYear()} ${createDate.getHours()}:${createDate
          .getMinutes()
          .toString()
          .replace(/^(\d)$/, '0$1')}`}
      </td>
      <td className="w-auto p-2 text-gray-800 text-sm text-center border border-b table-cell static">
        {props.dateFinish
          ? `${finishDate.getDate().toString().replace(/^(\d)$/, '0$1')}.${(finishDate.getMonth() + 1)
              .toString()
              .replace(/^(\d)$/, '0$1')}.${finishDate.getFullYear()} ${finishDate.getHours()}:${finishDate
              .getMinutes()
              .toString()
              .replace(/^(\d)$/, '0$1')}`
          : ''}
      </td>
      <td className="w-auto p-2 text-gray-800 text-sm text-center border border-b table-cell static">
        {totalWithDiscount} руб
      </td>
      <td className="w-auto p-2 text-gray-800 text-sm text-center border border-b table-cell static">
        <div className="flex flex-row justify-center">
          <Link
            to={{
              pathname: `/diskpainting/edit/${props.id_diskpaintings}/${props.num ? props.num : ''}`,
              search: props.filterSearch || ''
            }}
            className="px-5 py-1 text-xs border-main-500 border text-main-500 rounded transition duration-300 hover:bg-main-700 hover:text-white focus:outline-none"
          >
            Подробнее
          </Link>
        </div>
      </td>
    </tr>
  )
}

export default DiskpaintingsRow
