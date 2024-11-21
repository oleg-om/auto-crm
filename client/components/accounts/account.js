import React from 'react'
import { Link } from 'react-router-dom'

const AccountRow = (props) => {
  const removeAccount = (e) => {
    props.deleteAccount(props._id, e.target.value)
  }

  const newRoleArray = props.role.reduce(function roleFind(r, e) {
    const c = props.roles.find((a) => e === a.value)
    if (c) r.push(c.name)
    return r
  }, [])

  return (
    <tr className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0">
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Логин:</span>
        {props.login}
      </td>
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Пароль:</span>
        ********
      </td>
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Должность:</span>
        {newRoleArray.map((it) => (
          <p key={it}>{it}</p>
        ))}
      </td>
      <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Имя:</span>
        {props.name ? props.name : 'Общий аккаунт'}
      </td>
      <td className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
        <Link
          to={`/account/edit/${props._id}`}
          className="px-5 py-1 text-xs border-main-500 border text-main-500 rounded transition duration-300 hover:bg-main-700 hover:text-white focus:outline-none"
        >
          Редактировать
        </Link>
        <button
          className="px-5 py-1 text-xs border-red-500 border text-red-500 rounded transition duration-300 hover:bg-red-700 hover:text-white focus:outline-none ml-1"
          type="button"
          // onClick={(e) => props.deleteItem(props.id)}
          onClick={removeAccount}
        >
          Удалить
        </button>
      </td>
    </tr>
  )
}

export default AccountRow
