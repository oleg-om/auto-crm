import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
// import taskStatuses from '../../../lists/task-statuses'
import Salary from './autoparts'
import onLoad from './Onload'

const Autoparts = ({
  calendarType,
  place,
  activeMonth,
  activeDay,
  // timeFinish,
  // timeStart,
  active,
  employeeList
}) => {
  onLoad()
  const autoList = useSelector((s) => s.autoparts.list)
  const employeeListFull = useSelector((s) => s.employees.list)
  //   const autoList = () => {
  //     if (autosProps) {
  //       return autosProps
  //     }
  //     return []
  //   }
  const [report, setReport] = useState([])
  console.log(report)

  //   const [bossPercent, setBossPercent] = useState(30)
  //   const [isMaterial, setIsMaterial] = useState('yes')

  useEffect(() => {
    if (calendarType === 'month' && autoList && autoList.length > 0) {
      setReport(
        autoList
          .filter((it) => (place ? place === it.place : it))
          .reduce((acc, rec) => {
            return [
              ...acc,
              {
                ...rec,
                order: rec.order.filter(
                  (or) => or.stat === 'Товар выдан клиенту' && or.come && or.zakup
                ),
                fail: rec.order.filter(
                  (or) => or.stat === 'Товар выдан клиенту' && or.come && !or.zakup
                )
              }
            ]
          }, [])
          .reduce((acc, rec) => {
            return [
              ...acc,
              {
                ...rec,
                order: rec.order.filter(
                  (item) =>
                    new Date(item.come).getFullYear() === activeMonth.getFullYear() &&
                    new Date(item.come).getMonth() + 1 === activeMonth.getMonth() + 1
                )
              }
            ]
          }, [])
          .filter((item) => item.order.length > 0)
      )
    }
    if (calendarType === 'day' && autoList && autoList.length > 0) {
      // console.log('day')
      setReport(
        autoList
          .filter((it) => (place ? place === it.place : it))
          .reduce((acc, rec) => {
            return [
              ...acc,
              {
                ...rec,
                order: rec.order.filter(
                  (or) => or.stat === 'Товар выдан клиенту' && or.come && or.zakup
                ),
                fail: rec.order.filter(
                  (or) => or.stat === 'Товар выдан клиенту' && or.come && !or.zakup
                )
              }
            ]
          }, [])
          .reduce((acc, rec) => {
            return [
              ...acc,
              {
                ...rec,
                order: rec.order.filter(
                  (item) =>
                    new Date(item.come).getFullYear() === activeDay.getFullYear() &&
                    new Date(item.come).getMonth() + 1 === activeDay.getMonth() + 1 &&
                    new Date(item.come).getDate() === activeDay.getDate()
                )
              }
            ]
          }, [])
          .filter((item) => item.order.length > 0)
        // .filter((it) => it.payment === 'yes')
      )
    }
    return () => {}
  }, [autoList, activeMonth, activeDay, place])

  //   useEffect(() => {
  //     if (calendarType === 'month') {
  //       setReport(
  //         autoList()
  //           .filter((it) => (place ? place === it.place : it))
  //           // .filter((it) => it.payment === 'yes')
  //           .filter(
  //             (item) =>
  //               new Date(item.dateFinish).getFullYear() === activeMonth.getFullYear() &&
  //               new Date(item.dateFinish).getMonth() + 1 === activeMonth.getMonth() + 1
  //           )
  //       )
  //     }
  //     if (calendarType === 'day' && !timeStart && !timeFinish) {
  //       setReport(
  //         autoList()
  //           .filter((it) => (place ? place === it.place : it))
  //           // .filter((it) => it.payment === 'yes')
  //           .filter(
  //             (item) =>
  //               new Date(item.dateFinish).getFullYear() === activeDay.getFullYear() &&
  //               new Date(item.dateFinish).getMonth() + 1 === activeDay.getMonth() + 1 &&
  //               new Date(item.dateFinish).getDate() === activeDay.getDate()
  //           )
  //       )
  //     }
  //     if (calendarType === 'day' && timeStart && timeFinish) {
  //       setReport(
  //         autoList()
  //           .filter((it) => (place ? place === it.place : it))
  //           // .filter((it) => it.payment === 'yes')
  //           .filter(
  //             (item) =>
  //               new Date(item.dateFinish).getFullYear() === activeDay.getFullYear() &&
  //               new Date(item.dateFinish).getMonth() + 1 === activeDay.getMonth() + 1 &&
  //               new Date(item.dateFinish).getDate() === activeDay.getDate() &&
  //               new Date(item.dateFinish).getHours() >=
  //                 new Date(
  //                   `${activeDay.getFullYear()}.${
  //                     activeDay.getMonth() + 1
  //                   }.${activeDay.getDate()} ${timeStart}`
  //                 ).getHours() &&
  //               (timeFinish !== '24:00'
  //                 ? new Date(item.dateFinish).getHours() <=
  //                   new Date(
  //                     `${activeDay.getFullYear()}.${
  //                       activeDay.getMonth() + 1
  //                     }.${activeDay.getDate()} ${timeFinish}`
  //                   ).getHours()
  //                 : 24)
  //           )
  //       )
  //     }
  //     return () => {}
  //   }, [autoList, activeMonth, activeDay, place, timeStart, timeFinish])

  return (
    <>
      <div
        className={cx('', {
          block: active === 'autopart',
          hidden: active !== 'autopart'
        })}
      >
        <Salary
          employeeList={employeeList}
          report={report}
          autoList={autoList}
          place={place}
          employeeListFull={employeeListFull}
        />
      </div>
    </>
  )
}

export default Autoparts
