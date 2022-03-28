import React from 'react'
import { Link } from 'react-router-dom'

const StopriceRow = (props) => {
  const removeStoprice = (e) => {
    props.deleteStoprice(props.id, e.target.value)
  }

  return (
    <tr className="bg-white lg:hover:bg-gray-100 text-xs flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0">
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Название:</span>
        {props.name}
      </td>
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Направление:</span>
        {props.StoTypeList.find((it) => it.value === props.type)
          ? props.StoTypeList.find((it) => it.value === props.type).name
          : null}
      </td>
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Категория:</span>
        {props.category}
      </td>
 
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Номер:</span>
        {props.number}
      </td>
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Акция:</span>
        {props.free === 'yes' ? 'Да' : 'Нет'}
      </td>

      <td className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
        <Link
          to={`/stoprice/${props.type}/edit/${props.id}`}
          className="px-5 py-1 text-xs border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
        >
          Редактировать
        </Link>
        <button
          type="button"
          className="px-5 py-1 text-xs border-red-500 border text-red-500 rounded transition duration-300 hover:bg-red-700 hover:text-white focus:outline-none ml-1"
          onClick={removeStoprice}
        >
          Удалить
        </button>
      </td>
    </tr>
  )
}

export default StopriceRow
