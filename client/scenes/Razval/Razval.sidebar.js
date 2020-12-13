import React from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const RazvalSidebar = (props) => {
  return (
    <nav className="left-0 top-0 bg-gray-800  w-64 flex flex-col pt-3 sidebar">
      <h5 className="text-white mx-2 font-semibold">Выберите дату</h5>
      <div className="bg-white p-3 m-2 rounded">
        <Calendar onChange={props.setActiveDay} value={props.activeDay} />
      </div>
      <div className="text-white mx-2">
        <h5 className="text-white font-semibold">Цвета</h5>
        <p className="bg-yellow-400 rounded text-gray-900 p-2 my-2 text-center">Новая запись</p>
        <p className="bg-blue-400 rounded text-gray-900 p-2 my-2 text-center">
          Запись с другой точки
        </p>
        <p className="bg-green-400 rounded text-gray-900 p-2 my-2 text-center">Работа выполнена</p>
        <p className="bg-red-400 rounded text-gray-900 p-2 my-2 text-center">Работа не выполнена</p>
        <p className="bg-gray-400 rounded text-gray-900 p-2 my-2 text-center">
          Запись на другой точке
        </p>
        <p className="bg-purple-400 rounded text-purple-900 p-2 my-2 text-center">
          Запись недоступна
        </p>
      </div>
    </nav>
  )
}

export default RazvalSidebar
