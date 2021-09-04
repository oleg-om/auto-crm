import React from 'react'

const Vendors = ({ employeeList, report }) => {
  const averageBill = report
    .reduce((a, b) => [...a, b.order], [])
    .filter((it) => it.length > 0)
    .map((k) => k.filter((it) => it.vendor).map((it) => ({ car: it.vendor })))
    .reduce((acc, rec) => [...acc.concat(rec)], [])
    .reduce((acc, rec) => Object.assign(acc, { [rec.car]: (acc[rec.car] || 0) + 1 }), {})

  const slicedCarArray = Object.keys(averageBill)
    .map(function (key) {
      return { car: key, count: averageBill[key] }
    })
    .sort(function (a, b) {
      return b.count - a.count
    })

  const topVendor = (userId) =>
    report
      .filter((it) => it.process === userId)
      .reduce((a, b) => [...a, b.order], [])
      .filter((it) => it.length > 0)
      .map((k) => k.filter((it) => it.vendor).map((it) => ({ car: it.vendor })))
      .reduce((acc, rec) => [...acc.concat(rec)], [])
      .reduce((acc, rec) => Object.assign(acc, { [rec.car]: (acc[rec.car] || 0) + 1 }), {})

  const topVendorsArray = (userId) =>
    Object.keys(topVendor(userId))
      .map(function (key) {
        return { car: key, count: topVendor(userId)[key] }
      })
      .sort(function (a, b) {
        return b.count - a.count
      })

  return (
    <div>
      <div className="mb-3">
        <h2 className="text-xl font-semibold mb-2">Поставщики - общая статистика</h2>
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="lg:w-1/3 p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                Поставщик
              </th>
              <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                Общее количество заказов
              </th>
            </tr>
          </thead>
          <tbody>
            {slicedCarArray.map((it) => (
              <tr
                key={it.car}
                className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0"
              >
                <td className="w-full lg:w-1/3 p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                    Поставщик:
                  </span>
                  {it.car !== 'instock' ? it.car : 'В наличии'}
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                    Общее количество заказов:
                  </span>
                  {it.count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {employeeList
        .filter(
          (it) =>
            it.role.includes('Обработка заказов (запчасти)') && topVendorsArray(it.id).length >= 1
        )
        .map((item) => (
          <div key={item.id}>
            <div className="mb-3">
              <h2 className="text-xl font-semibold mb-2">
                Поставщики - {item.name} {item.surname}
              </h2>
              <table className="border-collapse w-full">
                <thead>
                  <tr>
                    <th className="lg:w-1/3 p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      Поставщик
                    </th>
                    <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      Количество заказов
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topVendorsArray(item.id).map((it) => (
                    <tr
                      key={it.car}
                      className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0"
                    >
                      <td className="w-full lg:w-1/3 p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                          Поставщик:
                        </span>
                        {it.car !== 'instock' ? it.car : 'В наличии'}
                      </td>
                      <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                        <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                          Общее количество заказов:
                        </span>
                        {it.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
    </div>
  )
}

export default Vendors
