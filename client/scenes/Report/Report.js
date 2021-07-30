import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import Navbar from '../../components/Navbar'
import taskStatuses from '../../lists/task-statuses'
import ReportSidebar from './Report.sidebar'
import Salary from './Salary'
import Material from './Material'

const Report = () => {
  const shinList = useSelector((s) => s.shinomontazhs.list)
  const placeList = useSelector((s) => s.places.list)
  const employeeList = useSelector((s) => s.employees.list)
  const [report, setReport] = useState([])

  const [place, setPlace] = useState('')
  const [activeMonth, setActiveMonth] = useState(new Date())
  const [active, setActive] = useState('salary')
  useEffect(() => {
    setReport(
      shinList
        .filter((it) => (place ? place === it.place : it))
        .filter((it) => it.status === 'Оплачено')
        .filter(
          (item) =>
            new Date(item.dateStart).getFullYear() === activeMonth.getFullYear() &&
            new Date(item.dateStart).getMonth() + 1 === activeMonth.getMonth() + 1
        )
    )
    return () => {}
  }, [shinList, activeMonth, place])

  const onChangePlace = (e) => {
    setPlace(e.target.value)
  }
  console.log(place)
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

  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        <ReportSidebar
          setActiveMonth={setActiveMonth}
          activeMonth={activeMonth}
          placeList={placeList}
          place={place}
          onChangePlace={onChangePlace}
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
