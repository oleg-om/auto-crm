import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import taskStatuses from '../../../lists/task-statuses'
import Salary from './Salary'
import Material from './Material'
import onLoad from './Onload'
import statuses from '../../../../common/enums/shinomontazh-statuses'

const Shinomontazh = ({
  calendarType,
  place,
  activeMonth,
  activeDay,
  timeFinish,
  timeStart,
  active,
  employeeList
}) => {
  onLoad()
  const [shinList, setShinList] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (activeMonth && calendarType === 'month') {
      setIsLoaded(false)
      fetch(
        `api/v1/shinomontazhmonth?month=${
          activeMonth.getMonth() + 1
        }&year=${activeMonth.getFullYear()}`
      )
        .then((res) => res.json())
        .then((it) => {
          setShinList(it.data)
          setIsLoaded(true)
        })
    }
    if (activeDay && calendarType === 'day') {
      setIsLoaded(false)
      fetch(
        `api/v1/shinomontazhmonth?month=${activeDay.getMonth() + 1}&year=${activeDay.getFullYear()}`
      )
        .then((res) => res.json())
        .then((it) => {
          setShinList(it.data)
          setIsLoaded(true)
        })
    }
    return () => {}
  }, [activeMonth.getMonth(), activeDay.getMonth()])

  const [report, setReport] = useState([])

  const [bossPercent, setBossPercent] = useState(30)
  const [isMaterial, setIsMaterial] = useState('yes')

  useEffect(() => {
    if (calendarType === 'month') {
      setReport(
        shinList
          .filter((it) => (place ? place === it.place : it))
          .filter(
            (it) =>
              it.status === statuses[1] ||
              it.status === statuses[2] ||
              it.status === statuses[3] ||
              it.status === statuses[4] ||
              it.status === statuses[6]
          )
          // .filter((it) => it.payment === 'yes')
          .filter(
            (item) =>
              new Date(item.dateFinish).getFullYear() === activeMonth.getFullYear() &&
              new Date(item.dateFinish).getMonth() + 1 === activeMonth.getMonth() + 1
          )
      )
    }
    if (calendarType === 'day') {
      // console.log('day')
      setReport(
        shinList
          .filter((it) => (place ? place === it.place : it))
          .filter(
            (it) =>
              it.status === statuses[1] ||
              it.status === statuses[2] ||
              it.status === statuses[3] ||
              it.status === statuses[4] ||
              it.status === statuses[6]
          )
          // .filter((it) => it.payment === 'yes')
          .filter(
            (item) =>
              new Date(item.dateFinish).getFullYear() === activeDay.getFullYear() &&
              new Date(item.dateFinish).getMonth() + 1 === activeDay.getMonth() + 1 &&
              new Date(item.dateFinish).getDate() === activeDay.getDate()
          )
      )
    }
    return () => {}
  }, [shinList, activeMonth, activeDay, place])

  useEffect(() => {
    if (calendarType === 'month') {
      setReport(
        shinList
          .filter(
            (it) =>
              it.status === statuses[1] ||
              it.status === statuses[2] ||
              it.status === statuses[3] ||
              it.status === statuses[4] ||
              it.status === statuses[6]
          )
          .filter((it) => (place ? place === it.place : it))
          // .filter((it) => it.payment === 'yes')
          .filter(
            (item) =>
              new Date(item.dateFinish).getFullYear() === activeMonth.getFullYear() &&
              new Date(item.dateFinish).getMonth() + 1 === activeMonth.getMonth() + 1
          )
      )
    }
    if (calendarType === 'day' && !timeStart && !timeFinish) {
      setReport(
        shinList
          .filter(
            (it) =>
              it.status === statuses[1] ||
              it.status === statuses[2] ||
              it.status === statuses[3] ||
              it.status === statuses[4] ||
              it.status === statuses[6]
          )
          .filter((it) => (place ? place === it.place : it))
          // .filter((it) => it.payment === 'yes')
          .filter(
            (item) =>
              new Date(item.dateFinish).getFullYear() === activeDay.getFullYear() &&
              new Date(item.dateFinish).getMonth() + 1 === activeDay.getMonth() + 1 &&
              new Date(item.dateFinish).getDate() === activeDay.getDate()
          )
      )
    }
    if (calendarType === 'day' && timeStart && timeFinish) {
      setReport(
        shinList
          .filter(
            (it) =>
              it.status === statuses[1] ||
              it.status === statuses[2] ||
              it.status === statuses[3] ||
              it.status === statuses[4] ||
              it.status === statuses[6]
          )
          .filter((it) => (place ? place === it.place : it))
          // .filter((it) => it.payment === 'yes')
          .filter(
            (item) =>
              new Date(item.dateFinish).getFullYear() === activeDay.getFullYear() &&
              new Date(item.dateFinish).getMonth() + 1 === activeDay.getMonth() + 1 &&
              new Date(item.dateFinish).getDate() === activeDay.getDate() &&
              new Date(item.dateFinish).getHours() >=
                new Date(
                  `${activeDay.getFullYear()}.${
                    activeDay.getMonth() + 1
                  }.${activeDay.getDate()} ${timeStart}`
                ).getHours() &&
              (timeFinish !== '24:00'
                ? new Date(item.dateFinish).getHours() <=
                  new Date(
                    `${activeDay.getFullYear()}.${
                      activeDay.getMonth() + 1
                    }.${activeDay.getDate()} ${timeFinish}`
                  ).getHours()
                : 24)
          )
      )
    }
    return () => {}
  }, [shinList, activeMonth, activeDay, place, timeStart, timeFinish])

  const loading = () => {
    return (
      <div className="flex w-100 justify-center my-3">
        <button
          type="button"
          className="bg-blue-500 p-3 text-white rounded flex items-center"
          disabled
        >
          <div className=" flex justify-center items-center pr-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-4 border-white" />
          </div>
          Загрузка...
        </button>
      </div>
    )
  }

  return (
    <>
      <div
        className={cx('', {
          block: active === 'salary',
          hidden: active !== 'salary'
        })}
      >
        {isLoaded ? null : loading()}
        {report.length > 0 && isLoaded ? (
          <Salary
            employeeList={employeeList}
            report={report}
            taskStatuses={taskStatuses}
            shinList={shinList}
            place={place}
            bossPercent={bossPercent}
            setBossPercent={setBossPercent}
            isMaterial={isMaterial}
            setIsMaterial={setIsMaterial}
            timeStart={timeStart}
            timeFinish={timeFinish}
          />
        ) : null}
        {isLoaded && report.length > 0 ? <p className="my-3">Записей нет</p> : null}
      </div>
      <div
        className={cx('', {
          block: active === 'material',
          hidden: active !== 'material'
        })}
      >
        {' '}
        {isLoaded ? null : loading()}
        {report.length > 0 && isLoaded ? (
          <Material report={report} isLoaded={shinList.isLoaded} />
        ) : null}
        {isLoaded && report.length <= 0 ? <p className="my-3">Записей нет</p> : null}
      </div>
    </>
  )
}

export default Shinomontazh
