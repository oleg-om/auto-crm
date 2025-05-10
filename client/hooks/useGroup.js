import React, { useState } from 'react'
// import cx from 'classnames'

export function useGroup(propsGroupCount = 1) {
  const [group, setGroup] = useState(1)
  const [groupCount, setGroupCount] = useState(propsGroupCount)

  const onChangeGroup = (number) => {
    setGroup(number)
  }

  return { group, onChangeGroup, groupCount, setGroupCount }
}

export const GroupSwitch = ({
  groupCount,
  group,
  onChangeGroup,
  employees,
  dateEnd,
  setGroupCount
}) => {
  const [hoveredTab, setHoveredTab] = useState(null)

  if (!groupCount || groupCount === 1) {
    return (
      <GroupAdd
        groupCount={groupCount}
        setGroupCount={setGroupCount}
        dateEnd={dateEnd}
        employees={employees}
      />
    )
  }

  return (
    <div className="w-full max-w-md mx-auto relative">
      {/* Вкладки */}
      <div className="flex border-b border-gray-300 relative justify-center">
        <div
          className="relative"
          onMouseEnter={() => setHoveredTab('tab1')}
          onMouseLeave={() => setHoveredTab(null)}
        >
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium focus:outline-none ${
              group === 1 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
            }`}
            onClick={() => onChangeGroup(1)}
          >
            Группа 1
          </button>

          {/* Всплывающее меню */}
          {hoveredTab === 'tab1' && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 shadow-lg z-10">
              <ul className="text-sm text-gray-800 divide-y divide-gray-100">
                {employees
                  .filter((it) => it?.group === 1)
                  .map((it, index) => (
                    <li key={index} className="px-4 py-2 hover:bg-gray-100">
                      {it.name} {it.surname}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
        <div
          className="relative"
          onMouseEnter={() => setHoveredTab('tab2')}
          onMouseLeave={() => setHoveredTab(null)}
        >
          <button
            type="button"
            className={`px-4 py-2 ml-2 text-sm font-medium focus:outline-none ${
              group === 2 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
            }`}
            onClick={() => onChangeGroup(2)}
          >
            Группа 2
          </button>

          {/* Всплывающее меню */}
          {hoveredTab === 'tab2' && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 shadow-lg z-10">
              <ul className="text-sm text-gray-800 divide-y divide-gray-100">
                {employees
                  .filter((it) => it?.group === 2)
                  .map((it, index) => (
                    <li key={index} className="px-4 py-2 hover:bg-gray-100">
                      {it.name} {it.surname}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const GroupAdd = ({ groupCount, setGroupCount, dateEnd, employees }) => {
  const [hoveredTab, setHoveredTab] = useState(false)

  if (groupCount !== 1) {
    return null
  }

  const addGroup = () => {
    if (!dateEnd) {
      setGroupCount(2)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto relative">
      {/* Вкладки */}
      <div className="flex border-b border-gray-300 relative justify-center">
        <div className="relative">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium focus:outline-none border-b-2 border-blue-500 text-blue-600"
            onClick={addGroup}
            onMouseEnter={() => setHoveredTab(true)}
            onMouseLeave={() => setHoveredTab(false)}
          >
            Группа 1
          </button>
          {hoveredTab && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 shadow-lg z-10">
              <ul className="text-sm text-gray-800 divide-y divide-gray-100">
                {employees.map((it, index) => (
                  <li key={index} className="px-4 py-2 hover:bg-gray-100">
                    {it.name} {it.surname}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {dateEnd ? null : (
          <div className="relative">
            <button
              type="button"
              className="px-4 py-2 ml-2 text-sm font-medium focus:outline-none text-gray-600"
              onClick={addGroup}
            >
              Добавить группу +
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export const employeeFilteredByGroup = (it, group) => it?.group === group

export const ChosenServices = ({ name, groupCount, data }) => {
  return (
    <div className="px-3 my-3 md:mb-0 w-full">
      <label
        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
        htmlFor="grid-first-name"
      >
        {name}
      </label>
      {groupCount === 1 ? (
        <div className="w-full p-3">
          {data.map((it) => (
            <p key={it.id}>
              {it.name}, {it.price} руб, {it.quantity} шт.
            </p>
          ))}
        </div>
      ) : (
        <div className="w-full p-3">
          <p className="text-grey-darker text-xs font-bold">Группа 1:</p>
          {data
            .filter((it) => it?.group === 1)
            .map((it) => (
              <p key={it.id}>
                {it.name}, {it.price} руб, {it.quantity} шт.
              </p>
            ))}
          <p className="text-grey-darker text-xs font-bold mt-3">Группа 2:</p>
          {data
            .filter((it) => it?.group === 2)
            .map((it) => (
              <p key={it.id}>
                {it.name}, {it.price} руб, {it.quantity} шт.
              </p>
            ))}
        </div>
      )}
    </div>
  )
}

export function splitGroupedObjects(dataArray) {
  const result = []

  dataArray.forEach((item) => {
    if (item.groupCount === 2) {
      ;[1, 2].forEach((groupNumber) => {
        const newItem = { ...item }

        // Клонируем массивы, фильтруя по группе
        newItem.employee = (item.employee || []).filter((e) => e.group === groupNumber)
        newItem.services = (item.services || []).filter((s) => s.group === groupNumber)
        newItem.material = (item.material || []).filter((m) => m.group === groupNumber)

        // Обновляем groupCount на 1, потому что это один из двух
        newItem.groupCount = 1

        // Можно добавить поле, чтобы понимать какая это группа (опционально)
        newItem.group = groupNumber

        result.push(newItem)
      })
    } else {
      result.push(item)
    }
  })

  return result
}
