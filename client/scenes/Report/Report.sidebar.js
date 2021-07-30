import React from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const ReportSidebar = (props) => {
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
          maxDate={new Date()}
        />
      </div>
      <div className="bg-white p-3 m-2 rounded">
        <div className="px-3">
          <label
            className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
            htmlFor="grid-zip"
          >
            Выберите место
          </label>
          <div className="flex-shrink w-full inline-block relative mb-3">
            <select
              className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
              value={props.place}
              name="cancelReason"
              onChange={props.onChangePlace}
            >
              <option value="">Все</option>
              {props.placeList.map((it) => (
                <option key={it} value={it.id}>
                  {it.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute top-0 mt-2 right-0 flex items-center px-2 text-gray-600">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
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

export default ReportSidebar
