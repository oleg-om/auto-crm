import React, { useState } from 'react'
import { REPORT_SALARY_TYPES } from './SalaryCell'

const BalanceCell = ({ data, value, prevMonthData }) => {
  const [visible, setVisible] = useState(false)

  const countAdvance = (number) => {
    const total = data?.reduce((sum, item) => sum + item.val, 0) || 0
    return Math.round(number - total)
  }

  const total = (type) =>
    prevMonthData?.filter((it) => it?.type === type)?.reduce((sum, item) => sum + item.val, 0) || 0

  return (
    <div
      className="relative inline-block "
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span className="whitespace-no-wrap">{countAdvance(value)} р.</span>

      {visible && (
        <div
          className="absolute top-full right-full mb-2 px-2 py-1 text-sm text-white bg-gray-800 rounded shadow-lg whitespace-nowrap text-left"
          style={{ bottom: '24px', right: '0', zIndex: 11, width: '180px' }}
        >
          <h3 className="font-semibold">В предыдущем месяце:</h3>
          <ul>
            <li>Авансы: {total(REPORT_SALARY_TYPES.salary)} р.</li>
            <li>Штрафы: {total(REPORT_SALARY_TYPES.fine)} р.</li>
            <li>Расходы: {total(REPORT_SALARY_TYPES.expenses)} р.</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default BalanceCell
