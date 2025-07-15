import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { createEmployeeData, deleteEmployeeData } from '../../../redux/reducers/employees'

export const salaryFormattedDate = (date) =>
  `${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`

export const REPORT_SALARY_TYPES = {
  salary: 'salary',
  fine: 'fine',
  expenses: 'expenses'
}

const STATUSES = {
  edit: 'edit'
}

const SalaryCell = ({
  data = {
    name: 'Авансы',
    singleName: 'аванс',
    type: REPORT_SALARY_TYPES.salary
  },
  employeeId,
  currentDate,
  totalAdvance,
  setTotalAdvance,
  payments = []
}) => {
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Форматирование даты в формат "месяц.год"

  const formattedDayMonthYear = (date) =>
    `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}.${date.getFullYear()}`

  const [salariesList, setSalariesList] = useState([])
  const [deletedList, setDeletedList] = useState([])

  const getSalariesOfCurrentMonth = (sal) =>
    sal?.filter((s) => s?.month === salaryFormattedDate(currentDate)) || []

  useEffect(() => {
    setSalariesList(getSalariesOfCurrentMonth(payments.filter((s) => s.type === data.type)))
  }, [payments])

  useEffect(() => {
    setTotalAdvance(
      salariesList
        ?.filter((s) => s?.type === data.type)
        ?.reduce((sum, item) => sum + Number(item.val), 0)
    )
  }, [salariesList])

  const handleAddSalary = () => {
    setSalariesList([
      ...salariesList,
      {
        val: '',
        date: formattedDayMonthYear(new Date()),
        month: salaryFormattedDate(currentDate),
        employeeId,
        type: data.type
      }
    ])
  }

  const handleSalaryChange = (index, target) => {
    const updatedList = [...salariesList]
    updatedList[index] = {
      ...updatedList[index],
      [target.name]: target.value,
      status: STATUSES.edit
    }
    setSalariesList(updatedList)
  }

  const handleDeleteSalary = (index) => {
    setDeletedList([...deletedList, salariesList.find((_, i) => i === index)])
    const updatedList = salariesList.filter((_, i) => i !== index)

    setSalariesList(updatedList)
  }

  const handleSave = async () => {
    salariesList
      .filter((s) => s?.status === STATUSES.edit)
      .map((s) => dispatch(createEmployeeData(s)))
    deletedList.map((s) => dispatch(deleteEmployeeData(s?._id)))

    setIsModalOpen(false)
  }

  const withComment = data.type !== REPORT_SALARY_TYPES.salary

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
            <h2 className="text-lg font-bold mb-4">
              {data.name} за {salaryFormattedDate(currentDate)}
            </h2>

            {/* Список зарплат */}
            {salariesList.map((salary, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="number"
                  value={salary.val}
                  onChange={(e) => handleSalaryChange(index, e.target)}
                  className="w-24 p-1 border rounded mr-2"
                  placeholder="Сумма"
                  name="val"
                />
                <span className="mr-2">{salary.date}</span>
                {withComment ? (
                  <input
                    type="text"
                    value={salary.comment}
                    onChange={(e) => handleSalaryChange(index, e.target)}
                    className="w-24 p-1 border rounded mr-2"
                    placeholder="Комментарий"
                    name="comment"
                    style={{ width: '300px' }}
                  />
                ) : null}
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
              Добавить {data.singleName} +
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
