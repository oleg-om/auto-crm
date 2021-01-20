import React from 'react'

const Cars = ({ slicedCarArray }) => {
  return (
    <div className="mb-3">
      <h2 className="text-xl font-semibold mb-2">Самые популярные машины</h2>
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Авто
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Количество обращений
            </th>
          </tr>
        </thead>
        <tbody>
          {slicedCarArray.map((it) => (
            <tr
              key={it.car}
              className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0"
            >
              <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Авто:</span>
                {it.car}
              </td>
              <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">
                  Количество обращений:
                </span>
                {it.count}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Cars
