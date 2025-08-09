import React from 'react'
import OilIcon from '../icons/oil'
import OilBottleIcon from '../icons/oilBottle'
import PersonIcon from '../icons/person'
import ShopIocon from '../icons/shop'

const purchasedFromUsOptions = [
  {
    name: 'Куплено у нас',
    value: true,
    icon: <ShopIocon />
  },
  {
    name: 'Принес клиент',
    value: false,
    icon: <PersonIcon />
  }
]

const bottledOilOptions = [
  {
    name: 'Канистра',
    value: true,
    icon: <OilBottleIcon />
  },
  {
    name: 'Разливное',
    value: false,
    icon: <OilIcon />
  }
]

const ToggleSwitchOption = ({ name, value, inputName, onChange, stateValue, icon }) => {
  const onRadioChange = (e) => {
    const newEvent = {
      target: {
        name: inputName,
        value: e.target.value === 'true'
      }
    }

    return onChange(newEvent)
  }

  return (
    <button
      className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
      value={value}
      type="button"
      onClick={onRadioChange}
      onKeyDown={onRadioChange}
    >
      <div className="flex items-center pl-3 pointer-events-none whitespace-nowrap">
        <input
          id="horizontal-list-radio-license"
          type="radio"
          checked={stateValue === value}
          onChange={onRadioChange}
          className="w-4 h-4 text-main-600 bg-gray-100 border-gray-300 focus:ring-main-500 dark:focus:ring-main-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
        />
        <label
          htmlFor="horizontal-list-radio-license"
          className="mr-auto py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 text-left"
        >
          {name}
        </label>
        {icon}
      </div>
    </button>
  )
}
const ToggleSwitch = ({ title, options, inputName, stateValue, onChange }) => {
  return (
    <div className="mt-3">
      <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-center"
        htmlFor={inputName}
      >
        {title}
      </label>
      <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        {options.map((option) => (
          <ToggleSwitchOption
            key={option.name}
            name={option.name}
            value={option.value}
            inputName={inputName}
            onChange={onChange}
            stateValue={stateValue}
            icon={option.icon}
          />
        ))}
      </ul>
    </div>
  )
}

const OilType = ({ state, onChange }) => {
  return (
    <div className="bg-gray-400 p-2 mt-3 rounded">
      <ToggleSwitch
        title="Масло"
        options={purchasedFromUsOptions}
        inputName="purchasedFromUs"
        onChange={onChange}
        stateValue={state?.purchasedFromUs}
      />
      <ToggleSwitch
        title="Емкость"
        options={bottledOilOptions}
        inputName="bottledOil"
        onChange={onChange}
        stateValue={state?.bottledOil}
      />
    </div>
  )
}

export default OilType
