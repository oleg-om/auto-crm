import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const OrganizationRow = ({ id, name, phone, deleteOrganization }) => {
  return (
    <tr className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0">
      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
          Название
        </span>
        {name}
      </td>
      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
          Телефон
        </span>
        {phone || '-'}
      </td>
      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
          Действия
        </span>
        <Link to={`/organization/edit/${id}`}>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 border border-blue-500 rounded mr-2"
          >
            Редактировать
          </button>
        </Link>
        <button
          type="button"
          onClick={() => deleteOrganization(id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 border border-red-500 rounded"
        >
          Удалить
        </button>
      </td>
    </tr>
  )
}

OrganizationRow.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  phone: PropTypes.string,
  deleteOrganization: PropTypes.func
}

OrganizationRow.defaultProps = {
  id: '',
  name: '',
  phone: '',
  deleteOrganization: () => {}
}

export default React.memo(OrganizationRow)
