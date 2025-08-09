import React from 'react'
import { Link } from 'react-router-dom'

const PlaceRow = (props) => {
  const removePlace = (e) => {
    props.deletePlace(props.id, e.target.value)
  }
  return (
    <tr className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0">
      <td className="p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Точка:</span>
        {props.name}
      </td>
      <td className="p-2 text-gray-800 text-center border border-b block lg:table-cell relative lg:static whitespace-nowrap">
        <Link
          to={`/place/edit/${props.id}`}
          className="px-5 py-1 text-xs border-main-500 border text-main-500 rounded transition duration-300 hover:bg-main-700 hover:text-white focus:outline-none"
        >
          Редактировать
        </Link>
        <button
          className="px-5 py-1 text-xs border-red-500 border text-red-500 rounded transition duration-300 hover:bg-red-700 hover:text-white focus:outline-none ml-1"
          type="button"
          onClick={removePlace}
        >
          Удалить
        </button>
      </td>
    </tr>
  )
}

export default PlaceRow
