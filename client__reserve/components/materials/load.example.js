import React from 'react'

const LoadExample = () => {
  return (
    <div className="overflow-x-auto rounded-lg overflow-y-auto relative lg:my-3 mt-1 lg:shadow">
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              name
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              artikul
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              price
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              quantity
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              type
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              category
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              free
            </th>
            <th className="p-3 font-bold bg-gray-100 text-gray-600 border border-gray-300 hidden lg:table-cell">
              plus
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0">
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Название:</span>
              Вентиль PVR-32
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Артикул:</span>
              PVR-32
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Цена:</span>
              120
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Количество:</span>8
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Категория:</span>
              Вентили для легковых автомобилей
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Тип:</span>
              shinomontazh
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Акцию:</span>
              no
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Плюс:</span>
              no
            </td>
          </tr>
          <tr className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0">
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Название:</span>
              Латка унив. PU-35 (35 мм)
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Артикул:</span>
              PU-35
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Цена:</span>
              50
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Количество:</span>
              146
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Категория:</span>
              Латки универсальные
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Тип:</span>
              shinomontazh
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Акция:</span>
              yes
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Плюс:</span>
              no
            </td>
          </tr>
          <tr className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0">
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Название:</span>
              Бутылка с пенообразователем LERATON 150мл
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Артикул:</span>
              PS-002.100
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Цена:</span>
              50
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Количество:</span>
              12
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Категория:</span>
              Химия
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Тип:</span>
              moika
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-left lg:text-center border border-b block lg:table-cell relative lg:static">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Акция:</span>
              no
            </td>
            <td className="w-full lg:w-auto p-2 text-gray-800 text-center border border-b block lg:table-cell relative lg:static whitespace-no-wrap">
              <span className="lg:hidden px-2 py-1 text-xs font-bold uppercase">Плюс:</span>
              yes
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default LoadExample
