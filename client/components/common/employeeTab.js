import cx from 'classnames'
import React from 'react'

const EmployeeTab = ({ changeStep, active }) => {
  return (
    <div className="w-1/5 p-2 relative">
      <button
        type="button"
        className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden relative', {
          block: active !== 'employee',
          'border-b-8 border-main-400': active === 'employee'
        })}
        onClick={() => changeStep('employee')}
      >
        Исполнители
      </button>
    </div>
  )
}

export default EmployeeTab
