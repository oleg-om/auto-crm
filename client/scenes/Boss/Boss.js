import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import Navbar from '../../components/Navbar'
import taskStatuses from '../../lists/task-statuses'

const Boss = () => {
  const autopartsList = useSelector((s) => s.autoparts.list)
  const employeeList = useSelector((s) => s.employees.list)
  const [date, setDate] = useState({ year: '', month: '' })
  const [report, setReport] = useState([])

  const onChangeYear = (e) => {
    const { name, innerText } = e.target
    setDate(() => ({
      [name]: innerText
    }))
  }
  const onChange = (e) => {
    const { name, innerText } = e.target
    setDate((prevState) => ({
      ...prevState,
      [name]: innerText
    }))
  }
  useEffect(() => {
    setReport(
      autopartsList.filter(
        (item) =>
          JSON.stringify(new Date(item.date).getFullYear()) === date.year &&
          JSON.stringify(new Date(item.date).getMonth() + 1) === date.month
      )
    )
    return () => {}
  }, [date.year, date.month, autopartsList])

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl py-4 border-b mb-6">Статистика</h1>
        <div className="py-3 px-4 my-3 rounded-lg shadow bg-white">
          <h2 className="text-xl font-semibold">Автозапчасти</h2>
          <div>
            <h3>Год:</h3>
            {autopartsList
              .map((it) => new Date(it.date).getFullYear())
              .filter((item, id, array) => array.indexOf(item) === id)
              .sort(function (a, b) {
                if (a > b) {
                  return 1
                }
                if (a < b) {
                  return -1
                }
                return 0
              })
              .map((it, index) => (
                <button
                  className={cx('p-2 shadow text-white hover:text-white rounded-lg my-3 mx-3', {
                    'bg-blue-600 hover:bg-blue-700': date.year === JSON.stringify(it),
                    'bg-gray-500 hover:bg-gray-700': date.year !== JSON.stringify(it)
                  })}
                  value={date.year}
                  key={index}
                  name="year"
                  type="button"
                  onClick={onChangeYear}
                >
                  {it}
                </button>
              ))}
          </div>
          {date.year ? (
            <div>
              <h3>Месяц</h3>
              {autopartsList
                .filter((item) => JSON.stringify(new Date(item.date).getFullYear()) === date.year)
                .map((it) => new Date(it.date).getMonth())
                .filter((item, id, array) => array.indexOf(item) === id)
                .sort(function (a, b) {
                  if (a > b) {
                    return 1
                  }
                  if (a < b) {
                    return -1
                  }
                  return 0
                })
                .map((it, index) => (
                  <button
                    className={cx('p-2 shadow text-white hover:text-white rounded-lg my-3 mx-3', {
                      'bg-blue-600 hover:bg-blue-700': date.month === JSON.stringify(it + 1),
                      'bg-gray-500 hover:bg-gray-700': date.month !== JSON.stringify(it + 1)
                    })}
                    value={date.month}
                    key={index}
                    name="month"
                    type="button"
                    onClick={onChange}
                  >
                    {it + 1}
                  </button>
                ))}
            </div>
          ) : null}
          {date.year && date.month ? (
            <div>
              <h3>Месячный отчет</h3>
              <table className="border-collapse w-full">
                <thead>
                  <tr>
                    <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      Имя
                    </th>
                    <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      Всего заказов принято
                    </th>
                    <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      Всего заказов обработано
                    </th>
                    <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      Отказов
                    </th>
                    <th className="p-3 font-bold uppercase bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      Успешных
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employeeList
                    .filter(
                      (it) =>
                        it.role.includes('Прием заказов (запчасти)') ||
                        it.role.includes('Обработка заказов (запчасти)')
                    )
                    .map((it) => (
                      <tr
                        key={it.name}
                        className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0"
                      >
                        <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                          <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                            Имя:
                          </span>
                          {it.name} {it.surname}
                        </td>
                        <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                          <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                            Всего заказов принято:
                          </span>
                          {report.filter((item) => item.employee === it.id).length}
                        </td>
                        <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                          <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                            Всего заказов обработано:
                          </span>
                          {report.filter((item) => item.process === it.id).length}
                        </td>
                        <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                          <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                            Отказов:
                          </span>
                          {
                            report.filter(
                              (item) => item.process === it.id && item.status === taskStatuses[5]
                            ).length
                          }
                        </td>
                        <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                          <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                            Успешных:
                          </span>
                          {
                            report.filter(
                              (item) => item.process === it.id && item.status === taskStatuses[2]
                            ).length
                          }
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Boss
