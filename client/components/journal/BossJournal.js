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
  const [activeTab, setActiveTab] = useState('table') // 'table', 'chart', 'kpi'

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

  // Функция для извлечения времени из Date или строки
  const extractTime = (timeValue) => {
    if (!timeValue) return '-'
    // Если это Date объект или строка ISO
    const date = typeof timeValue === 'string' ? new Date(timeValue) : timeValue
    if (date instanceof Date && !Number.isNaN(date.getTime())) {
      // Форматируем Date в "HH:MM"
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }
    // Если это старая строка формата "DD.MM.YYYY HH:MM" или "HH:MM"
    if (typeof timeValue === 'string') {
      const parts = timeValue.split(' ')
      return parts.length > 1 ? parts[parts.length - 1] : timeValue
    }
    return timeValue
  }

  // Функция для преобразования времени в минуты (HH:MM -> минуты от начала дня)
  const timeStringToMinutes = (timeStr) => {
    if (!timeStr) return null
    const [hours, minutes] = timeStr.split(':').map(Number)
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
    return hours * 60 + minutes
  }

  // Функция для проверки, превышает ли фактическое время норму
  const checkWorkTimeViolation = (actualTime, normTime, isStart) => {
    if (!actualTime || !normTime) return false
    const actualMinutes = timeStringToMinutes(extractTime(actualTime))
    const normMinutes = timeStringToMinutes(normTime)
    if (actualMinutes === null || normMinutes === null) return false
    // Для начала: фактическое > нормы (начал позже)
    // Для конца: фактическое < нормы (закончил раньше)
    return isStart ? actualMinutes > normMinutes : actualMinutes < normMinutes
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
              <button
                type="button"
                onClick={() => setActiveTab('kpi')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'kpi'
                    ? 'border-main-600 text-main-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                КПД
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
                          Чек-лист
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Норма/Факт
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Комментарий
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {workDayData && workDayData.startTime && (
                        <tr
                          className={`font-semibold ${
                            selectedPosition?.workDayStartTime &&
                            checkWorkTimeViolation(
                              workDayData.startTime,
                              selectedPosition.workDayStartTime,
                              true
                            )
                              ? 'bg-red-50'
                              : 'bg-blue-50'
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Начало рабочего дня
                            {selectedPosition?.workDayStartTime && (
                              <div className="text-xs font-normal text-gray-500 mt-1">
                                Норма: {selectedPosition.workDayStartTime}
                              </div>
                            )}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              selectedPosition?.workDayStartTime &&
                              checkWorkTimeViolation(
                                workDayData.startTime,
                                selectedPosition.workDayStartTime,
                                true
                              )
                                ? 'text-red-600 font-bold'
                                : 'text-gray-900'
                            }`}
                          >
                            {extractTime(workDayData.startTime)}
                          </td>
                          <td
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            colSpan="4"
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
                              {extractTime(entry.startTime)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {extractTime(entry.endTime)}
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {duty?.hasChecklist && duty?.checklistItems?.length > 0
                                ? (() => {
                                    const checklistProgress = entry.checklistProgress || {}
                                    const completed = duty.checklistItems.filter(
                                      (item) => checklistProgress[item._id]
                                    ).length
                                    const total = duty.checklistItems.length
                                    return (
                                      <span className="text-purple-700 font-semibold">
                                        {completed}/{total}
                                      </span>
                                    )
                                  })()
                                : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(() => {
                                // Вычисляем фактическое время выполнения
                                let actualTimeMinutes = null
                                if (entry.startTime && entry.endTime) {
                                  const startDate =
                                    typeof entry.startTime === 'string'
                                      ? new Date(entry.startTime)
                                      : entry.startTime
                                  const endDate =
                                    typeof entry.endTime === 'string'
                                      ? new Date(entry.endTime)
                                      : entry.endTime

                                  if (
                                    startDate instanceof Date &&
                                    !Number.isNaN(startDate.getTime()) &&
                                    endDate instanceof Date &&
                                    !Number.isNaN(endDate.getTime())
                                  ) {
                                    actualTimeMinutes =
                                      (endDate.getTime() - startDate.getTime()) / (1000 * 60)
                                  }
                                }

                                // Для количественных обязанностей используем полное время
                                const totalTime = actualTimeMinutes
                                let totalNorm = duty?.completionTimeMinutes

                                if (duty?.isQuantitative && entry.value) {
                                  const quantity = Number(entry.value) || 1
                                  // Для нормы: норма на единицу * количество
                                  if (totalNorm !== null && totalNorm !== undefined) {
                                    totalNorm *= quantity
                                  }
                                  // Для факта: полное время (не делим на количество)
                                }

                                // Формируем текст
                                if (!totalNorm && !totalTime) {
                                  return '-'
                                }

                                const normText = totalNorm
                                  ? `${Math.round(totalNorm)} мин`
                                  : '-'
                                const factText = totalTime !== null ? `${Math.round(totalTime)} мин` : '-'

                                const exceedsNorm =
                                  totalNorm !== null &&
                                  totalNorm !== undefined &&
                                  totalTime !== null &&
                                  totalTime > totalNorm

                                return (
                                  <span>
                                    {normText !== '-' && (
                                      <span
                                        className={exceedsNorm ? 'text-red-600 font-semibold' : ''}
                                      >
                                        {normText}
                                      </span>
                                    )}
                                    {normText !== '-' && factText !== '-' && ' / '}
                                    {factText !== '-' && (
                                      <span
                                        className={exceedsNorm ? 'text-red-600 font-semibold' : ''}
                                      >
                                        {factText}
                                      </span>
                                    )}
                                  </span>
                                )
                              })()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {entry.comment || '-'}
                            </td>
                          </tr>
                        ))
                      )}
                      {workDayData && workDayData.endTime && (
                        <tr
                          className={`font-semibold ${
                            selectedPosition?.workDayEndTime &&
                            checkWorkTimeViolation(
                              workDayData.endTime,
                              selectedPosition.workDayEndTime,
                              false
                            )
                              ? 'bg-red-50'
                              : 'bg-blue-50'
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Завершение рабочего дня
                            {selectedPosition?.workDayEndTime && (
                              <div className="text-xs font-normal text-gray-500 mt-1">
                                Норма: {selectedPosition.workDayEndTime}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              selectedPosition?.workDayEndTime &&
                              checkWorkTimeViolation(
                                workDayData.endTime,
                                selectedPosition.workDayEndTime,
                                false
                              )
                                ? 'text-red-600 font-bold'
                                : 'text-gray-900'
                            }`}
                          >
                            {extractTime(workDayData.endTime)}
                          </td>
                          <td
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            colSpan="4"
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
          ) : activeTab === 'chart' ? (
            <DutyTimelineChart
              entries={entries}
              entriesWithDutyInfo={entriesWithDutyInfo}
              workDayData={workDayData}
              selectedPosition={selectedPosition}
            />
          ) : (
            <KPIView entriesWithDutyInfo={entriesWithDutyInfo} workDayData={workDayData} />
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

const DutyTimelineChart = ({ entries, entriesWithDutyInfo, workDayData, selectedPosition }) => {
  const [tooltip, setTooltip] = useState({ entryId: null, text: '', x: 0, y: 0 })

  // Функция для извлечения времени из Date или строки
  const extractTime = (timeValue) => {
    if (!timeValue) return '-'
    // Если это Date объект или строка ISO
    const date = typeof timeValue === 'string' ? new Date(timeValue) : timeValue
    if (date instanceof Date && !Number.isNaN(date.getTime())) {
      // Форматируем Date в "HH:MM"
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }
    // Если это старая строка формата "DD.MM.YYYY HH:MM" или "HH:MM"
    if (typeof timeValue === 'string') {
      const parts = timeValue.split(' ')
      return parts.length > 1 ? parts[parts.length - 1] : timeValue
    }
    return timeValue
  }

  // Функция для преобразования времени в минуты (HH:MM -> минуты от начала дня)
  const timeStringToMinutes = (timeStr) => {
    if (!timeStr) return null
    const [hours, minutes] = timeStr.split(':').map(Number)
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
    return hours * 60 + minutes
  }

  // Функция для проверки, превышает ли фактическое время норму
  const checkWorkTimeViolation = (actualTime, normTime, isStart) => {
    if (!actualTime || !normTime) return false
    const actualMinutes = timeStringToMinutes(extractTime(actualTime))
    const normMinutes = timeStringToMinutes(normTime)
    if (actualMinutes === null || normMinutes === null) return false
    // Для начала: фактическое > нормы (начал позже)
    // Для конца: фактическое < нормы (закончил раньше)
    return isStart ? actualMinutes > normMinutes : actualMinutes < normMinutes
  }

  // Определяем диапазон времени для шкалы
  const getTimeInMinutes = (timeValue) => {
    if (!timeValue) return null
    // Если это Date объект или строка ISO
    const date = typeof timeValue === 'string' ? new Date(timeValue) : timeValue
    if (date instanceof Date && !Number.isNaN(date.getTime())) {
      return date.getHours() * 60 + date.getMinutes()
    }
    // Если это старая строка формата "HH:MM" или "DD.MM.YYYY HH:MM"
    if (typeof timeValue === 'string') {
      const timePart = timeValue.includes(' ') ? timeValue.split(' ')[1] : timeValue
      const [hours, minutes] = timePart.split(':').map(Number)
      if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
        return hours * 60 + minutes
      }
    }
    return null
  }

  // Определяем начало и конец рабочего дня
  const workDayStartMinutes = workDayData?.startTime
    ? getTimeInMinutes(workDayData.startTime)
    : 7 * 60 // По умолчанию 7:00
  const workDayEndMinutes = workDayData?.endTime ? getTimeInMinutes(workDayData.endTime) : null

  // Если есть обязанности, расширяем диапазон
  let minTime = workDayStartMinutes
  let maxTime = workDayEndMinutes || 0

  // Находим максимальное время из обязанностей
  entries.forEach((entry) => {
    const startMins = getTimeInMinutes(entry.startTime)
    const endMins = getTimeInMinutes(entry.endTime)
    if (startMins !== null && startMins < minTime) minTime = startMins
    if (endMins !== null && endMins > maxTime) maxTime = endMins
    if (startMins !== null && endMins === null && startMins > maxTime) maxTime = startMins
  })

  // Максимальное время: конец рабочего дня, последняя обязанность или минимум 19:00
  const minRequiredTime = 19 * 60 // 19:00
  if (workDayEndMinutes !== null) {
    maxTime = Math.max(maxTime, workDayEndMinutes, minRequiredTime)
  } else {
    maxTime = Math.max(maxTime, minRequiredTime)
  }

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
            <div className="flex justify-between text-[10px] leading-tight text-gray-500 mb-2">
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
                <div
                  className={`relative h-12 bg-gray-50 rounded border-2 ${
                    (selectedPosition?.workDayStartTime &&
                      checkWorkTimeViolation(
                        workDayData.startTime,
                        selectedPosition.workDayStartTime,
                        true
                      )) ||
                    (selectedPosition?.workDayEndTime &&
                      workDayData.endTime &&
                      checkWorkTimeViolation(
                        workDayData.endTime,
                        selectedPosition.workDayEndTime,
                        false
                      ))
                      ? 'border-red-500'
                      : 'border-blue-500'
                  }`}
                >
                  <div className="absolute inset-0 flex items-center px-4">
                    <span
                      className={`text-sm font-medium ${
                        (selectedPosition?.workDayStartTime &&
                          checkWorkTimeViolation(
                            workDayData.startTime,
                            selectedPosition.workDayStartTime,
                            true
                          )) ||
                        (selectedPosition?.workDayEndTime &&
                          workDayData.endTime &&
                          checkWorkTimeViolation(
                            workDayData.endTime,
                            selectedPosition.workDayEndTime,
                            false
                          ))
                          ? 'text-red-700'
                          : 'text-blue-700'
                      }`}
                    >
                      {workDayData.startTime && extractTime(workDayData.startTime)}
                      {workDayData.endTime && ` - ${extractTime(workDayData.endTime)}`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Обязанности */}
            {entriesWithDutyInfo.map(({ duty, entries: dutyEntries }) => {
              // Суммируем количество для количественных обязанностей
              const totalQuantity = duty?.isQuantitative
                ? dutyEntries.reduce((sum, entry) => sum + (Number(entry.value) || 0), 0)
                : null

              return (
                <div key={duty?._id || 'unknown'} className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    {duty?.name || 'Неизвестная обязанность'}
                    {duty?.isQuantitative && totalQuantity !== null && (
                      <span className="ml-2 text-xs text-blue-600">(Кол-во: {totalQuantity})</span>
                    )}
                  </div>
                  <div className="relative h-12 bg-gray-50 rounded border">
                    {dutyEntries.map((entry) => {
                      const startMinutes = timeToMinutes(entry.startTime)
                      const endMinutes = timeToMinutes(entry.endTime)
                      const leftPercent =
                        startMinutes !== null ? getPositionPercent(startMinutes) : 0
                      const widthPercent =
                        startMinutes !== null && endMinutes !== null
                          ? getWidthPercent(startMinutes, endMinutes)
                          : startMinutes !== null
                          ? 2
                          : 0

                      const startTimeStr = extractTime(entry.startTime)
                      const endTimeStr = extractTime(entry.endTime)

                      // Вычисляем фактическое время выполнения в минутах
                      let actualTimeMinutes = null
                      if (entry.startTime && entry.endTime) {
                        const startDate =
                          typeof entry.startTime === 'string'
                            ? new Date(entry.startTime)
                            : entry.startTime
                        const endDate =
                          typeof entry.endTime === 'string'
                            ? new Date(entry.endTime)
                            : entry.endTime

                        if (
                          startDate instanceof Date &&
                          !Number.isNaN(startDate.getTime()) &&
                          endDate instanceof Date &&
                          !Number.isNaN(endDate.getTime())
                        ) {
                          // Вычисляем разницу в миллисекундах и переводим в минуты
                          actualTimeMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60)
                        }
                      }

                      // Для количественных обязанностей делим время на количество
                      let timePerUnit = actualTimeMinutes
                      if (duty?.isQuantitative && actualTimeMinutes !== null && entry.value) {
                        const quantity = Number(entry.value) || 1
                        if (quantity > 0) {
                          timePerUnit = actualTimeMinutes / quantity
                        }
                      }

                      // Проверяем, превышает ли время норму выполнения
                      const exceedsNorm =
                        duty?.completionTimeMinutes &&
                        timePerUnit !== null &&
                        timePerUnit > duty.completionTimeMinutes

                      // Формируем текст тултипа
                      let tooltipText = endTimeStr !== '-'
                        ? `${startTimeStr} - ${endTimeStr}`
                        : `Начало: ${startTimeStr}`
                      if (duty?.isQuantitative && entry.value) {
                        tooltipText += ` (Кол-во: ${entry.value})`
                      }

                      const isTooltipVisible = tooltip.entryId === entry.id

                      // Определяем цвет блока
                      let bgColor = 'bg-blue-500'
                      if (endMinutes !== null) {
                        bgColor = exceedsNorm ? 'bg-red-500' : 'bg-green-500'
                      }

                      return (
                        <div
                          key={entry.id}
                          className={`absolute top-0 bottom-0 rounded flex items-center px-2 cursor-pointer ${bgColor} text-white`}
                          style={{
                            left: `${leftPercent}%`,
                            width: `${Math.max(widthPercent, 2)}%`,
                            minWidth: '48px'
                          }}
                          onMouseEnter={() => {
                            setTooltip({
                              entryId: entry.id,
                              text: tooltipText
                            })
                          }}
                          onMouseLeave={() => setTooltip({ entryId: null, text: '' })}
                        >
                          <div
                            className="text-xs font-medium whitespace-nowrap"
                            style={{ lineHeight: '12px', textAlign: 'center' }}
                          >
                            {startTimeStr}
                            {endMinutes !== null && ` - ${endTimeStr}`}
                          </div>
                          {isTooltipVisible && (
                            <div
                              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap shadow-lg"
                              style={{ textAlign: 'center' }}
                            >
                              {tooltip.text}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

const KPIView = ({ entriesWithDutyInfo, workDayData }) => {
  // Вычисляем полезное и бесполезное время
  const calculateKPI = () => {
    if (!workDayData || !workDayData.startTime) {
      return null
    }

    const workDayStart = new Date(workDayData.startTime)
    const workDayEnd = workDayData.endTime ? new Date(workDayData.endTime) : new Date()

    if (Number.isNaN(workDayStart.getTime())) {
      return null
    }

    // Общее время рабочего дня в минутах
    const totalWorkDayMinutes = (workDayEnd.getTime() - workDayStart.getTime()) / (1000 * 60)

    // Массив всех временных интервалов работы (полезное время)
    const workIntervals = []
    // Массив интервалов "другое" (бесполезное время)
    const otherIntervals = []

    entriesWithDutyInfo.forEach(({ duty, entries: dutyEntries }) => {
      dutyEntries.forEach((entry) => {
        if (entry.startTime && entry.endTime) {
          const startDate = new Date(entry.startTime)
          const endDate = new Date(entry.endTime)

          if (
            !Number.isNaN(startDate.getTime()) &&
            !Number.isNaN(endDate.getTime()) &&
            startDate < endDate
          ) {
            const interval = {
              start: startDate.getTime(),
              end: endDate.getTime(),
              dutyName: duty?.name || 'Неизвестная обязанность'
            }

            // Проверяем, является ли обязанность "другим" (перекур, отдых, обед)
            const isOther =
              duty?.name?.toLowerCase().includes('перекур') ||
              duty?.name?.toLowerCase().includes('отдых') ||
              duty?.name?.toLowerCase().includes('обед') ||
              duty?.name?.toLowerCase().includes('другое')

            if (isOther) {
              otherIntervals.push(interval)
            } else {
              workIntervals.push(interval)
            }
          }
        }
      })
    })

    // Объединяем пересекающиеся интервалы для полезного времени
    const mergeIntervals = (intervals) => {
      if (intervals.length === 0) return []

      const sorted = intervals.sort((a, b) => a.start - b.start)
      const merged = [sorted[0]]

      for (let i = 1; i < sorted.length; i += 1) {
        const current = sorted[i]
        const last = merged[merged.length - 1]

        if (current.start <= last.end) {
          // Пересекаются или соприкасаются - объединяем
          last.end = Math.max(last.end, current.end)
        } else {
          merged.push(current)
        }
      }

      return merged
    }

    const mergedWorkIntervals = mergeIntervals(workIntervals)
    const mergedOtherIntervals = mergeIntervals(otherIntervals)

    // Считаем полезное время
    const usefulMinutes = mergedWorkIntervals.reduce(
      (sum, interval) => sum + (interval.end - interval.start) / (1000 * 60),
      0
    )

    // Считаем время "другое"
    const otherMinutes = mergedOtherIntervals.reduce(
      (sum, interval) => sum + (interval.end - interval.start) / (1000 * 60),
      0
    )

    // Бесполезное время = общее время - полезное время
    const wastedMinutes = Math.max(0, totalWorkDayMinutes - usefulMinutes)

    return {
      totalWorkDayMinutes,
      usefulMinutes,
      otherMinutes,
      wastedMinutes,
      usefulHours: Math.floor(usefulMinutes / 60),
      usefulMinutesRemainder: Math.round(usefulMinutes % 60),
      otherHours: Math.floor(otherMinutes / 60),
      otherMinutesRemainder: Math.round(otherMinutes % 60),
      wastedHours: Math.floor(wastedMinutes / 60),
      wastedMinutesRemainder: Math.round(wastedMinutes % 60),
      totalHours: Math.floor(totalWorkDayMinutes / 60),
      totalMinutesRemainder: Math.round(totalWorkDayMinutes % 60),
      kpiPercentage: totalWorkDayMinutes > 0 ? (usefulMinutes / totalWorkDayMinutes) * 100 : 0
    }
  }

  const kpiData = calculateKPI()

  if (!kpiData) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        Нет данных для расчета КПД. Рабочий день не начат.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Анализ эффективности работы</h2>

        {/* КПД процент */}
        <div className="mb-8 p-6 bg-gradient-to-r from-main-50 to-main-100 rounded-lg">
          <div className="text-center">
            <div className="text-5xl font-bold text-main-600 mb-2">
              {kpiData.kpiPercentage.toFixed(1)}%
            </div>
            <div className="text-lg text-gray-700">КПД (Коэффициент полезного действия)</div>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Общее время */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Рабочий день</div>
            <div className="text-2xl font-bold text-gray-900">
              {kpiData.totalHours}ч {kpiData.totalMinutesRemainder}м
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {Math.round(kpiData.totalWorkDayMinutes)} минут
            </div>
          </div>

          {/* Полезное время */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm text-green-700 mb-1">Полезное время</div>
            <div className="text-2xl font-bold text-green-600">
              {kpiData.usefulHours}ч {kpiData.usefulMinutesRemainder}м
            </div>
            <div className="text-xs text-green-600 mt-1">
              {Math.round(kpiData.usefulMinutes)} минут
            </div>
          </div>

          {/* Другое (перекуры, обед) */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-sm text-yellow-700 mb-1">Перекуры/Обед</div>
            <div className="text-2xl font-bold text-yellow-600">
              {kpiData.otherHours}ч {kpiData.otherMinutesRemainder}м
            </div>
            <div className="text-xs text-yellow-600 mt-1">
              {Math.round(kpiData.otherMinutes)} минут
            </div>
          </div>

          {/* Бесполезное время */}
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-sm text-red-700 mb-1">Простой</div>
            <div className="text-2xl font-bold text-red-600">
              {kpiData.wastedHours}ч {kpiData.wastedMinutesRemainder}м
            </div>
            <div className="text-xs text-red-600 mt-1">
              {Math.round(kpiData.wastedMinutes)} минут
            </div>
          </div>
        </div>

        {/* Визуализация */}
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-700 mb-2">Распределение времени</div>
          <div className="flex h-8 rounded-lg overflow-hidden">
            <div
              className="bg-green-500 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${(kpiData.usefulMinutes / kpiData.totalWorkDayMinutes) * 100}%` }}
              title={`Полезное: ${Math.round(kpiData.usefulMinutes)} мин`}
            >
              {((kpiData.usefulMinutes / kpiData.totalWorkDayMinutes) * 100).toFixed(0)}%
            </div>
            <div
              className="bg-yellow-500 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${(kpiData.otherMinutes / kpiData.totalWorkDayMinutes) * 100}%` }}
              title={`Перекуры/Обед: ${Math.round(kpiData.otherMinutes)} мин`}
            >
              {kpiData.otherMinutes > 0
                ? `${((kpiData.otherMinutes / kpiData.totalWorkDayMinutes) * 100).toFixed(0)}%`
                : ''}
            </div>
            <div
              className="bg-red-500 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${(kpiData.wastedMinutes / kpiData.totalWorkDayMinutes) * 100}%` }}
              title={`Простой: ${Math.round(kpiData.wastedMinutes)} мин`}
            >
              {kpiData.wastedMinutes > 0
                ? `${((kpiData.wastedMinutes / kpiData.totalWorkDayMinutes) * 100).toFixed(0)}%`
                : ''}
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>
              <span role="img" aria-label="Зеленый круг">
                🟢
              </span>{' '}
              Полезное время
            </span>
            <span>
              <span role="img" aria-label="Желтый круг">
                🟡
              </span>{' '}
              Перекуры/Обед
            </span>
            <span>
              <span role="img" aria-label="Красный круг">
                🔴
              </span>{' '}
              Простой
            </span>
          </div>
        </div>

        {/* Пояснения */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Как рассчитывается КПД:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              <strong>Полезное время</strong> — время выполнения рабочих обязанностей (без
              перекуров, обеда, отдыха)
            </li>
            <li>
              <strong>Перекуры/Обед</strong> — время, отмеченное как &quot;перекур&quot;,
              &quot;обед&quot;, &quot;отдых&quot; или &quot;другое&quot;
            </li>
            <li>
              <strong>Простой</strong> — время в течение рабочего дня, когда сотрудник ничего не
              делал
            </li>
            <li>
              <strong>КПД</strong> = (Полезное время / Общее время рабочего дня) × 100%
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BossJournal
