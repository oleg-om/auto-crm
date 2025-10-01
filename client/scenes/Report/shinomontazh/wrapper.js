import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import taskStatuses from '../../../lists/task-statuses'
import Salary from './Salary'
import Material from './Material'

export const checkIsRazvalService = (s) =>
  s?.includes('Развал схождения') ||
  s?.includes('Развал-схождение') ||
  s?.includes('Развал-схождения')

const Shinomontazh = ({
  calendarType,
  place,
  activeMonth,
  activeDay,
  timeFinish,
  timeStart,
  active,
  employeeList,
  showReport
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({ data: [], total: {}, orders: [] })

  const [bossPercent, setBossPercent] = useState(30)
  const [isMaterial, setIsMaterial] = useState('false')
  const [showRazval, setShowRazval] = useState('false')
  const [showPaid, setShowPaid] = useState('true')
  const [employeeId, setEmployeeId] = useState(null)

  useEffect(() => {
    const getType = () => {
      if (active.startsWith('sh-') || active === 'material') {
        return 'shinomontazhmonth'
      }
      if (active.includes('sto-')) {
        return 'stomonth'
      }
      if (active.includes('wash-')) {
        return 'washmonth'
      }
      if (active.includes('cond-')) {
        return 'condmonth'
      }
      if (active.includes('window-')) {
        return 'windowmonth'
      }
      return 'washmonth'
    }

    setIsLoading(true)

    fetch(`api/v1/${getType()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        month: activeMonth.getMonth() + 1,
        year: activeMonth.getFullYear(),
        countMaterials: isMaterial === 'true',
        countOnlyPaidOrders: showPaid === 'true',
        onlyRazvalSto: showRazval === 'true',
        employee: employeeId
      })
    })
      .then((res) => res.json())
      .then((it) => {
        setData(it)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Ошибка при запросе:', err)
        setIsLoading(false)
      })
  }, [activeDay, activeMonth, active, isMaterial, employeeId, showPaid, showRazval])

  const [shinList] = useState([])
  const [isLoaded] = useState(false)
  const [empSalaries] = useState([])


  const employee = useSelector((s) => s.employees.employee)

  const onChangeShowRazval = (e) => {
    const { value } = e.target
    setShowRazval(value)
  }

  const onChangeShowPaid = (e) => {
    const { value } = e.target
    setShowPaid(value)
  }

  const loading = () => {
    return (
      <div className="flex w-100 justify-center my-3">
        <button
          type="button"
          className="bg-main-500 p-3 text-white rounded flex items-center"
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
      {active === 'sh-kassa' ||
      active === 'sto-kassa' ||
      active === 'sh-buh' ||
      active === 'sto-buh' ||
      active === 'wash-kassa' ||
      active === 'wash-buh' ||
      active === 'window-buh' ||
      active === 'window-kassa' ||
      active === 'cond-buh' ||
      active === 'cond-kassa' ? (
        <div className={cx('block', {})}>
          {!isLoading ? null : loading()}
          {data && !isLoading ? (
            <Salary
              data={data}
              employeeId={employeeId}
              setEmployeeId={setEmployeeId}
              employeeList={employeeList}
              taskStatuses={taskStatuses}
              shinList={shinList}
              place={place}
              bossPercent={bossPercent}
              setBossPercent={setBossPercent}
              isMaterial={isMaterial}
              setIsMaterial={setIsMaterial}
              timeStart={timeStart}
              timeFinish={timeFinish}
              calendarType={calendarType}
              active={active}
              employee={employee}
              showRazval={showRazval}
              onChangeShowRazval={onChangeShowRazval}
              showPaid={showPaid}
              onChangeShowPaid={onChangeShowPaid}
              activeMonth={activeMonth}
              showReport={showReport}
              empSalaries={empSalaries}
            />
          ) : null}
          {!isLoading && data?.length <= 0 ? (
            <div>
              {active.includes('sto-') ? (
                <div>
                  <p>Только развал:</p>
                  <select
                    className="appearance-none block bg-grey-lighter text-sm text-grey-darker border border-gray-300 focus:border-gray-500 focus:outline-none rounded py-1 px-4"
                    value={showRazval}
                    onChange={onChangeShowRazval}
                  >
                    <option value="yes" className="text-gray-800">
                      Да
                    </option>
                    <option value="no">Нет</option>
                  </select>
                </div>
              ) : null}
              <p className="my-3">Записей нет</p>
            </div>
          ) : null}
        </div>
      ) : null}
      {active.includes('material') ? (
        <div
          className={cx('', {
            block: active.includes('material'),
            hidden: !active.includes('material')
          })}
        >
          {' '}
          {!isLoading ? null : loading()}
          {data.data.length > 0 && isLoaded ? (
            <Material report={data.data} isLoaded={!isLoading} />
          ) : null}
          {isLoaded && data?.data?.length <= 0 ? <p className="my-3">Записей нет</p> : null}
        </div>
      ) : null}
    </>
  )
}

export default Shinomontazh
