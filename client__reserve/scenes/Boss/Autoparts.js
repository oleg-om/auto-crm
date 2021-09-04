import React from 'react'
import autopartStatuses from '../../lists/autoparts-statuses'

const Autoparts = ({ employeeList, report, taskStatuses }) => {
  const userReport = (userId) => report.filter((item) => item.process === userId)

  const averageBill = (userId) =>
    report
      .filter((item) => item.process === userId)
      .reduce((a, b) => [...a, b.order], [])
      .map((k) =>
        k
          .filter(
            (e) =>
              e.price &&
              e.quantity &&
              (e.stat === autopartStatuses[0] ||
                e.stat === autopartStatuses[1] ||
                e.stat === autopartStatuses[3])
          )
          .reduce(function fullPrice(acc, rec) {
            if (rec.price && rec.quantity)
              if (rec.price.match(/[0-9]/) && rec.quantity.match(/[0-9]/)) {
                return [...acc, rec.price * rec.quantity]
              }
            return acc
          }, [])
          .reduce((a, b) => a + b, 0)
      )
      .reduce((a, b) => a + b, 0) / userReport(userId).length

  const billFixed = (userId) => (averageBill(userId) ? averageBill(userId).toFixed() : 0)

  const inStockNumber = (userId) =>
    report
      .filter((item) => item.process === userId)
      .reduce((a, b) => [...a, b.order], [])
      .map((k) =>
        k.filter(
          (e) => e.price && e.quantity && e.stat === autopartStatuses[3] && e.vendor === 'instock'
        )
      )
      .filter((it) => it.length > 0).length

  return (
    <div className="mb-3">
      <h2 className="text-xl font-semibold mb-2">Автозапчасти</h2>
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Имя
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Всего заказов принято
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              В работе
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Обработано своих заказов
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Обработано чужих заказов
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Отказов
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Успешных
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Продано товаров по наличию
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Средний чек
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
                key={it.id}
                className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0"
              >
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Имя:</span>
                  {it.name} {it.surname}
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                    Всего заказов принято:
                  </span>
                  {report.filter((item) => item.employee === it.id).length}
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">В работе:</span>
                  {
                    report.filter(
                      (item) => item.process === it.id && item.status === taskStatuses[1]
                    ).length
                  }
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                    Обработано своих заказов:
                  </span>
                  {report.filter((item) => item.process === it.id).length}
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                    Обработано чужих заказов:
                  </span>
                  {
                    report.filter(
                      (item) => item.process === it.id && item.process !== item.employee
                    ).length
                  }
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Отказов:</span>
                  {
                    report.filter(
                      (item) => item.process === it.id && item.status === taskStatuses[5]
                    ).length
                  }
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Успешных:</span>
                  {
                    report.filter(
                      (item) => item.process === it.id && item.status === taskStatuses[2]
                    ).length
                  }
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                    Продано товаров по наличию:
                  </span>
                  {inStockNumber(it.id)}
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                    Средний чек:
                  </span>
                  {billFixed(it.id)} руб.
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default Autoparts
