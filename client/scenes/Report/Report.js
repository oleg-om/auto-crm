import React, { useEffect, useState, Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import Navbar from '../../components/Navbar'
import ReportSidebar from './Report.sidebar'
import Shinomontazh from './shinomontazh/wrapper'
import PasswordChecker from './PasswordChecker'
import { updateCurrentEmployeeReport } from '../../redux/reducers/employees'

const Autoparts = React.lazy(() => import('./Autoparts/wrapper'))

const ReportTab = ({ active, onChangeTab, tab }) => {
  const { value, name } = tab
  return (
    <div className="w-1/5 p-2">
      <button
        type="button"
        className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
          block: active !== value,
          'border-b-8 border-main-400': active === value
        })}
        value={value}
        onClick={onChangeTab}
      >
        {name}
      </button>
    </div>
  )
}

let KASSA_TABS = [
  { name: 'Шиномонтаж (касса)', value: 'sh-kassa' },
  { name: 'СТО (касса)', value: 'sto-kassa' },
  { name: 'Мойка (касса)', value: 'wash-kassa' },
  { name: 'Стекла (касса)', value: 'window-kassa' },
  { name: 'Кондиционеры (касса)', value: 'cond-kassa' }
]

let BUH_TABS = [
  { name: 'Шиномонтаж (бухгалтерия)', value: 'sh-buh' },
  { name: 'СТО (бухгалтерия)', value: 'sto-buh' },
  { name: 'Мойка (бухгалтерия)', value: 'wash-buh' },
  { name: 'Стекла (бухгалтерия)', value: 'window-buh' },
  { name: 'Кондиционеры (бухгалтерия)', value: 'cond-buh' }
]

let MATERIAL_TABS = [
  { name: 'Шиномонтаж (материалы)', value: 'sh-material' },
  { name: 'СТО (материалы)', value: 'sto-material' },
  { name: 'Мойка (материалы)', value: 'wash-material' },
  { name: 'Стекла (материалы)', value: 'window-material' },
  { name: 'Кондиционеры (материалы)', value: 'cond-material' }
]

let PRODUCT_TABS = [
  { name: 'Автозапчасти', value: 'autoparts-product' },
  { name: 'Инструмент', value: 'tools-product' },
  { name: 'Шины', value: 'tyres-product' }
]

const Report = () => {
  const placeList = useSelector((s) => s.places.list)
  const employeeList = useSelector((s) => s.employees.list)
  const auth = useSelector((s) => s.auth)
  const dispatch = useDispatch()

  const isStudy = process.env.MODE === 'study'

  if (isStudy) {
    KASSA_TABS = [{ name: 'Шиномонтаж (касса)', value: 'sh-kassa' }]
    BUH_TABS = [{ name: 'Шиномонтаж (бухгалтерия)', value: 'sh-buh' }]
    MATERIAL_TABS = [{ name: 'Шиномонтаж (материалы)', value: 'sh-material' }]
    PRODUCT_TABS = []
  }

  const mockPassword = '320208'
  const [passwordIsCorrect, setPasswordIsCorrect] = useState(false)

  const [checkIsAdmin, setCheckIsAdmin] = useState(true)

  const [calendarType, setCalendarType] = useState('day')

  const [place, setPlace] = useState('')
  const [activeMonth, setActiveMonth] = useState(new Date())
  const [activeDay, setActiveDay] = useState(new Date())
  const [active, setActive] = useState('sh-kassa')

  const [range, setRange] = useState([new Date(), new Date()])

  useEffect(() => {
    if (auth.roles.length > 0 && !auth.roles.includes('boss') && !auth.roles.includes('admin')) {
      setPlace(auth.place)
      setCheckIsAdmin(false)
    }

    return () => {}
  }, [auth.roles, auth.place])

  const [timeStart, setSimeStart] = useState('')
  const [timeFinish, setTimeFinish] = useState('')

  const onChangePlace = (e) => {
    setPlace(e.target.value)
  }

  const onChangeEmployee = (e) => {
    const { value } = e.target
    dispatch(updateCurrentEmployeeReport(value))
  }

  const onChangeTimeStart = (e) => {
    setSimeStart(e.target.value)
  }
  const onChangeTimeFinish = (e) => {
    setTimeFinish(e.target.value)
  }

  const requestPasswordForReport = auth?.requestPasswordForReport

  const onChangeTab = (e) => {
    const { value } = e.target
    setActive(value)
  }

  return (
    <div>
      <Navbar />
      {!requestPasswordForReport || passwordIsCorrect ? (
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
            range={range}
            setRange={setRange}
            active={active}
            auth={auth}
            onChangeEmployee={onChangeEmployee}
          />
          <div className="w-full mx-auto px-4">
            <h1 className="text-3xl py-4 border-b mb-6">Статистика</h1>
            <div className="py-3 px-4 my-3 rounded-lg shadow bg-white">
              <div className="flex flex-wrap">
                {auth.roles.includes('kassa') || auth.roles.includes('boss') ? (
                  <>
                    {KASSA_TABS.map((tab) => (
                      <ReportTab
                        active={active}
                        onChangeTab={onChangeTab}
                        tab={tab}
                        key={tab.value}
                      />
                    ))}
                  </>
                ) : null}
                {auth.roles.includes('bookkeeper') || auth.roles.includes('boss') ? (
                  <>
                    {BUH_TABS.map((tab) => (
                      <ReportTab
                        active={active}
                        onChangeTab={onChangeTab}
                        tab={tab}
                        key={tab.value}
                      />
                    ))}
                  </>
                ) : null}
                {MATERIAL_TABS.map((tab) => (
                  <ReportTab active={active} onChangeTab={onChangeTab} tab={tab} key={tab.value} />
                ))}
                {PRODUCT_TABS.map((tab) => (
                  <ReportTab active={active} onChangeTab={onChangeTab} tab={tab} key={tab.value} />
                ))}
              </div>
              {!active.includes('product') ? (
                <Shinomontazh
                  calendarType={calendarType}
                  place={place}
                  activeMonth={activeMonth}
                  activeDay={activeDay}
                  timeFinish={timeFinish}
                  employeeList={employeeList}
                  timeStart={timeStart}
                  active={active}
                  range={range}
                />
              ) : null}
              {active.includes('product') ? (
                <div
                  className={cx('', {
                    block: active.includes('product'),
                    hidden: !active.includes('product')
                  })}
                >
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <Autoparts
                      calendarType={calendarType}
                      place={place}
                      activeMonth={activeMonth}
                      activeDay={activeDay}
                      timeFinish={timeFinish}
                      employeeList={employeeList}
                      timeStart={timeStart}
                      active={active}
                    />
                  </Suspense>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <PasswordChecker setPasswordIsCorrect={setPasswordIsCorrect} pass={mockPassword} />
      )}
    </div>
  )
}

export default Report
