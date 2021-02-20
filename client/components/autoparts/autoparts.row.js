import React from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
// import { useReactToPrint } from 'react-to-print'
// import ComponentToPrint from './autoparts.print'
import taskStatuses from '../../lists/task-statuses'

const AutopartsRow = (props) => {
  // const componentRef = useRef()
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current
  // })
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
        {props.employeeList ? `${props.employeeList.name} ${props.employeeList.surname}` : ''}
      </td>
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left text-sm lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Точка:</span>
        {props.placesList ? props.placesList.name : ''}
      </td>
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left text-sm lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Обработал:</span>
        {props.processList ? (
          `${props.processList.name} ${props.processList.surname}`
        ) : (
          <p>Заказ еще не обработан</p>
        )}
      </td>
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left text-sm lg:text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Статус:</span>
        <div
          className={cx('rounded py-1 px-3 text-xs font-bold', {
            'bg-yellow-400': props.status === taskStatuses[0],
            'bg-orange-400': props.status === taskStatuses[1],
            'bg-green-400': props.status === taskStatuses[2],
            'bg-blue-400': props.status === taskStatuses[3],
            'bg-gray-400': props.status === taskStatuses[4],
            'bg-purple-400': props.status === taskStatuses[5],
            'bg-red-400': props.status === taskStatuses[6]
          })}
        >
          {props.status}
        </div>
      </td>
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left text-sm lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Дата:</span>
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
      <td className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
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
            to={
              props.role.includes('autopartfull')
                ? `/autoparts/edit/${props.id_autoparts}`
                : `/autoparts/view/${props.id_autoparts}`
            }
            className="px-5 py-1 text-xs border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
          >
            Подробнее
          </Link>
        </div>
      </td>
      {/* <div className="hidden">
        <ComponentToPrint
          ref={componentRef}
          props={props}
          helpphone={props.settings.map((it) => it.helpphone)}
          placesList={props.placesList}
        />
      </div> */}
    </tr>
  )
}

export default AutopartsRow
