import React, { useEffect, useState, Suspense } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import Navbar from '../../components/Navbar'
import ReportSidebar from './Report.sidebar'
import Shinomontazh from './shinomontazh/wrapper'

const Autoparts = React.lazy(() => import('./Autoparts/wrapper'))

const Report = () => {
  const placeList = useSelector((s) => s.places.list)
  const employeeList = useSelector((s) => s.employees.list)
  const auth = useSelector((s) => s.auth)

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
          range={range}
          setRange={setRange}
          active={active}
          auth={auth}
        />
        <div className="w-full mx-auto px-4">
          <h1 className="text-3xl py-4 border-b mb-6">Статистика</h1>
          <div className="py-3 px-4 my-3 rounded-lg shadow bg-white">
            <div className="flex flex-wrap">
              {auth.roles.includes('kassa') || auth.roles.includes('boss') ? (
                <>
                  <div className="w-1/5 p-2">
                    <button
                      type="button"
                      className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                        block: active !== 'sh-kassa',
                        'border-b-8 border-blue-400': active === 'sh-kassa'
                      })}
                      onClick={() => setActive('sh-kassa')}
                    >
                      Шиномонтаж (касса)
                    </button>
                  </div>
                  <div className="w-1/5 p-2">
                    <button
                      type="button"
                      className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                        block: active !== 'sto-kassa',
                        'border-b-8 border-blue-400': active === 'sto-kassa'
                      })}
                      onClick={() => setActive('sto-kassa')}
                    >
                      СТО (касса)
                    </button>
                  </div>
                  <div className="w-1/5 p-2">
                    <button
                      type="button"
                      className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                        block: active !== 'wash-kassa',
                        'border-b-8 border-blue-400': active === 'wash-kassa'
                      })}
                      onClick={() => setActive('wash-kassa')}
                    >
                      Мойка (касса)
                    </button>
                  </div>
                  <div className="w-1/5 p-2">
                    <button
                      type="button"
                      className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                        block: active !== 'window-kassa',
                        'border-b-8 border-blue-400': active === 'window-kassa'
                      })}
                      onClick={() => setActive('window-kassa')}
                    >
                      Стекла (касса)
                    </button>
                  </div>
                  <div className="w-1/5 p-2">
                    <button
                      type="button"
                      className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                        block: active !== 'cond-kassa',
                        'border-b-8 border-blue-400': active === 'cond-kassa'
                      })}
                      onClick={() => setActive('cond-kassa')}
                    >
                      Кондиционеры (касса)
                    </button>
                  </div>
                </>
              ) : null}
              {auth.roles.includes('bookkeeper') || auth.roles.includes('boss') ? (
                <>
                  <div className="w-1/5 p-2">
                    <button
                      type="button"
                      className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                        block: active !== 'sh-buh',
                        'border-b-8 border-blue-400': active === 'sh-buh'
                      })}
                      onClick={() => setActive('sh-buh')}
                    >
                      Шиномонтаж (бухгалтерия)
                    </button>
                  </div>
                  <div className="w-1/5 p-2">
                    <button
                      type="button"
                      className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                        block: active !== 'sto-buh',
                        'border-b-8 border-blue-400': active === 'sto-buh'
                      })}
                      onClick={() => setActive('sto-buh')}
                    >
                      СТО (бухгалтерия)
                    </button>
                  </div>
                  <div className="w-1/5 p-2">
                    <button
                      type="button"
                      className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                        block: active !== 'wash-buh',
                        'border-b-8 border-blue-400': active === 'wash-buh'
                      })}
                      onClick={() => setActive('wash-buh')}
                    >
                      Мойка (бухгалтерия)
                    </button>
                  </div>
                  <div className="w-1/5 p-2">
                    <button
                      type="button"
                      className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                        block: active !== 'window-buh',
                        'border-b-8 border-blue-400': active === 'window-buh'
                      })}
                      onClick={() => setActive('window-buh')}
                    >
                      Стекла (бухгалтерия)
                    </button>
                  </div>
                  <div className="w-1/5 p-2">
                    <button
                      type="button"
                      className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                        block: active !== 'cond-buh',
                        'border-b-8 border-blue-400': active === 'cond-buh'
                      })}
                      onClick={() => setActive('cond-buh')}
                    >
                      Кондиционеры (бухгалтерия)
                    </button>
                  </div>
                </>
              ) : null}
              <div className="w-1/5 p-2">
                <button
                  type="button"
                  className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                    block: active !== 'material',
                    'border-b-8 border-blue-400': active === 'material'
                  })}
                  onClick={() => setActive('material')}
                >
                  Материалы (шиномонтаж)
                </button>
              </div>
              <div className="w-1/5 p-2">
                <button
                  type="button"
                  className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                    block: active !== 'autopart',
                    'border-b-8 border-blue-400': active === 'autopart'
                  })}
                  onClick={() => setActive('autopart')}
                >
                  Автозапчасти
                </button>
              </div>
              {/* {checkIsAdmin ? (
                <div className="w-1/5 p-2">
                  <a
                    href="https://docs.google.com/spreadsheets/d/1L6mR3e0bmu13y7OqIlMQbziWb4a7Ev0k9X_zu-kEBTg/edit?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                    className={cx('p-4 bg-gray-200 rounded w-full h-full block text-center', {})}
                  >
                    Программа
                  </a>
                </div>
              ) : null} */}
            </div>
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
              // auth={auth}
            />
            {active === 'autopart' ? (
              <div
                className={cx('', {
                  block: active === 'autopart',
                  hidden: active !== 'autopart'
                })}
              >
                {' '}
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
    </div>
  )
}

export default Report
