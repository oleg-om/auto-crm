import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { updateEmployee } from '../../../redux/reducers/employees'

const SalaryCell = ({ employeeId, currentDate, totalAdvance, setTotalAdvance }) => {
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Форматирование даты в формат "месяц.год"
  const formattedDate = (date) =>
    `${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
  const formattedDayMonthYear = (date) =>
    `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}.${date.getFullYear()}`

  // Получение списка сотрудников из Redux store
  const employeeList = useSelector((s) => s.employees.list)

  const [salariesList, setSalariesList] = useState([])
  const [otherSalaries, setOtherSalaries] = useState([])

  const getSalariesOfCurrentMonth = (sal) =>
    sal?.filter((s) => s?.month === formattedDate(currentDate)) || []

  const getSalariesOfOtherMonths = (sal) =>
    sal?.filter((s) => s?.month !== formattedDate(currentDate)) || []

  useEffect(() => {
    // Поиск сотрудника по employeeId
    const employee = employeeList.find((emp) => emp.id === employeeId)

    const salaries = employee?.salaries

    setSalariesList(getSalariesOfCurrentMonth(salaries))
    setOtherSalaries(getSalariesOfOtherMonths(salaries))
  }, [employeeId, employeeList, currentDate])

  useEffect(() => {
    setTotalAdvance(salariesList?.reduce((sum, item) => sum + Number(item.val), 0))
  }, [salariesList])

  const handleAddSalary = () => {
    setSalariesList([
      ...salariesList,
      { val: '', date: formattedDayMonthYear(new Date()), month: formattedDate(currentDate) }
    ])
  }

  const handleSalaryChange = (index, value) => {
    const updatedList = [...salariesList]
    updatedList[index] = { ...updatedList[index], val: value }
    setSalariesList(updatedList)
  }

  const handleDeleteSalary = (index) => {
    const updatedList = salariesList.filter((_, i) => i !== index)
    setSalariesList(updatedList)
  }

  const handleSave = async () => {
    dispatch(updateEmployee(employeeId, { salaries: [...otherSalaries, ...salariesList] }))
    setIsModalOpen(false)
  }

  return (
    <div className="relative" key={currentDate}>
      {/* Основная ячейка */}
      <div className="p-2 flex items-center justify-between">
        {salariesList?.length > 0 && totalAdvance ? (
          <span className="pr-2">{totalAdvance}</span>
        ) : (
          <span>-</span>
        )}
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-lg font-bold mb-4">Авансы за {formattedDate(currentDate)}</h2>

            {/* Список зарплат */}
            {salariesList.map((salary, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="number"
                  value={salary.val}
                  onChange={(e) => handleSalaryChange(index, e.target.value)}
                  className="w-24 p-1 border rounded mr-2"
                  placeholder="Сумма"
                />
                <span className="mr-2">{salary.date}</span>
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => handleDeleteSalary(index)}
                >
                  -
                </button>
              </div>
            ))}

            {/* Кнопка добавления новой зарплаты */}
            <button
              type="button"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mt-4"
              onClick={handleAddSalary}
            >
              Добавить аванс +
            </button>

            {/* Кнопки управления модальным окном */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Отмена
              </button>
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                onClick={handleSave}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

SalaryCell.propTypes = {
  employeeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  currentDate: PropTypes.instanceOf(Date).isRequired
}

export default SalaryCell
