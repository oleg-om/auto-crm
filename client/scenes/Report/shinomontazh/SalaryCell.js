import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { createEmployeeData, deleteEmployeeData } from '../../../redux/reducers/employees'

export const salaryFormattedDate = (date) =>
  `${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`

export const REPORT_SALARY_TYPES = {
  salary: 'salary',
  fine: 'fine',
  expenses: 'expenses',
  personalExpenses: 'personalExpenses'
}

const STATUSES = {
  new: 'new',
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
  const [updatedPayments, setUpdatedPayments] = useState([])

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
    if (isModalOpen) {
      fetch(`/api/v1/employeereportsingle/${employeeId}`)
        .then((r) => r.json())
        .then((d) => {
          if (d?.data) {
            setUpdatedPayments(d.data)
          }
        })
    } else if (!updatedPayments?.length) {
      setUpdatedPayments(payments)
    }
  }, [isModalOpen])

  useEffect(() => {
    setSalariesList(getSalariesOfCurrentMonth(updatedPayments.filter((s) => s.type === data.type)))
  }, [payments, updatedPayments])

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

    setSalariesList(
      salariesList.map((s) => {
        if (s?.status === STATUSES.edit) {
          return { ...s, status: STATUSES.new }
        }
        return s
      })
    )

    setDeletedList([])

    setIsModalOpen(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''

    const [year, month, day] = dateString.split('-')

    return dayjs(`${year}-${month}-${day}`).format('DD.MM.YYYY')
  }

  const formatDateToValue = (dateString) => {
    if (!dateString) return ''

    const [day, month, year] = dateString.split('.')

    return dayjs(`${year}-${month}-${day}`).format('YYYY-MM-DD')
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
                <input
                  type="date"
                  className="mr-2"
                  value={formatDateToValue(salary.date)}
                  name="date"
                  onChange={(e) => {
                    handleSalaryChange(index, {
                      name: 'date',
                      value: formatDate(e.target.value)
                    })
                  }}
                />

                <input
                  type="text"
                  value={salary.comment}
                  onChange={(e) => handleSalaryChange(index, e.target)}
                  className="w-24 p-1 border rounded mr-2"
                  placeholder="Комментарий"
                  name="comment"
                  style={{ width: '300px' }}
                />
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
