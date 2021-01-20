import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../../components/Navbar'
import taskStatuses from '../../lists/task-statuses'
import razvalStatuses from '../../lists/razval.statuses'
import BossSidebar from './Boss.sidebar'
import Autoparts from './Autoparts'
import Razval from './Razval'
import Oil from './Oil'
import Cars from './Cars'

const Boss = () => {
  const autopartsList = useSelector((s) => s.autoparts.list)
  const employeeList = useSelector((s) => s.employees.list)
  const placeList = useSelector((s) => s.places.list)
  const razvalList = useSelector((s) => s.razvals.list)
  const oilList = useSelector((s) => s.oils.list)
  const [report, setReport] = useState([])
  const [reportRazval, setReportRazval] = useState([])
  const [reportOil, setReportOil] = useState([])

  const [activeMonth, setActiveMonth] = useState(new Date())

  useEffect(() => {
    setReport(
      autopartsList.filter(
        (item) =>
          new Date(item.date).getFullYear() === activeMonth.getFullYear() &&
          new Date(item.date).getMonth() + 1 === activeMonth.getMonth() + 1
      )
    )
    return () => {}
  }, [autopartsList, activeMonth])

  useEffect(() => {
    setReportRazval(
      razvalList.filter(
        (item) =>
          new Date(item.date).getFullYear() === activeMonth.getFullYear() &&
          new Date(item.date).getMonth() + 1 === activeMonth.getMonth() + 1
      )
    )
    return () => {}
  }, [razvalList, activeMonth])

  useEffect(() => {
    setReportOil(
      oilList.filter(
        (item) =>
          new Date(item.date).getFullYear() === activeMonth.getFullYear() &&
          new Date(item.date).getMonth() + 1 === activeMonth.getMonth() + 1
      )
    )
    return () => {}
  }, [oilList, activeMonth])

  const carArray = report
    .concat(reportRazval)
    .concat(reportOil)
    .filter((it) => it.mark && it.model)
    .map((it) => ({ car: `${it.mark} ${it.model}` }))
    .reduce((acc, rec) => Object.assign(acc, { [rec.car]: (acc[rec.car] || 0) + 1 }), {})

  const slicedCarArray = Object.keys(carArray)
    .map(function (key) {
      return { car: key, count: carArray[key] }
    })
    .sort(function (a, b) {
      return b.count - a.count
    })
    .slice(0, 5)

  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        <BossSidebar setActiveMonth={setActiveMonth} activeMonth={activeMonth} />
        <div className="container mx-auto px-4">
          <h1 className="text-3xl py-4 border-b mb-6">Статистика</h1>
          <div className="py-3 px-4 my-3 rounded-lg shadow bg-white">
            <Autoparts employeeList={employeeList} report={report} taskStatuses={taskStatuses} />
            <Razval
              reportRazval={reportRazval}
              placeList={placeList}
              razvalStatuses={razvalStatuses}
            />
            <Oil reportOil={reportOil} placeList={placeList} razvalStatuses={razvalStatuses} />
            {slicedCarArray.length > 0 ? <Cars slicedCarArray={slicedCarArray} /> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Boss
