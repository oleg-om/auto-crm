import React, { useState } from 'react'
import { REPORT_SALARY_TYPES } from './SalaryCell'

const BalanceCell = ({ value }) => {
  const [visible, setVisible] = useState(false)


  return (
    <div
      className="relative inline-block "
      onMouseEnter={() => setVisible(false)}
      onMouseLeave={() => setVisible(false)}
    >
      <span className="whitespace-no-wrap">{value} р.</span>

      {visible && (
        <div
          className="absolute top-full right-full mb-2 px-2 py-1 text-sm text-white bg-gray-800 rounded shadow-lg whitespace-nowrap text-left"
          style={{ bottom: '24px', right: '0', zIndex: 11, width: '180px' }}
        >
          <h3 className="font-semibold">В предыдущем месяце:</h3>
          <ul>
            <li>Авансы: {REPORT_SALARY_TYPES.salary} р.</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default BalanceCell
