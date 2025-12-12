import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import Navbar from '../Navbar'
import { getPositions } from '../../redux/reducers/positions'
import { getEmployees } from '../../redux/reducers/employees'
import 'react-toastify/dist/ReactToastify.css'

const BossJournal = () => {
  toast.configure()

  const dispatch = useDispatch()
  const employees = useSelector((s) => s.employees.list)
  const positions = useSelector((s) => s.positions.list)

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(getPositions())
    dispatch(getEmployees())
  }, [dispatch])

  const loadEntries = useCallback(async () => {
    if (!selectedEmployeeId || !selectedDate) {
      setEntries([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `/api/v1/journalEntry/employee/${selectedEmployeeId}/date/${selectedDate}`
      )
      const { data } = await response.json()
      setEntries(data || [])
    } catch (error) {
      toast.info('Ошибка при загрузке данных', { position: toast.POSITION.BOTTOM_RIGHT })
      setEntries([])
    } finally {
      setLoading(false)
    }
  }, [selectedEmployeeId, selectedDate])

  useEffect(() => {
    if (selectedEmployeeId && selectedDate) {
      loadEntries()
    } else {
      setEntries([])
    }
  }, [selectedDate, selectedEmployeeId, loadEntries])

  const selectedEmployee = employees.find((emp) => emp.id === selectedEmployeeId)
  const { positionId } = selectedEmployee || {}
  const selectedPosition = positionId ? positions.find((p) => p.id === positionId) : null

  // Группируем записи по обязанностям
  const groupedEntries = entries.reduce((acc, entry) => {
    const { dutyId } = entry
    if (!acc[dutyId]) {
      acc[dutyId] = []
    }
    acc[dutyId].push(entry)
    return acc
  }, {})

  // Получаем информацию об обязанностях
  const entriesWithDutyInfo = Object.entries(groupedEntries).map(([dutyId, dutyEntries]) => {
    const duty = selectedPosition?.duties?.find((d) => d._id.toString() === dutyId)
    return {
      duty,
      dutyId,
      entries: dutyEntries
    }
  })

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 mb-4">
        <h1 className="text-3xl py-4 border-b mb-6">Электронный журнал (босс)</h1>

        {/* Фильтры */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="boss-journal-date" className="block text-sm font-medium text-gray-700 mb-2">
                Дата
              </label>
              <input
                id="boss-journal-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main-600"
              />
            </div>
            <div>
              <label htmlFor="boss-journal-employee" className="block text-sm font-medium text-gray-700 mb-2">
                Сотрудник
              </label>
              <select
                id="boss-journal-employee"
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main-600"
              >
                <option value="">Выберите сотрудника</option>
                {employees
                  .filter((emp) => emp.positionId)
                  .map((emp) => {
                    const position = positions.find((p) => p.id === emp.positionId)
                    return (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} {emp.surname} {position ? `(${position.name})` : ''}
                      </option>
                    )
                  })}
              </select>
            </div>
          </div>
        </div>

        {/* Таблица */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-main-600 mx-auto" />
          </div>
        ) : selectedEmployeeId && selectedDate ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {entriesWithDutyInfo.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Нет записей за выбранный день
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Обязанность
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Начало
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Окончание
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Количество/Статус
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Комментарий
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {entriesWithDutyInfo.map(({ duty, entries: dutyEntries }) =>
                      dutyEntries.map((entry, index) => (
                        <tr key={entry.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {duty?.name || 'Неизвестная обязанность'}
                            </div>
                            {duty?.isQuantitative && (
                              <div className="text-xs text-blue-600">Количественная</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {entry.startTime || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {entry.endTime || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {duty?.isQuantitative ? (
                              <span className="font-semibold">{entry.value || '0'}</span>
                            ) : (
                              <span>
                                {entry.value === true || entry.value === 'true'
                                  ? 'Выполнено'
                                  : 'Не выполнено'}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {entry.comment || '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            Выберите дату и сотрудника для просмотра обязанностей
          </div>
        )}
      </div>
    </div>
  )
}

export default BossJournal

