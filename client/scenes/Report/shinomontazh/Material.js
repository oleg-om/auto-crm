import React from 'react'
import { useSelector } from 'react-redux'
import ExportCSV from '../../../components/excel'
import { filterReportByEmployee } from '../../../utils/admin/reportUtils'

const Material = ({ report }) => {
  const currentEmployee = useSelector((s) => s.employees.employee)

  const materialNums = report
    .filter((it) => filterReportByEmployee(it, currentEmployee))
    .reduce((acc, rec) => [...acc, rec.material], [])
    .reduce((acc, rec) => acc.concat(rec), [])
    .reduce((acc, rec) => {
      const x = acc.find((item) => item.name === rec.name)
      if (!x) {
        return [...acc, rec]
      }
      return [
        { name: x.name, quantity: x.quantity + rec.quantity, price: x.price, free: x.free },
        ...acc.filter((it) => it.name !== rec.name)
      ]
    }, [])

  const toExcel = (items) => {
    if (items) {
      return items.reduce((acc, rec) => {
        return [
          ...acc,
          {
            Название: rec.name,
            Акционный: rec.free === 'yes' ? 'Да' : 'Нет',
            Цена: rec.price,
            'Кол-во': rec.quantity,
            Сумма: rec.price * rec.quantity
          }
        ]
      }, [])
    }
    return []
  }

  return (
    <div className="mb-3">
      <h2 className="text-xl font-semibold mb-2">Материалы</h2>
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Название
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Количество
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Цена
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Сумма
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Акция
            </th>
          </tr>
        </thead>
        <tbody>
          {materialNums.map((it) => (
            <tr
              key={it.name}
              className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0"
            >
              <td className="w-full lg:w-auto p-2 text-gray-800 text-left border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Название:</span>
                {it.name}
              </td>
              <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Количество:</span>
                {it.quantity}
              </td>
              <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Цена:</span>
                {it.price}
              </td>
              <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Сумма:</span>
                {it.price * it.quantity}
              </td>
              <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Акция:</span>
                {it.free === 'yes' ? 'Да' : 'Нет'}
              </td>
            </tr>
          ))}
          {!materialNums?.length ? <span>Материалы не найдены</span> : null}
        </tbody>
      </table>
      <ExportCSV csvData={toExcel(materialNums)} fileName="материалы" />
    </div>
  )
}

export default Material
