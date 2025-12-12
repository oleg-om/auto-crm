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
  const [workDayData, setWorkDayData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('table')

  useEffect(() => {
    dispatch(getPositions())
    dispatch(getEmployees())
  }, [dispatch])

  const loadEntries = useCallback(async () => {
    if (!selectedEmployeeId || !selectedDate) {
      setEntries([])
      setWorkDayData(null)
      return
    }

    setLoading(true)
    try {
      const [entriesResponse, workDayResponse] = await Promise.all([
        fetch(`/api/v1/journalEntry/employee/${selectedEmployeeId}/date/${selectedDate}`),
        fetch(`/api/v1/workDayStart/employee/${selectedEmployeeId}/date/${selectedDate}`)
      ])

      const entriesData = await entriesResponse.json()
      const workDayDataResult = await workDayResponse.json()

      setEntries(entriesData.data || [])
      setWorkDayData(workDayDataResult.data || null)
    } catch (error) {
      toast.info('Ошибка при загрузке данных', { position: toast.POSITION.BOTTOM_RIGHT })
      setEntries([])
      setWorkDayData(null)
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

  // Функция для извлечения времени из строки формата "12.12.2025 16:52"
  const extractTime = (timeString) => {
    if (!timeString) return '-'
    // Если строка содержит пробел, берем часть после пробела (время)
    const parts = timeString.split(' ')
    return parts.length > 1 ? parts[parts.length - 1] : timeString
  }

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
              <label
                htmlFor="boss-journal-date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
              <label
                htmlFor="boss-journal-employee"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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

        {/* Вкладки */}
        {selectedEmployeeId && selectedDate && (
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                type="button"
                onClick={() => setActiveTab('table')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'table'
                    ? 'border-main-600 text-main-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Таблица
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('chart')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'chart'
                    ? 'border-main-600 text-main-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                График
              </button>
            </nav>
          </div>
        )}

        {/* Контент вкладок */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-main-600 mx-auto" />
          </div>
        ) : selectedEmployeeId && selectedDate ? (
          activeTab === 'table' ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {entriesWithDutyInfo.length === 0 && !workDayData ? (
                <div className="p-8 text-center text-gray-500">Нет записей за выбранный день</div>
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
                      {workDayData && workDayData.startTime && (
                        <tr className="bg-blue-50 font-semibold">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Начало рабочего дня
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {extractTime(workDayData.startTime)}
                          </td>
                          <td
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            colSpan="3"
                          >
                            -
                          </td>
                        </tr>
                      )}
                      {entriesWithDutyInfo.map(({ duty, entries: dutyEntries }) =>
                        dutyEntries.map((entry, index) => (
                          <tr
                            key={entry.id}
                            className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                          >
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
                                  {entry.endTime ? (
                                    <span className="text-green-600 font-semibold">Выполнено</span>
                                  ) : entry.startTime ? (
                                    <span className="text-blue-600 font-semibold">В работе</span>
                                  ) : (
                                    <span className="text-gray-400">Не начато</span>
                                  )}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {entry.comment || '-'}
                            </td>
                          </tr>
                        ))
                      )}
                      {workDayData && workDayData.endTime && (
                        <tr className="bg-blue-50 font-semibold">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Завершение рабочего дня
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {extractTime(workDayData.endTime)}
                          </td>
                          <td
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            colSpan="2"
                          >
                            -
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <DutyTimelineChart
              entries={entries}
              entriesWithDutyInfo={entriesWithDutyInfo}
              workDayData={workDayData}
            />
          )
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            Выберите дату и сотрудника для просмотра обязанностей
          </div>
        )}
      </div>
    </div>
  )
}

const DutyTimelineChart = ({ entries, entriesWithDutyInfo, workDayData }) => {
  // Определяем диапазон времени для шкалы
  const getTimeInMinutes = (timeStr) => {
    if (!timeStr) return null
    // Извлекаем время из строки (может быть "HH:MM" или "DD.MM.YYYY HH:MM")
    const timePart = timeStr.includes(' ') ? timeStr.split(' ')[1] : timeStr
    const [hours, minutes] = timePart.split(':').map(Number)
    return hours * 60 + minutes
  }

  // Определяем начало и конец рабочего дня
  const workDayStartMinutes = workDayData?.startTime
    ? getTimeInMinutes(workDayData.startTime)
    : 7 * 60 // По умолчанию 7:00
  const workDayEndMinutes = workDayData?.endTime
    ? getTimeInMinutes(workDayData.endTime)
    : 22 * 60 // По умолчанию 22:00

  // Если есть обязанности, расширяем диапазон
  let minTime = workDayStartMinutes
  let maxTime = workDayEndMinutes

  entries.forEach((entry) => {
    const startMins = getTimeInMinutes(entry.startTime)
    const endMins = getTimeInMinutes(entry.endTime)
    if (startMins !== null && startMins < minTime) minTime = startMins
    if (endMins !== null && endMins > maxTime) maxTime = endMins
    if (startMins !== null && endMins === null && startMins > maxTime) maxTime = startMins
  })

  // Добавляем небольшой отступ (30 минут) с каждой стороны
  minTime = Math.max(0, minTime - 30)
  maxTime = Math.min(24 * 60, maxTime + 30)

  const totalMinutes = maxTime - minTime

  // Функция для преобразования времени в минуты от начала диапазона
  const timeToMinutes = (timeStr) => {
    const totalMins = getTimeInMinutes(timeStr)
    if (totalMins === null) return null
    return totalMins - minTime
  }

  // Функция для получения процента от общей длины шкалы
  const getPositionPercent = (minutes) => {
    if (minutes < 0) return 0
    if (minutes > totalMinutes) return 100
    return (minutes / totalMinutes) * 100
  }

  // Функция для получения ширины в процентах
  const getWidthPercent = (startMinutes, endMinutes) => {
    if (!startMinutes || !endMinutes) return 0
    const width = endMinutes - startMinutes
    return (width / totalMinutes) * 100
  }

  // Генерируем часы для шкалы в диапазоне от minTime до maxTime
  const hours = []
  const startHour = Math.floor(minTime / 60)
  const endHour = Math.ceil(maxTime / 60)
  for (let i = startHour; i <= endHour; i++) {
    hours.push(i)
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {entries.length === 0 && !workDayData ? (
        <div className="p-8 text-center text-gray-500">Нет записей за выбранный день</div>
      ) : (
        <div className="p-6">
          {/* Временная шкала */}
          <div className="relative mb-8">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              {hours.map((hour) => (
                <span key={hour}>{hour}:00</span>
              ))}
            </div>
            <div className="relative h-8 bg-gray-100 rounded">
              {/* Линии часов */}
              {hours.map((hour) => {
                const hourMinutes = hour * 60
                const position = ((hourMinutes - minTime) / totalMinutes) * 100
                return (
                  <div
                    key={hour}
                    className="absolute top-0 bottom-0 w-px bg-gray-300"
                    style={{ left: `${position}%` }}
                  />
                )
              })}
            </div>
          </div>

          {/* График обязанностей */}
          <div className="space-y-4">
            {/* Рабочий день */}
            {workDayData && workDayData.startTime && (
              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-700 mb-2">Рабочий день</div>
                <div className="relative h-12 bg-gray-50 rounded border-2 border-blue-500">
                  <div className="absolute inset-0 flex items-center px-4">
                    <span className="text-sm font-medium text-blue-700">
                      {workDayData.startTime && timeToMinutes(workDayData.startTime) !== null
                        ? `${workDayData.startTime.split(' ').pop()}`
                        : ''}
                      {workDayData.endTime && ' - '}
                      {workDayData.endTime && timeToMinutes(workDayData.endTime) !== null
                        ? `${workDayData.endTime.split(' ').pop()}`
                        : ''}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Обязанности */}
            {entriesWithDutyInfo.map(({ duty, entries: dutyEntries }) =>
              dutyEntries.map((entry) => {
                const startMinutes = timeToMinutes(entry.startTime)
                const endMinutes = timeToMinutes(entry.endTime)
                const leftPercent = startMinutes !== null ? getPositionPercent(startMinutes) : 0
                const widthPercent =
                  startMinutes !== null && endMinutes !== null
                    ? getWidthPercent(startMinutes, endMinutes)
                    : startMinutes !== null
                    ? 2
                    : 0

                return (
                  <div key={entry.id} className="mb-4">
                    <div className="text-sm font-semibold text-gray-700 mb-2">
                      {duty?.name || 'Неизвестная обязанность'}
                      {duty?.isQuantitative && (
                        <span className="ml-2 text-xs text-blue-600">
                          (Кол-во: {entry.value || '0'})
                        </span>
                      )}
                    </div>
                    <div className="relative h-12 bg-gray-50 rounded border">
                      {startMinutes !== null && (
                        <div
                          className={`absolute top-0 bottom-0 rounded flex items-center px-2 ${
                            endMinutes !== null
                              ? 'bg-green-500 text-white'
                              : 'bg-blue-500 text-white'
                          }`}
                          style={{
                            left: `${leftPercent}%`,
                            width: `${Math.max(widthPercent, 2)}%`,
                            minWidth: '40px'
                          }}
                        >
                          <div className="text-xs font-medium whitespace-nowrap">
                            {entry.startTime?.split(' ').pop() || ''}
                            {endMinutes !== null && ` - ${entry.endTime?.split(' ').pop() || ''}`}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default BossJournal
