import React from 'react'

const Salary = ({ report }) => {
  const employeeArray = report
    .reduce((acc, rec) => [...acc, { employee: rec.employee }], [])
    .reduce((acc, rec) => acc.concat(rec), [])
    .reduce((acc, rec) => {
      const x = acc.find((item) => item.id === rec.id)
      if (!x) {
        return acc.concat([rec])
      }
      return acc
    }, [])

  // .reduce((thing, current) => {
  //   const x = thing.find((item) => item.id === current.id)
  //   if (!x) {
  //     return thing.concat([current])
  //   }
  //   return thing
  // }, [])

  console.log(employeeArray)
  const dateArray = report
    .reduce((thing, current) => {
      const x = thing.find(
        (item) => new Date(item.dateStart).getDate() === new Date(current.dateStart).getDate()
      )
      if (!x) {
        return thing.concat([current])
      }
      return thing
    }, [])
    .reduce((acc, rec) => [...acc, rec.dateStart], [])
    .sort(function sortVendors(a, b) {
      if (a > b) {
        return 1
      }
      if (a < b) {
        return -1
      }
      return 0
    })
  console.log(dateArray)
  return (
    <div className="mb-3">
      <h2 className="text-xl font-semibold mb-2">Зарплаты</h2>
      <h3>Модуль находится в разработке</h3>
      {/* {dateArray.map((date) => (
        <div key={date}>
          <h3 key={date}>
            {new Date(date).getDate()}.{new Date(date).getMonth() + 1}.
            {new Date(date).getFullYear()}
          </h3>
          <table className="border-collapse w-full" key={date}>
            <thead>
              <tr>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Имя
                </th>
                <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  Всего заказов принято
                </th>
              </tr>
            </thead>
            <tbody>
              {report
                .filter((it) => new Date(it.dateStart).getDate() === new Date(date).getDate())
                .map((it) => (
                  <tr
                    key={it.id}
                    className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0"
                  >
                    <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                      <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Имя:</span>
                      {it.employee
                        .reduce((acc, rec) => acc.concat(rec), [])
                        .reduce((acc, rec) => {
                          const x = acc.find((item) => item.id === rec.id)
                          if (!x) {
                            return acc.concat([rec])
                          }
                          return acc
                        }, [])
                        .map((man) => (
                          <p key={man.id}>
                            {man.name} {man.surname}
                          </p>
                        ))}
                    </td>
                    <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                      <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                        Всего заказов принято:
                      </span>
                      {report.filter((item) => item.employee === it.id).length}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))} */}
    </div>
  )
}

export default Salary
