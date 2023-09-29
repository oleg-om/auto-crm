import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import Salary from './autoparts'

const Autoparts = ({ calendarType, place, activeMonth, activeDay, active, employeeList }) => {
  const [autoList, setShinList] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  const transformProductTabName = (name) => {
    return name.replace('-product', '')
  }

  useEffect(() => {
    setShinList([])
    const year = (dt) => dt.getFullYear()
    const month = (dt) => `0${dt.getMonth() + 1}`.slice(-2)
    const yearmonth = (dt) => `${year(dt)}-${month(dt)}`
    if (activeMonth && calendarType === 'month') {
      setIsLoaded(false)

      fetch(`api/v1/${transformProductTabName(active)}month?yearmonth=${yearmonth(activeMonth)}`)
        .then((res) => res.json())
        .then((it) => {
          setShinList(it.data)
          setIsLoaded(true)
        })
    }
    if (activeDay && calendarType === 'day') {
      setIsLoaded(false)
      fetch(`api/v1/${transformProductTabName(active)}month?yearmonth=${yearmonth(activeDay)}`)
        .then((res) => res.json())
        .then((it) => {
          setShinList(it.data)
          setIsLoaded(true)
        })
    }
    return () => {}
  }, [activeMonth.getMonth(), activeDay.getMonth(), active])

  const employeeListFull = useSelector((s) => s.employees.list)

  const [report, setReport] = useState([])

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
    } else if (calendarType === 'day' && autoList && autoList.length > 0) {
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
      )
    } else {
      setReport([])
    }
    return () => {}
  }, [autoList, activeMonth, activeDay, place])

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
      <div className={cx('', {})}>
        {isLoaded ? null : loading()}
        {report.length > 0 && isLoaded ? (
          <Salary
            employeeList={employeeList}
            report={report}
            autoList={autoList}
            place={place}
            employeeListFull={employeeListFull}
          />
        ) : null}
        {isLoaded && report.length <= 0 ? <p className="my-3">Записей нет</p> : null}
      </div>
    </>
  )
}

export default Autoparts
