import React from 'react'

const Oil = ({ reportOil, placeList, razvalStatuses }) => {
  return (
    <div className="mb-3">
      <h2 className="text-xl font-semibold mb-2">Замена масла</h2>
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Адрес
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Всего записей
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Новые
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Не выполненные
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Успешных
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Перенаправлено на другие точки
            </th>
          </tr>
        </thead>
        <tbody>
          {placeList
            .filter((it) => it.oil === 'true')
            .map((it) => (
              <tr
                key={it.name}
                className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0"
              >
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Адрес:</span>
                  {it.name}
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                    Всего записей:
                  </span>
                  {reportOil.filter((item) => item.place === it.id).length}
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Новые:</span>
                  {
                    reportOil.filter(
                      (item) => item.place === it.id && item.status === razvalStatuses[0]
                    ).length
                  }
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                    Не выполненные:
                  </span>
                  {
                    reportOil.filter(
                      (item) =>
                        item.place === it.id &&
                        (item.status === razvalStatuses[2] ||
                          item.status === razvalStatuses[3] ||
                          item.status === razvalStatuses[4])
                    ).length
                  }
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Успешных:</span>
                  {
                    reportOil.filter(
                      (item) => item.place === it.id && item.status === razvalStatuses[1]
                    ).length
                  }
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                  <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                    Перенаправлено на другие точки:
                  </span>
                  {
                    reportOil.filter(
                      (item) => item.employeeplace === it.id && item.employeeplace !== item.place
                    ).length
                  }
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default Oil
