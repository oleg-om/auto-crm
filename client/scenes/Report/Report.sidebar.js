import React from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const ReportSidebar = (props) => {
  const propsDate = new Date(props.activeMonth)
  const OrderDate = `${propsDate.toLocaleString('default', { month: 'long' })}`.toString()

  // const timeOptions = [
  //   '00:00',
  //   '00:15',
  //   '00:30',
  //   '00:45',
  //   '01:00',
  //   '01:15',
  //   '01:30',
  //   '01:45',
  //   '02:00',
  //   '02:15',
  //   '02:30',
  //   '02:45',
  //   '03:00',
  //   '03:15',
  //   '03:30',
  //   '03:45',
  //   '04:00',
  //   '04:15',
  //   '04:30',
  //   '04:45',
  //   '05:00',
  //   '05:15',
  //   '05:30',
  //   '05:45',
  //   '06:00',
  //   '06:15',
  //   '06:30',
  //   '06:45',
  //   '07:00',
  //   '07:15',
  //   '07:30',
  //   '07:45',
  //   '08:00',
  //   '08:15',
  //   '08:30',
  //   '08:45',
  //   '09:00',
  //   '09:15',
  //   '09:30',
  //   '09:45',
  //   '10:00',
  //   '10:15',
  //   '10:30',
  //   '10:45',
  //   '11:00',
  //   '11:15',
  //   '11:30',
  //   '11:45',
  //   '12:00',
  //   '12:15',
  //   '12:30',
  //   '12:45',
  //   '13:00',
  //   '13:15',
  //   '13:30',
  //   '13:45',
  //   '14:00',
  //   '14:15',
  //   '14:30',
  //   '14:45',
  //   '15:00',
  //   '15:15',
  //   '15:30',
  //   '15:45',
  //   '16:00',
  //   '16:15',
  //   '16:30',
  //   '16:45',
  //   '17:00',
  //   '17:15',
  //   '17:30',
  //   '17:45',
  //   '18:00',
  //   '18:15',
  //   '18:30',
  //   '18:45',
  //   '19:00',
  //   '19:15',
  //   '19:30',
  //   '19:45',
  //   '20:00',
  //   '20:15',
  //   '20:30',
  //   '20:45',
  //   '21:00',
  //   '21:15',
  //   '21:30',
  //   '21:45',
  //   '22:00',
  //   '22:15',
  //   '22:30',
  //   '22:45',
  //   '23:00',
  //   '23:15',
  //   '23:30',
  //   '23:45'
  // ]

  const timeOptions = [
    '00:00',

    '01:00',

    '02:00',

    '03:00',

    '04:00',

    '05:00',

    '06:00',

    '07:00',

    '08:00',

    '09:00',

    '10:00',

    '11:00',

    '12:00',

    '13:00',

    '14:00',

    '15:00',

    '16:00',

    '17:00',

    '18:00',

    '19:00',

    '20:00',

    '21:00',

    '22:00',

    '23:00',
    '24:00'
  ]
  return (
    <nav className="left-0 top-0 bg-gray-800 w-72 flex flex-col pt-3 sidebar">
      <button
        type="button"
        onClick={() =>
          props.calendarType === 'month'
            ? props.setCalendarType('day')
            : props.setCalendarType('month')
        }
        className="text-white mx-2 font-semibold"
      >
        Выберите {props.calendarType === 'month' ? 'месяц' : 'день'} (нажмите для изменения)
      </button>
      <div className="bg-white p-3 m-2 rounded">
        <Calendar
          view={props.calendarType === 'month' ? 'year' : 'month'}
          onClickMonth={props.setActiveMonth}
          onClickDay={props.setActiveDay}
          value={props.calendarType === 'month' ? props.activeMonth : props.activeDay}
          minDate={new Date(2021, 0, 1)}
          maxDate={new Date()}
        />
      </div>
      {props.calendarType !== 'month' ? (
        <div className="bg-white p-3 m-2 rounded">
          <div className="px-3">
            <label
              className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
              htmlFor="grid-zip"
            >
              Выберите время (оба)
            </label>
            <div className="flex-shrink w-50 inline-block relative mb-3">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-zip"
              >
                Начало
              </label>
              <select
                className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                value={props.timeStart}
                name="timeStart"
                onChange={props.onChangeTimeStart}
              >
                <option value="">Нет</option>
                {timeOptions.map((it) => (
                  <option key={it} value={it}>
                    {it}
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
            <div className="flex-shrink w-50 inline-block relative mb-3">
              <p> - </p>
            </div>
            <div className="flex-shrink w-50 inline-block relative mb-3">
              <label
                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                htmlFor="grid-zip"
              >
                Конец
              </label>
              <select
                className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                value={props.timeFinish}
                name="timeFinish"
                onChange={props.onChangeTimeFinish}
              >
                <option value="">Нет</option>
                {timeOptions.map((it) => (
                  <option key={it} value={it}>
                    {it}
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
      ) : null}
      <div className="bg-white p-3 m-2 rounded">
        <div className="px-3">
          <label
            className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
            htmlFor="grid-zip"
          >
            Выберите место
          </label>
          <div className="flex-shrink w-full inline-block relative mb-3">
            {props.checkIsAdmin ? (
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
            ) : (
              <select
                className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                value={props.place}
                name="cancelReason"
                disabled
                onChange={props.onChangePlace}
              >
                <option value="">Все</option>
                {props.placeList.map((it) => (
                  <option key={it} value={it.id}>
                    {it.name}
                  </option>
                ))}
              </select>
            )}
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
