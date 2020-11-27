import React from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import taskStatuses from '../../lists/task-statuses'

const AutopartsRow = (props) => {
  const createDate = new Date(props.date)
  return (
    <tr className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0">
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left text-sm lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">№:</span>
        {props.id_autoparts}
      </td>
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left text-sm lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Клиент:</span>
        {props.name}
      </td>
      <td className="w-full overflow-hidden lg:w-auto max-w-lg p-2 text-gray-800 text-sm text-left lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Заказ:</span>
        {props.order.length !== 0 && props.order[0].autopartItem !== ''
          ? props.order.slice(0, 2).map((it, index) => (
              <p key={index} className="overflow-hidden">
                {it.autopartItem}
              </p>
            ))
          : props.preorder.slice(0, 2).map((it, index) => <p key={index}>{it.autopartItem}</p>)}
      </td>

      <td className="w-full lg:w-auto p-2 text-gray-800 text-left text-sm lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Авто:</span>
        {props.mark} {props.model}
      </td>
      <td className="whitespace-no-wrap w-full lg:w-auto p-2 text-gray-800 text-sm text-left lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Телефон:</span>
        {props.phone}
      </td>
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left text-sm lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Принял:</span>
        {props.employee}
      </td>
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left text-sm lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Точка:</span>
        {props.place}
      </td>
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left text-sm lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Обработал:</span>
        {props.process ? props.process : <p>Заказ еще не обработан</p>}
      </td>
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left text-sm lg:text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Статус:</span>
        <div
          className={cx('rounded py-1 px-3 text-xs font-bold', {
            'bg-yellow-400': props.status === taskStatuses[0],
            'bg-green-400': props.status === taskStatuses[1],
            'bg-blue-400': props.status === taskStatuses[2],
            'bg-gray-400': props.status === taskStatuses[3],
            'bg-purple-400': props.status === taskStatuses[4],
            'bg-red-400': props.status === taskStatuses[5]
          })}
        >
          {props.status}
        </div>
      </td>
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left text-sm lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Дата:</span>
        {`${createDate.getDate()}.${(createDate.getMonth() + 1)
          .toString()
          .replace(
            /^(\d)$/,
            '0$1'
          )}.${createDate.getFullYear()} ${createDate.getHours()}:${createDate
          .getMinutes()
          .toString()
          .replace(/^(\d)$/, '0$1')}`}
      </td>
      <td className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
        <Link
          to={
            props.role.includes('autopartfull')
              ? `/autoparts/edit/${props.id_autoparts}`
              : `/autoparts/view/${props.id_autoparts}`
          }
          className="px-5 py-1 text-xs border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
        >
          Подробнее
        </Link>
      </td>
    </tr>
  )
}

export default AutopartsRow
