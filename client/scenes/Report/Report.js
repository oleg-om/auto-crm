import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import Navbar from '../../components/Navbar'
import taskStatuses from '../../lists/task-statuses'
import ReportSidebar from './Report.sidebar'
import Salary from './Salary'
import Material from './Material'
import onLoad from './Onload'
import statuses from '../../../common/enums/shinomontazh-statuses'

const Report = () => {
  onLoad()
  const shinList = useSelector((s) => s.shinomontazhs.list)
  const placeList = useSelector((s) => s.places.list)
  const employeeList = useSelector((s) => s.employees.list)
  const auth = useSelector((s) => s.auth)

  const [checkIsAdmin, setCheckIsAdmin] = useState(true)
  const [report, setReport] = useState([])

  const [calendarType, setCalendarType] = useState('month')

  const [place, setPlace] = useState('')
  const [activeMonth, setActiveMonth] = useState(new Date())
  const [activeDay, setActiveDay] = useState(new Date())
  const [active, setActive] = useState('salary')

  const [bossPercent, setBossPercent] = useState(30)
  const [isMaterial, setIsMaterial] = useState('yes')
  useEffect(() => {
    if (auth.roles.length > 0 && !auth.roles.includes('boss') && !auth.roles.includes('admin')) {
      setPlace(auth.place)
      setCheckIsAdmin(false)
    }

    return () => {}
  }, [auth.roles, auth.place])

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

  const [timeStart, setSimeStart] = useState('')
  const [timeFinish, setTimeFinish] = useState('')

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
  console.log(
    new Date(
      `${activeDay.getFullYear()}.${activeDay.getMonth() + 1}.${activeDay.getDate()} 24:00`
    ).getHours()
  )
  const onChangePlace = (e) => {
    setPlace(e.target.value)
  }

  //   useEffect(() => {
  //     setReportRazval(
  //       razvalList.filter(
  //         (item) =>
  //           new Date(item.date).getFullYear() === activeMonth.getFullYear() &&
  //           new Date(item.date).getMonth() + 1 === activeMonth.getMonth() + 1
  //       )
  //     )
  //     return () => {}
  //   }, [razvalList, activeMonth])
  const onChangeTimeStart = (e) => {
    setSimeStart(e.target.value)
  }
  const onChangeTimeFinish = (e) => {
    setTimeFinish(e.target.value)
  }
  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        <ReportSidebar
          setActiveMonth={setActiveMonth}
          setActiveDay={setActiveDay}
          activeDay={activeDay}
          activeMonth={activeMonth}
          placeList={placeList}
          place={place}
          onChangePlace={onChangePlace}
          calendarType={calendarType}
          setCalendarType={setCalendarType}
          checkIsAdmin={checkIsAdmin}
          timeStart={timeStart}
          onChangeTimeStart={onChangeTimeStart}
          timeFinish={timeFinish}
          onChangeTimeFinish={onChangeTimeFinish}
        />
        <div className="w-full mx-auto px-4">
          <h1 className="text-3xl py-4 border-b mb-6">Статистика</h1>
          <div className="py-3 px-4 my-3 rounded-lg shadow bg-white">
            <div className="flex flex-row">
              <div className="w-1/5 p-2">
                <button
                  type="button"
                  className={cx('p-4 bg-gray-200 rounded w-full h-full', {
                    block: active !== 'salary',
                    'border-b-8 border-blue-400': active === 'salary'
                  })}
                  onClick={() => setActive('salary')}
                >
                  Зарплаты
                </button>
              </div>
              <div className="w-1/5 p-2">
                <button
                  type="button"
                  className={cx('p-4 bg-gray-200 rounded w-full h-full', {
                    block: active !== 'material',
                    'border-b-8 border-blue-400': active === 'material'
                  })}
                  onClick={() => setActive('material')}
                >
                  Материалы(шиномонтаж)
                </button>
              </div>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default Report
