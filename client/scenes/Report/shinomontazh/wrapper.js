import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
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
  const shinList = useSelector((s) => s.shinomontazhs.list)

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

  return (
    <>
      <div
        className={cx('', {
          block: active === 'salary',
          hidden: active !== 'salary'
        })}
      >
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
      </div>
      <div
        className={cx('', {
          block: active === 'material',
          hidden: active !== 'material'
        })}
      >
        <Material report={report} />
      </div>
    </>
  )
}

export default Shinomontazh
