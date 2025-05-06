import React from 'react'

const Switcher = ({ isChecked, setIsChecked, id = 'ID' }) => {
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  return (
    <>
      <label className="flex cursor-pointer select-none items-center" htmlFor={id}>
        <div className="relative">
          <input
            id={id}
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="sr-only"
          />
          <div className="block h-8 w-14 rounded-full bg-[#E5E7EB]" />
          <div className="dot absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition" />
        </div>
      </label>
    </>
  )
}

export default Switcher
