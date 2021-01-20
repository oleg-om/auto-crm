import React from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const BossSidebar = (props) => {
  const propsDate = new Date(props.activeMonth)
  const OrderDate = `${propsDate.toLocaleString('default', { month: 'long' })}`.toString()
  return (
    <nav className="left-0 top-0 bg-gray-800 w-72 flex flex-col pt-3 sidebar">
      <h5 className="text-white mx-2 font-semibold">Выберите месяц</h5>
      <div className="bg-white p-3 m-2 rounded">
        <Calendar
          view="year"
          onClickMonth={props.setActiveMonth}
          value={props.activeMonth}
          minDate={new Date(2021, 0, 1)}
        />
      </div>
      <div className="text-white mx-2">
        <h5 className="text-white font-semibold">Выбранный месяц</h5>
        <p className="bg-white rounded text-gray-900 p-2 my-2 text-center border-l-8 border-blue-600 font-bold">
          {OrderDate}
        </p>
      </div>
    </nav>
  )
}

export default BossSidebar
