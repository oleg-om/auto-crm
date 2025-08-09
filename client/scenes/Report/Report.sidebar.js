import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { updateCurrentEmployeeReport } from '../../redux/reducers/employees'

const ReportSidebar = (props) => {
  const dispatch = useDispatch()
  const employeeList = useSelector((s) => s.employees?.report)
  const currentEmployee = useSelector((s) => s.employees.employee)
  const propsDate = new Date(props.activeMonth)
  const OrderDate = `${propsDate.toLocaleString('default', { month: 'long' })}`.toString()

  const [showReport, setShowReport] = useState(true)

  useEffect(() => {
    dispatch(updateCurrentEmployeeReport(''))
    return () => {}
  }, [props?.place, props?.calendarType, props?.active, props.activeMonth])

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
    <nav
      className="left-0 top-0 bg-gray-800 w-72 flex flex-col pt-3 sidebar"
      style={showReport ? {} : { width: '50px' }}
    >
      <button
        className="mb-2 text-white text-left pl-3"
        type="button"
        onClick={() => setShowReport(!showReport)}
      >
        {showReport ? 'Скрыть панель ←' : '→'}
      </button>
      {showReport ? (
        <span>
          <div className="flex flex-row justify-around">
            {props.auth.roles.includes('bookkeeper') || props.auth.roles.includes('boss') ? (
              <button
                type="button"
                onClick={() => props.setCalendarType('month')}
                className={cx(' mx-2 font-semibold', {
                  'text-white': props.calendarType !== 'month',
                  'text-yellow-500 underline': props.calendarType === 'month'
                })}
              >
                Месяц
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => props.setCalendarType('day')}
              className={cx(' mx-2 font-semibold', {
                'text-white': props.calendarType !== 'day',
                'text-yellow-500 underline': props.calendarType === 'day'
              })}
            >
              День
            </button>
            {!props?.active.includes('product') ? (
              <button
                type="button"
                onClick={() => props.setCalendarType('diapason')}
                className={cx(' mx-2 font-semibold', {
                  'text-white': props.calendarType !== 'diapason',
                  'text-yellow-500 underline': props.calendarType === 'diapason'
                })}
              >
                Диапазон
              </button>
            ) : null}
          </div>
          <div className="bg-white p-3 m-2 rounded">
            {props.calendarType === 'month' ? (
              <Calendar
                view="year"
                onClickMonth={props.setActiveMonth}
                onClickDay={props.setActiveDay}
                value={props.activeMonth}
                minDate={new Date(2021, 0, 1)}
                maxDate={new Date()}
              />
            ) : null}
            {props.calendarType === 'day' ? (
              <Calendar
                view="month"
                onClickMonth={props.setActiveMonth}
                onClickDay={props.setActiveDay}
                value={props.activeDay}
                minDate={new Date(2021, 0, 1)}
                maxDate={new Date()}
              />
            ) : null}
            {props.calendarType === 'diapason' ? (
              <Calendar
                view="month"
                onChange={(dt) => props.setRange(dt)}
                value={props.range}
                minDate={new Date(2021, 0, 1)}
                maxDate={new Date()}
                selectRange
              />
            ) : null}
          </div>
          {props.calendarType !== 'month' && props.calendarType !== 'diapason' ? (
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
                    onChange={props.onChangePlace}
                  >
                    {props.placeList
                      .filter((it) => it.id === props.place)
                      .map((it) => (
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

          {props.calendarType === 'diapason' ? (
            <div className="text-white mx-2">
              <h5 className="text-white font-semibold">С дня</h5>
              <p className="bg-white rounded text-gray-900 p-2 my-2 text-center border-l-8 border-main-600 font-bold">
                {`${props.range[0].toLocaleString('default', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}`.toString()}
              </p>
            </div>
          ) : null}
          {props.calendarType === 'diapason' ? (
            <div className="text-white mx-2">
              <h5 className="text-white font-semibold">По день</h5>
              <p className="bg-white rounded text-gray-900 p-2 my-2 text-center border-l-8 border-main-600 font-bold">
                {`${props.range[1].toLocaleString('default', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}`.toString()}
              </p>
            </div>
          ) : null}
          {employeeList ? (
            <div className="bg-white p-3 m-2 rounded">
              <div className="px-3">
                <label
                  className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                  htmlFor="grid-zip"
                >
                  Выберите сотрудника
                </label>
                <div className="flex-shrink w-full inline-block relative mb-3">
                  <select
                    className="block appearance-none w-full bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none py-1 px-4 pr-8 rounded"
                    value={currentEmployee}
                    name="employee"
                    onChange={props.onChangeEmployee}
                  >
                    <option value="">Все</option>
                    {employeeList
                      ?.sort((a, b) => a?.name - b?.name)
                      .map((it) => (
                        <option key={it} value={it.id}>
                          {it.name} {it.surname}
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
          {props.calendarType !== 'diapason' ? (
            <div className="text-white mx-2">
              <h5 className="text-white font-semibold">Выбранный месяц</h5>
              <p className="bg-white rounded text-gray-900 p-2 my-2 text-center border-l-8 border-main-600 font-bold">
                {OrderDate}
              </p>
            </div>
          ) : null}
        </span>
      ) : null}
    </nav>
  )
}

export default ReportSidebar
