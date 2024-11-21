import React from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
// import { useReactToPrint } from 'react-to-print'
import taskStatuses from '../../../common/enums/shinomontazh-statuses'

const ShinomontazhsRow = (props) => {
  // const componentRef = useRef()
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current
  // })
  const createDate = new Date(props.dateStart)
  const finishDate = new Date(props.dateFinish)

  const totalFreeService = props.services
    .filter((it) => it.free === 'yes')
    .reduce((acc, rec) => acc + rec.price * rec.quantity, 0)
  const totalService = props.services
    .filter((it) => it.free !== 'yes')
    .reduce((acc, rec) => acc + rec.price * rec.quantity, 0)

  const applyDiscount = (number) => {
    const disc = props.discount ? props.discount : 0
    const number_percent = (number / 100) * disc

    return Number(number) - Number(number_percent)
  }

  const applyDiscountWithFreeService = (number) => {
    return Number(number) - Number(number)
  }
  function roundTo5(num) {
    return Math.round(num / 5) * 5
  }
  const totalMaterial = props.material.reduce((acc, rec) => acc + rec.price * rec.quantity, 0)
  const totalWithDiscount =
    applyDiscountWithFreeService(totalFreeService) +
    roundTo5(applyDiscount(totalService)) +
    totalMaterial

  return (
    <tr
      className={cx('table-row flex-row flex-no-wrap mb-0', {
        'bg-white hover:bg-gray-100': props.status !== taskStatuses[2],
        'bg-blue-200 hover:bg-blue-300': props.status === taskStatuses[2],
        'bg-yellow-200 hover:bg-yellow-300': props.status === taskStatuses[3],
        'bg-purple-200 hover:bg-purple-300':
          props.status === taskStatuses[4] || props.status === taskStatuses[6],
        'bg-red-300 hover:bg-red-400': props.status === taskStatuses[5]
      })}
    >
      <td className="w-auto p-2 text-gray-800 text-sm text-center border border-b table-cell static">
        {props.id_shinomontazhs}
      </td>
      <td className="w-auto p-2 text-gray-800 text-sm text-center border border-b table-cell static">
        {props.mark} {props.model}
      </td>
      <td className="w-auto p-2 text-gray-800 text-sm text-center border border-b table-cell static">
        {props.regnumber}
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
        {`${createDate
          .getDate()
          .toString()
          .replace(/^(\d)$/, '0$1')}.${(createDate.getMonth() + 1)
          .toString()
          .replace(
            /^(\d)$/,
            '0$1'
          )}.${createDate.getFullYear()} ${createDate.getHours()}:${createDate
          .getMinutes()
          .toString()
          .replace(/^(\d)$/, '0$1')}`}
      </td>
      <td className="w-auto p-2 text-gray-800 text-sm text-center border border-b table-cell static">
        {props.dateFinish
          ? `${finishDate
              .getDate()
              .toString()
              .replace(/^(\d)$/, '0$1')}.${(finishDate.getMonth() + 1)
              .toString()
              .replace(
                /^(\d)$/,
                '0$1'
              )}.${finishDate.getFullYear()} ${finishDate.getHours()}:${finishDate
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
          {/* <button
            type="submit"
            title="Печать предчека"
            onClick={handlePrint}
            className="p-1 bg-gray-200 text-gray-700 hover:text-gray-600 border border-gray-600 hover:bg-gray-400 rounded h-22 w-22 mr-2"
          >
            <div>
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
          </button> */}
          <Link
            to={`/shinomontazh/edit/${props.id_shinomontazhs}/${props.num ? props.num : ''}`}
            className="px-5 py-1 text-xs border-main-500 border text-main-500 rounded transition duration-300 hover:bg-main-700 hover:text-white focus:outline-none"
          >
            Подробнее
          </Link>
        </div>
      </td>
    </tr>
  )
}

export default ShinomontazhsRow
