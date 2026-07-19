import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { FaCheckCircle, FaClock, FaCircle } from 'react-icons/fa'
import Navbar from '../Navbar'
import Modal from '../Modal.delete'
import { getPositions } from '../../redux/reducers/positions'
import { getEmployees } from '../../redux/reducers/employees'
import standardDutiesList from '../../lists/standard-duties-list'
import { KPIView } from './BossJournal'
import 'react-toastify/dist/ReactToastify.css'

const EmployeeJournal = () => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const dispatch = useDispatch()
  const auth = useSelector((s) => s.auth)
  const employees = useSelector((s) => s.employees.list)
  const positions = useSelector((s) => s.positions.list)

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [entries, setEntries] = useState({})
  const [loading, setLoading] = useState(false)
  const [workDayStarted, setWorkDayStarted] = useState(false)
  const [workDayEnded, setWorkDayEnded] = useState(false)
  const [workDayData, setWorkDayData] = useState(null)
  const [addedDutyIds, setAddedDutyIds] = useState([])
  const [showAddDutyModal, setShowAddDutyModal] = useState(false)
  const [showStandardDutiesModal, setShowStandardDutiesModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [dutyToDelete, setDutyToDelete] = useState(null)
  const [showCompletedDuties, setShowCompletedDuties] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [showEndWorkDayModal, setShowEndWorkDayModal] = useState(false)
  const [nowTick, setNowTick] = useState(Date.now())

  // Найти сотрудника по userName из auth (userName в аккаунте содержит id сотрудника)
  const currentEmployee = employees.find((emp) => emp.id === auth.user?.userName)

  // Получаем ID выбранного сотрудника из localStorage или используем текущего
  const getStoredEmployeeId = () => {
    const stored = localStorage.getItem('selectedEmployeeForJournal')
    return stored || currentEmployee?.id || ''
  }

  const getStoredPositionId = () => {
    return localStorage.getItem('selectedPositionForJournal') || ''
  }

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(getStoredEmployeeId())
  const [selectedPositionId, setSelectedPositionId] = useState(getStoredPositionId())

  // Список должностей сотрудника: основная и при наличии — дополнительная
  const getEmployeePositionIds = (emp) => {
    if (!emp) return []
    const ids = []
    if (emp.positionId) ids.push(emp.positionId)
    if (emp.positionIdAdditional && emp.positionIdAdditional !== emp.positionId)
      ids.push(emp.positionIdAdditional)
    return ids
  }

  // Активная должность для фильтра: выбранная или из текущего сотрудника
  const activePositionId =
    selectedPositionId || currentEmployee?.positionId || currentEmployee?.positionIdAdditional

  // Обновляем selectedEmployeeId когда currentEmployee загружается
  useEffect(() => {
    if (currentEmployee && !selectedEmployeeId) {
      setSelectedEmployeeId(currentEmployee.id)
    }
  }, [currentEmployee, selectedEmployeeId])

  // Синхронизируем выбранную должность с сотрудником при первой загрузке
  useEffect(() => {
    const employee = employees.find((emp) => emp.id === selectedEmployeeId)
    const firstPosId = getEmployeePositionIds(employee)[0]
    if (firstPosId && !selectedPositionId) {
      setSelectedPositionId(firstPosId)
      localStorage.setItem('selectedPositionForJournal', firstPosId)
    }
  }, [employees, selectedEmployeeId, selectedPositionId])

  // Получаем выбранного сотрудника
  const selectedEmployee = employees.find((emp) => emp.id === selectedEmployeeId) || currentEmployee

  // Список сотрудников с выбранной должностью (основной или дополнительной)
  const employeesWithSamePosition = activePositionId
    ? employees.filter(
        (emp) =>
          emp.positionId === activePositionId || emp.positionIdAdditional === activePositionId
      )
    : []

  useEffect(() => {
    dispatch(getPositions())
    dispatch(getEmployees())
  }, [dispatch])

  // Сохраняем выбранного сотрудника в localStorage
  const handleEmployeeChange = (employeeId) => {
    setSelectedEmployeeId(employeeId)
    localStorage.setItem('selectedEmployeeForJournal', employeeId)
  }

  // Смена должности: сохраняем и подставляем первого сотрудника с этой должностью при необходимости
  const handlePositionChange = (positionId) => {
    setSelectedPositionId(positionId)
    localStorage.setItem('selectedPositionForJournal', positionId)
    const withNewPosition = positionId
      ? employees.filter(
          (emp) => emp.positionId === positionId || emp.positionIdAdditional === positionId
        )
      : []
    const currentStillValid = withNewPosition.some((emp) => emp.id === selectedEmployeeId)
    if (!currentStillValid && withNewPosition.length > 0) {
      setSelectedEmployeeId(withNewPosition[0].id)
      localStorage.setItem('selectedEmployeeForJournal', withNewPosition[0].id)
    } else if (!currentStillValid) {
      setSelectedEmployeeId('')
      localStorage.setItem('selectedEmployeeForJournal', '')
    }
  }

  const loadWorkDayStart = async () => {
    if (!selectedEmployee) return

    try {
      const response = await fetch(
        `/api/v1/workDayStart/employee/${selectedEmployee.id}/date/${selectedDate}`
      )
      const { data } = await response.json()
      setWorkDayData(data)
      setWorkDayStarted(!!data)
      setWorkDayEnded(!!(data && data.endTime))
    } catch (error) {
      setWorkDayStarted(false)
      setWorkDayEnded(false)
      setWorkDayData(null)
    }
  }

  const loadEntries = async () => {
    if (!selectedEmployee || getEmployeePositionIds(selectedEmployee).length === 0) {
      notify('Должность не назначена. Обратитесь к администратору.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `/api/v1/journalEntry/employee/${selectedEmployee.id}/date/${selectedDate}`
      )
      const { data } = await response.json()
      const entriesMap = {}
      const dutyIds = []
      data.forEach((entry) => {
        // Используем ID записи из БД как uniqueKey
        const uniqueKey = entry.id
        if (uniqueKey) {
          entriesMap[uniqueKey] = { ...entry, uniqueKey }
          dutyIds.push(uniqueKey)
        }
      })
      setEntries(entriesMap)
      setAddedDutyIds(dutyIds)
    } catch (error) {
      notify('Ошибка при загрузке записей')
    } finally {
      setLoading(false)
    }
  }

  const handleStartWorkDay = async () => {
    if (!currentEmployee) {
      notify('Сотрудник не найден')
      return
    }

    try {
      const response = await fetch('/api/v1/workDayStart/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employeeId: selectedEmployee.id,
          date: selectedDate
        })
      })

      const { data } = await response.json()
      if (data) {
        setWorkDayData(data)
        setWorkDayStarted(true)
        setWorkDayEnded(false)
        notify('Рабочий день начат')
      }
    } catch (error) {
      notify('Ошибка при начале рабочего дня')
    }
  }

  const handleEndWorkDay = async () => {
    if (!currentEmployee) {
      notify('Сотрудник не найден')
      return
    }

    try {
      const response = await fetch('/api/v1/workDayStart/end', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employeeId: selectedEmployee.id,
          date: selectedDate
        })
      })

      const { data } = await response.json()
      if (data) {
        setWorkDayData(data)
        setWorkDayEnded(true)
        notify('Рабочий день завершен')
      }
    } catch (error) {
      notify('Ошибка при завершении рабочего дня')
    }
  }

  useEffect(() => {
    if (selectedEmployee) {
      loadWorkDayStart()
      if (getEmployeePositionIds(selectedEmployee).length > 0) {
        loadEntries()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedEmployeeId, selectedEmployee?.id])

  const formatDateTime = (dateTime) => {
    if (!dateTime) return null
    const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      // Если это старая строка формата "DD.MM.YYYY HH:MM"
      if (typeof dateTime === 'string') {
        return dateTime
      }
      return dateTime
    }
    // Форматируем Date в "DD.MM.YYYY HH:MM"
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${day}.${month}.${year} ${hours}:${minutes}`
  }

  // Живой тик для счетчиков рабочего/личного времени
  useEffect(() => {
    if (!workDayStarted || workDayEnded) return undefined
    const intervalId = setInterval(() => setNowTick(Date.now()), 1000)
    return () => clearInterval(intervalId)
  }, [workDayStarted, workDayEnded])

  const formatDuration = (totalSeconds) => {
    const safe = Math.max(0, Math.floor(totalSeconds || 0))
    const hours = Math.floor(safe / 3600)
    const minutes = Math.floor((safe % 3600) / 60)
    if (hours > 0) {
      return `${hours}ч ${minutes}м`
    }
    return `${minutes}м`
  }

  const isPersonalDuty = (duty) => {
    if (!duty?.name) return false
    const name = duty.name.toLowerCase()
    return standardDutiesList.some((d) => name === d.name.toLowerCase()) ||
      name.includes('перекур') ||
      name.includes('отдых') ||
      name.includes('обед') ||
      name.includes('другое')
  }

  const handleSaveEntry = async (dutyId, value, comment, uniqueKey, checklistProgress) => {
    if (!currentEmployee || getEmployeePositionIds(currentEmployee).length === 0) {
      notify('Должность не назначена')
      return
    }

    // Преобразуем ID в строку для консистентности
    const dutyIdStr = String(dutyId)
    const entryKey = uniqueKey
    const currentEntry = entries[entryKey]

    if (!entryKey || !currentEntry) {
      notify('Ошибка: запись не найдена')
      return
    }

    const positionIdForEntry =
      currentEntry?.positionId ||
      selectedEmployee?.positionId ||
      getEmployeePositionIds(selectedEmployee)[0]

    try {
      const response = await fetch('/api/v1/journalEntry/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          entryId: entryKey, // Используем ID записи из БД
          employeeId: selectedEmployee.id,
          positionId: positionIdForEntry,
          dutyId: dutyIdStr,
          date: selectedDate,
          value,
          comment,
          checklistProgress,
          startTime: currentEntry?.startTime,
          endTime: currentEntry?.endTime
        })
      })

      const { data } = await response.json()
      // Обновляем запись с данными из БД
      setEntries((prev) => ({
        ...prev,
        [entryKey]: { ...data, uniqueKey: entryKey }
      }))
      notify('Запись сохранена')
    } catch (error) {
      notify('Ошибка при сохранении')
    }
  }

  const handleCompleteDuty = async (dutyId, uniqueKey, duty) => {
    if (!currentEmployee || getEmployeePositionIds(currentEmployee).length === 0) {
      notify('Должность не назначена')
      return
    }

    const dutyIdStr = String(dutyId)
    const entryKey = uniqueKey
    const currentEntry = entries[entryKey]

    if (!entryKey || !currentEntry) {
      notify('Ошибка: запись не найдена')
      return
    }

    const positionIdForEntry =
      currentEntry?.positionId ||
      duty?.dutyPositionId ||
      selectedEmployee?.positionId ||
      getEmployeePositionIds(selectedEmployee)[0]

    if (currentEntry?.endTime) {
      notify('Обязанность уже завершена')
      return
    }

    // Проверяем, является ли обязанность количественной и указано ли количество
    if (duty && duty.isQuantitative) {
      const quantity = currentEntry?.value
      if (
        !quantity ||
        quantity === '' ||
        quantity === null ||
        quantity === undefined ||
        Number(quantity) === 0
      ) {
        notify('Укажите количество перед завершением обязанности')
        return
      }
    }

    // Записываем время окончания
    const endTime = new Date().toISOString()
    const pauseIntervals = [...(currentEntry.pauseIntervals || [])]
    if (currentEntry.isPaused && currentEntry.pausedAt) {
      pauseIntervals.push({
        start: currentEntry.pausedAt,
        end: endTime
      })
    }

    try {
      const response = await fetch('/api/v1/journalEntry/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          entryId: entryKey, // Используем ID записи из БД
          employeeId: selectedEmployee.id,
          positionId: positionIdForEntry,
          dutyId: dutyIdStr,
          date: selectedDate,
          value: currentEntry?.value,
          comment: currentEntry?.comment,
          startTime: currentEntry?.startTime,
          endTime,
          isPaused: false,
          pausedAt: null,
          pauseIntervals
        })
      })

      const { data } = await response.json()
      setEntries((prev) => ({
        ...prev,
        [entryKey]: { ...data, uniqueKey: entryKey }
      }))
      notify('Обязанность завершена')
    } catch (error) {
      notify('Ошибка при завершении обязанности')
    }
  }

  const handlePauseDuty = async (dutyId, uniqueKey, duty) => {
    if (!currentEmployee || getEmployeePositionIds(currentEmployee).length === 0) {
      notify('Должность не назначена')
      return
    }

    const dutyIdStr = String(dutyId)
    const entryKey = uniqueKey
    const currentEntry = entries[entryKey]

    if (!entryKey || !currentEntry) {
      notify('Ошибка: запись не найдена')
      return
    }

    if (currentEntry?.endTime) {
      notify('Обязанность уже завершена')
      return
    }

    if (currentEntry?.isPaused) {
      notify('Обязанность уже на паузе')
      return
    }

    if (!currentEntry?.startTime) {
      notify('Обязанность ещё не начата')
      return
    }

    const positionIdForEntry =
      currentEntry?.positionId ||
      duty?.dutyPositionId ||
      selectedEmployee?.positionId ||
      getEmployeePositionIds(selectedEmployee)[0]

    const pausedAt = new Date().toISOString()

    try {
      const response = await fetch('/api/v1/journalEntry/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          entryId: entryKey,
          employeeId: selectedEmployee.id,
          positionId: positionIdForEntry,
          dutyId: dutyIdStr,
          date: selectedDate,
          value: currentEntry?.value,
          comment: currentEntry?.comment,
          startTime: currentEntry?.startTime,
          endTime: null,
          isPaused: true,
          pausedAt,
          pauseIntervals: currentEntry?.pauseIntervals || []
        })
      })

      const { data } = await response.json()
      setEntries((prev) => ({
        ...prev,
        [entryKey]: { ...data, uniqueKey: entryKey }
      }))
      notify('Обязанность поставлена на паузу')
    } catch (error) {
      notify('Ошибка при постановке на паузу')
    }
  }

  const handleResumeDuty = async (dutyId, uniqueKey, duty) => {
    if (!currentEmployee || getEmployeePositionIds(currentEmployee).length === 0) {
      notify('Должность не назначена')
      return
    }

    const dutyIdStr = String(dutyId)
    const entryKey = uniqueKey
    const currentEntry = entries[entryKey]

    if (!entryKey || !currentEntry) {
      notify('Ошибка: запись не найдена')
      return
    }

    if (!currentEntry?.isPaused) {
      notify('Обязанность не на паузе')
      return
    }

    const positionIdForEntry =
      currentEntry?.positionId ||
      duty?.dutyPositionId ||
      selectedEmployee?.positionId ||
      getEmployeePositionIds(selectedEmployee)[0]

    const resumeAt = new Date().toISOString()
    const pauseIntervals = [...(currentEntry.pauseIntervals || [])]
    if (currentEntry.pausedAt) {
      pauseIntervals.push({
        start: currentEntry.pausedAt,
        end: resumeAt
      })
    }

    try {
      const response = await fetch('/api/v1/journalEntry/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          entryId: entryKey,
          employeeId: selectedEmployee.id,
          positionId: positionIdForEntry,
          dutyId: dutyIdStr,
          date: selectedDate,
          value: currentEntry?.value,
          comment: currentEntry?.comment,
          startTime: currentEntry?.startTime,
          endTime: null,
          isPaused: false,
          pausedAt: null,
          pauseIntervals
        })
      })

      const { data } = await response.json()
      setEntries((prev) => ({
        ...prev,
        [entryKey]: { ...data, uniqueKey: entryKey }
      }))
      notify('Обязанность продолжена')
    } catch (error) {
      notify('Ошибка при продолжении обязанности')
    }
  }

  if (!currentEmployee) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 mb-4">
          <h1 className="text-3xl py-4 border-b mb-6">Электронный журнал</h1>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
            <p>Сотрудник не найден. Обратитесь к администратору.</p>
          </div>
        </div>
      </div>
    )
  }

  // Все должности выбранного сотрудника (основная + дополнительная)
  const selectedEmployeePositionIds = getEmployeePositionIds(selectedEmployee)
  const employeePositions = positions.filter((p) => selectedEmployeePositionIds.includes(p.id))

  // Объединённый список обязанностей по обеим должностям (у каждой обязанности — dutyPositionId)
  const sortedDuties = employeePositions
    .flatMap((pos) => (pos.duties || []).map((d) => ({ ...d, dutyPositionId: pos.id })))
    .sort((a, b) => {
      const orderA = a.order !== undefined ? a.order : 0
      const orderB = b.order !== undefined ? b.order : 0
      return orderA - orderB
    })

  // Для модалки «Статистика»: данные в формате, как в BossJournal (KPIView)
  const entriesArrayForKpi = Object.values(entries)
  const groupedEntriesForKpi = entriesArrayForKpi.reduce((acc, entry) => {
    const key = entry.dutyId
    if (!acc[key]) acc[key] = []
    acc[key].push(entry)
    return acc
  }, {})
  const entriesWithDutyInfo = Object.entries(groupedEntriesForKpi).map(([dutyId, dutyEntries]) => {
    const duty = sortedDuties.find(
      (d) =>
        d._id.toString() === dutyId &&
        (dutyEntries[0]?.positionId ? d.dutyPositionId === dutyEntries[0].positionId : true)
    )
    return { duty, dutyId, entries: dutyEntries }
  })
  const selectedPositionForKpi = employeePositions[0] || null

  // Счетчики: рабочее время и личное время
  const timeCounters = (() => {
    if (!workDayData?.startTime) return null

    const workDayStart = new Date(workDayData.startTime).getTime()
    if (Number.isNaN(workDayStart)) return null

    const workDayEnd = workDayData.endTime
      ? new Date(workDayData.endTime).getTime()
      : nowTick
    if (Number.isNaN(workDayEnd) || workDayEnd <= workDayStart) {
      return { workSeconds: 0, personalSeconds: 0 }
    }

    const totalSeconds = (workDayEnd - workDayStart) / 1000

    const workIntervals = []
    entriesWithDutyInfo.forEach(({ duty, entries: dutyEntries }) => {
      if (isPersonalDuty(duty)) return
      dutyEntries.forEach((entry) => {
        if (!entry.startTime) return
        const start = new Date(entry.startTime).getTime()
        if (Number.isNaN(start)) return

        let rangeEnd
        if (entry.endTime) {
          rangeEnd = new Date(entry.endTime).getTime()
        } else if (entry.isPaused && entry.pausedAt) {
          rangeEnd = new Date(entry.pausedAt).getTime()
        } else {
          rangeEnd = nowTick
        }
        if (Number.isNaN(rangeEnd) || rangeEnd <= start) return

        const pauses = (entry.pauseIntervals || [])
          .filter((p) => p.start && p.end)
          .map((p) => ({
            start: new Date(p.start).getTime(),
            end: new Date(p.end).getTime()
          }))
          .filter((p) => !Number.isNaN(p.start) && !Number.isNaN(p.end) && p.end > p.start)
          .sort((a, b) => a.start - b.start)

        let cursor = start
        const pushClamped = (segStart, segEnd) => {
          const clampedStart = Math.max(segStart, workDayStart)
          const clampedEnd = Math.min(segEnd, workDayEnd)
          if (clampedEnd > clampedStart) {
            workIntervals.push({ start: clampedStart, end: clampedEnd })
          }
        }

        pauses.forEach((pause) => {
          if (pause.start > cursor) {
            pushClamped(cursor, Math.min(pause.start, rangeEnd))
          }
          cursor = Math.max(cursor, pause.end)
        })
        if (cursor < rangeEnd) {
          pushClamped(cursor, rangeEnd)
        }
      })
    })

    const mergeIntervals = (intervals) => {
      if (intervals.length === 0) return []
      const sorted = [...intervals].sort((a, b) => a.start - b.start)
      const merged = [{ ...sorted[0] }]
      for (let i = 1; i < sorted.length; i += 1) {
        const current = sorted[i]
        const last = merged[merged.length - 1]
        if (current.start <= last.end) {
          last.end = Math.max(last.end, current.end)
        } else {
          merged.push({ ...current })
        }
      }
      return merged
    }

    const workSeconds = mergeIntervals(workIntervals).reduce(
      (sum, interval) => sum + (interval.end - interval.start) / 1000,
      0
    )
    const personalSeconds = Math.max(0, totalSeconds - workSeconds)

    return { workSeconds, personalSeconds }
  })()

  // Используем sortedDuties в handleAddStandardDuty
  // Объявляем функцию после определения sortedDuties

  // Получаем все обязанности, которые были добавлены (с учетом повторений)
  // Создаем массив объектов с уникальными ключами для каждой добавленной обязанности
  const allAddedDuties = addedDutyIds
    .map((entryId, index) => {
      // Находим запись по ID из БД
      const entry = entries[entryId]
      if (!entry) return null

      // Находим обязанность по positionId и dutyId из записи
      const duty = sortedDuties.find(
        (d) =>
          d._id.toString() === entry.dutyId &&
          (entry.positionId ? d.dutyPositionId === entry.positionId : true)
      )
      return duty ? { ...duty, uniqueKey: entryId, index } : null
    })
    .filter(Boolean)

  // Разделяем на выполненные и невыполненные
  const completedDuties = allAddedDuties.filter((duty) => {
    const entry = entries[duty.uniqueKey]
    return entry?.endTime
  })

  const activeDuties = allAddedDuties.filter((duty) => {
    const entry = entries[duty.uniqueKey]
    return !entry?.endTime
  })

  // Если рабочий день не завершен, показываем только активные обязанности (или все, если нажата кнопка)
  const addedDuties = !workDayEnded && !showCompletedDuties ? activeDuties : allAddedDuties

  // Обязанности, доступные для добавления
  // Если стоит «только 1 раз» и уже добавлена сегодня — скрываем
  const addedDutyIdsToday = new Set(
    Object.values(entries)
      .map((entry) => String(entry.dutyId))
      .filter(Boolean)
  )
  const availableDuties = sortedDuties.filter((duty) => {
    if (!duty.addOnlyOnce) return true
    return !addedDutyIdsToday.has(String(duty._id))
  })

  const handleAddDuty = async (dutyOrId) => {
    const duty = typeof dutyOrId === 'object' && dutyOrId !== null ? dutyOrId : null
    const positionIdForDuty =
      duty?.dutyPositionId ||
      selectedEmployee?.positionId ||
      getEmployeePositionIds(selectedEmployee)[0]
    if (!currentEmployee || getEmployeePositionIds(currentEmployee).length === 0) {
      notify('Должность не назначена')
      return
    }

    const dutyIdStr = String(duty?._id ?? dutyOrId)

    if (duty?.addOnlyOnce && addedDutyIdsToday.has(dutyIdStr)) {
      notify('Эту обязанность можно добавить только один раз за рабочий день')
      return
    }

    // Записываем время начала при добавлении обязанности
    const startTime = new Date().toISOString()

    try {
      // Сразу создаем запись в БД с временем начала
      const response = await fetch('/api/v1/journalEntry/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employeeId: selectedEmployee.id,
          positionId: positionIdForDuty,
          dutyId: dutyIdStr,
          date: selectedDate,
          startTime,
          value: null,
          comment: null
        })
      })

      const { data } = await response.json()
      // Используем ID записи из БД как uniqueKey
      const uniqueKey = data.id

      setEntries((prev) => ({
        ...prev,
        [uniqueKey]: { ...data, uniqueKey }
      }))

      setAddedDutyIds((prev) => [...prev, uniqueKey])
      setShowAddDutyModal(false)
      notify('Обязанность добавлена')
    } catch (error) {
      notify('Ошибка при добавлении обязанности')
    }
  }

  const handleAddStandardDuty = async (standardDuty) => {
    const firstPositionId = getEmployeePositionIds(currentEmployee)[0]
    if (!currentEmployee || !firstPositionId) {
      notify('Должность не назначена')
      return
    }

    try {
      // Проверяем, есть ли уже такая обязанность в должности
      const existingDuty = sortedDuties.find(
        (d) => d.name.toLowerCase() === standardDuty.name.toLowerCase()
      )

      let dutyId
      let positionIdForEntry = firstPositionId
      if (existingDuty) {
        // Используем существующую обязанность
        dutyId = existingDuty._id.toString()
        positionIdForEntry = existingDuty.dutyPositionId || firstPositionId
      } else {
        // Создаем новую обязанность в должности
        const addDutyResponse = await fetch(`/api/v1/position/${firstPositionId}/duty`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: standardDuty.name,
            isQuantitative: standardDuty.isQuantitative || false,
            completionTimeMinutes: standardDuty.completionTimeMinutes || null
          })
        })

        const addDutyData = await addDutyResponse.json()
        if (addDutyData.status !== 'ok') {
          notify('Ошибка при создании обязанности')
          return
        }

        // Находим только что созданную обязанность
        const newDuty = addDutyData.data.duties.find((d) => d.name === standardDuty.name)
        if (!newDuty) {
          notify('Ошибка при создании обязанности')
          return
        }
        dutyId = newDuty._id.toString()

        // Обновляем список должностей
        dispatch(getPositions())
      }

      // Добавляем обязанность в журнал
      const startTime = new Date().toISOString()

      const response = await fetch('/api/v1/journalEntry/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employeeId: selectedEmployee.id,
          positionId: positionIdForEntry,
          dutyId,
          date: selectedDate,
          startTime,
          value: null,
          comment: null
        })
      })

      const { data } = await response.json()
      const uniqueKey = data.id

      setEntries((prev) => ({
        ...prev,
        [uniqueKey]: { ...data, uniqueKey }
      }))

      setAddedDutyIds((prev) => [...prev, uniqueKey])
      setShowStandardDutiesModal(false)
      notify('Стандартная обязанность добавлена')
    } catch (error) {
      notify('Ошибка при добавлении стандартной обязанности')
    }
  }

  const handleRemoveDutyClick = (uniqueKey) => {
    // Находим обязанность по уникальному ключу
    const dutyData = addedDuties.find((d) => d.uniqueKey === uniqueKey)
    setDutyToDelete({ id: uniqueKey, name: dutyData?.name || 'обязанность' })
    setShowDeleteModal(true)
  }

  const handleRemoveDuty = async () => {
    if (!dutyToDelete) return

    try {
      // Удаляем запись из базы данных
      const response = await fetch(`/api/v1/journalEntry/${dutyToDelete.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      if (result.status === 'ok') {
        // Удаляем из локального состояния только после успешного удаления в БД
        setAddedDutyIds((prev) => prev.filter((id) => id !== dutyToDelete.id))
        setEntries((prev) => {
          const newEntries = { ...prev }
          delete newEntries[dutyToDelete.id]
          return newEntries
        })
        setShowDeleteModal(false)
        setDutyToDelete(null)
        notify('Обязанность удалена')
      } else {
        notify('Ошибка при удалении из базы данных')
      }
    } catch (error) {
      notify('Ошибка при удалении из базы данных')
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 mb-4">
        <div className="flex items-center justify-between py-4 border-b mb-6 flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Электронный журнал</h1>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label
                htmlFor="journal-date"
                className="text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Дата:
              </label>
              <input
                id="journal-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main-600 text-sm"
              />
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <label htmlFor="journal-position" className="font-semibold whitespace-nowrap">
                Должность:
              </label>
              <select
                id="journal-position"
                value={activePositionId}
                onChange={(e) => handlePositionChange(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-600 focus:border-transparent bg-white text-sm font-semibold"
              >
                <option value="">Должность не назначена</option>
                {positions.map((pos) => (
                  <option key={pos.id} value={pos.id}>
                    {pos.name}
                  </option>
                ))}
              </select>
              <span>-</span>
              {employeesWithSamePosition.length > 1 ? (
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => handleEmployeeChange(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-600 focus:border-transparent bg-white text-sm"
                >
                  {employeesWithSamePosition.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} {emp.surname}
                      {emp.id === currentEmployee?.id ? ' (Вы)' : ''}
                    </option>
                  ))}
                </select>
              ) : employeesWithSamePosition.length === 1 ? (
                <span>
                  {employeesWithSamePosition[0].name} {employeesWithSamePosition[0].surname}
                </span>
              ) : employeesWithSamePosition.length === 0 && activePositionId ? (
                <span className="text-amber-600">Нет сотрудников с этой должностью</span>
              ) : (
                <span>
                  {selectedEmployee?.name} {selectedEmployee?.surname}
                </span>
              )}
            </div>
          </div>
        </div>

        {!workDayStarted ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-lg text-gray-700 mb-4">Начните рабочий день</p>
            {selectedDate === new Date().toISOString().split('T')[0] ? (
              <button
                type="button"
                onClick={handleStartWorkDay}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-lg"
              >
                Приступил к работе
              </button>
            ) : (
              <p className="text-gray-500 italic">
                Начать рабочий день можно только для сегодняшней даты
              </p>
            )}
          </div>
        ) : (
          <>
            {workDayData && (
              <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center flex-wrap gap-x-6 gap-y-2">
                    <div>
                      <p className="text-sm text-gray-600">
                        Начало рабочего дня:{' '}
                        <span className="font-medium">{formatDateTime(workDayData.startTime)}</span>
                      </p>
                      {workDayData.endTime && (
                        <p className="text-sm text-gray-600 mt-1">
                          Окончание рабочего дня:{' '}
                          <span className="font-medium">{formatDateTime(workDayData.endTime)}</span>
                        </p>
                      )}
                    </div>
                    {timeCounters && (
                      <div className="flex items-center gap-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                          <div className="text-xs text-green-700 mb-0.5">Рабочее время</div>
                          <div className="text-base font-semibold text-green-700 tabular-nums">
                            {formatDuration(timeCounters.workSeconds)}
                          </div>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                          <div className="text-xs text-amber-700 mb-0.5">Личное время</div>
                          <div className="text-base font-semibold text-amber-700 tabular-nums">
                            {formatDuration(timeCounters.personalSeconds)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {!workDayEnded && (
                    <button
                      type="button"
                      onClick={() => setShowEndWorkDayModal(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                    >
                      Завершить рабочий день
                    </button>
                  )}
                </div>
              </div>
            )}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-main-600 mx-auto" />
              </div>
            ) : (
              <div className="space-y-4 pb-24">
                {!workDayEnded && completedDuties.length > 0 && (
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setShowCompletedDuties(!showCompletedDuties)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold flex items-center gap-2"
                    >
                      {showCompletedDuties ? 'Скрыть выполненные' : 'Показать выполненные'}
                      <span className="bg-white text-gray-600 px-2 py-1 rounded text-sm">
                        {completedDuties.length}
                      </span>
                    </button>
                  </div>
                )}
                {addedDuties.length === 0 && (workDayEnded || completedDuties.length === 0) ? (
                  <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
                    Нет добавленных обязанностей. Нажмите Добавить обязанность чтобы начать.
                  </div>
                ) : addedDuties.length > 0 ? (
                  addedDuties.map((duty) => {
                    const entry = entries[duty.uniqueKey]
                    return (
                      <DutyEntryForm
                        key={duty.uniqueKey}
                        duty={duty}
                        entry={entry}
                        onSave={handleSaveEntry}
                        onComplete={() => handleCompleteDuty(duty._id, duty.uniqueKey, duty)}
                        onPause={() => handlePauseDuty(duty._id, duty.uniqueKey, duty)}
                        onResume={() => handleResumeDuty(duty._id, duty.uniqueKey, duty)}
                        onRemove={() => handleRemoveDutyClick(duty.uniqueKey)}
                        uniqueKey={duty.uniqueKey}
                      />
                    )
                  })
                ) : null}

                {availableDuties.length > 0 && !workDayEnded && (
                  <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
                    <div className="mx-auto px-4" style={{ maxWidth: '800px' }}>
                      <div className="p-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddDutyModal(true)}
                          className="flex-1 px-4 py-3 bg-main-600 text-white rounded-lg hover:bg-main-700 font-semibold"
                        >
                          + Добавить обязанность
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowStandardDutiesModal(true)}
                          className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold whitespace-nowrap"
                        >
                          + Добавить другое
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowStatsModal(true)}
                          className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold whitespace-nowrap"
                        >
                          Статистика
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {workDayEnded && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <p className="text-yellow-800">
                      Рабочий день завершен. Добавление обязанностей недоступно.
                    </p>
                  </div>
                )}

                {showAddDutyModal && (
                  <AddDutyModal
                    availableDuties={availableDuties}
                    onSelect={handleAddDuty}
                    onClose={() => setShowAddDutyModal(false)}
                  />
                )}

                {showStatsModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div
                      className="bg-white rounded-lg shadow-xl max-w-2xl w-full flex flex-col"
                      style={{ maxHeight: '90vh' }}
                    >
                      <div className="flex-shrink-0 border-b px-4 py-3 flex justify-between items-center">
                        <h3 className="text-lg font-bold">Анализ эффективности работы</h3>
                        <button
                          type="button"
                          onClick={() => setShowStatsModal(false)}
                          className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                        >
                          ×
                        </button>
                      </div>
                      <div className="p-4 overflow-y-auto min-h-0">
                        <KPIView
                          entriesWithDutyInfo={entriesWithDutyInfo}
                          workDayData={workDayData}
                          selectedPosition={selectedPositionForKpi}
                          hideKpiExplanation
                          hideTitle
                        />
                      </div>
                    </div>
                  </div>
                )}

                {showStandardDutiesModal && (
                  <StandardDutiesModal
                    standardDuties={standardDutiesList}
                    onSelect={handleAddStandardDuty}
                    onClose={() => setShowStandardDutiesModal(false)}
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>
      <Modal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDutyToDelete(null)
        }}
        onSubmit={handleRemoveDuty}
        title="Удалить обязанность из списка?"
        message={
          dutyToDelete
            ? `Вы уверены, что хотите удалить обязанность "${dutyToDelete.name}" из списка?`
            : 'Вы уверены, что хотите удалить обязанность из списка?'
        }
      />
      {showEndWorkDayModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative">
            <button
              type="button"
              onClick={() => setShowEndWorkDayModal(false)}
              className="absolute text-gray-400 hover:text-gray-600 text-2xl leading-none"
              style={{ top: '12px', right: '12px' }}
              title="Закрыть"
            >
              ×
            </button>
            <div className="p-6 pr-10">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Вы уверены?</h3>
              <p className="text-sm text-gray-600 mb-6">
                После завершения рабочего дня добавление обязанностей будет недоступно.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowEndWorkDayModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEndWorkDayModal(false)
                    handleEndWorkDay()
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
                >
                  Завершить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const AddDutyModal = ({ availableDuties, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">Выберите обязанность</h3>
        <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '65vh' }}>
          {availableDuties.length === 0 ? (
            <p className="text-gray-500">Нет доступных обязанностей</p>
          ) : (
            availableDuties.map((duty) => (
              <button
                key={duty.dutyPositionId ? `${duty.dutyPositionId}-${duty._id}` : duty._id}
                type="button"
                onClick={() => onSelect(duty)}
                className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 hover:border-main-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{duty.name}</span>
                  {duty.isQuantitative && (
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                      Количественная
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  )
}

const StandardDutiesModal = ({ standardDuties, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Другое</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="space-y-2">
          {standardDuties.map((standardDuty) => (
            <div
              key={standardDuty.id || standardDuty.name}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{standardDuty.name}</span>
                  {standardDuty.isQuantitative && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                      Количественная
                    </span>
                  )}
                  {standardDuty.completionTimeMinutes && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {standardDuty.completionTimeMinutes} мин.
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSelect(standardDuty)}
                className="px-4 py-2 bg-main-600 text-white rounded hover:bg-main-700"
              >
                Добавить
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}

const DutyEntryForm = ({ duty, entry, onSave, onComplete, onPause, onResume, onRemove, uniqueKey }) => {
  const [value, setValue] = useState(entry?.value || '')
  const [comment, setComment] = useState(entry?.comment || '')
  const [checklistProgress, setChecklistProgress] = useState(entry?.checklistProgress || {})
  const [isEditing, setIsEditing] = useState(false)
  const [showIncompleteChecklistModal, setShowIncompleteChecklistModal] = useState(false)

  useEffect(() => {
    if (entry) {
      setValue(entry.value || '')
      setComment(entry.comment || '')
      setChecklistProgress(entry.checklistProgress || {})
    } else {
      setValue('')
      setComment('')
      setChecklistProgress({})
    }
    setIsEditing(false)
  }, [entry])

  const handleSave = () => {
    // Преобразуем ID в строку для консистентности и передаем uniqueKey
    onSave(String(duty._id), value, comment, uniqueKey, checklistProgress)
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (entry) {
      setValue(entry.value || '')
      setComment(entry.comment || '')
      setChecklistProgress(entry.checklistProgress || {})
    } else {
      setValue('')
      setComment('')
      setChecklistProgress({})
    }
    setIsEditing(false)
  }

  // Сортируем пункты чек-листа по order
  const sortedChecklistItems =
    duty.hasChecklist && duty.checklistItems
      ? [...duty.checklistItems].sort((a, b) => (a.order || 0) - (b.order || 0))
      : []

  const getChecklistCompletionCount = () => {
    if (!duty.hasChecklist || !duty.checklistItems) return null
    const completed = sortedChecklistItems.filter((item) => checklistProgress[item._id]).length
    return { completed, total: sortedChecklistItems.length }
  }

  const formatTime = (time) => {
    if (!time) return null
    // Если это Date объект или строка ISO
    const date = typeof time === 'string' ? new Date(time) : time
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      // Если это старая строка формата "HH:MM" или "DD.MM.YYYY HH:MM"
      if (typeof time === 'string') {
        const parts = time.split(' ')
        return parts.length > 1 ? parts[parts.length - 1] : time
      }
      return time
    }
    // Форматируем Date в "HH:MM"
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const getStatusIcon = () => {
    if (entry?.endTime) {
      return <FaCheckCircle className="text-green-500" size={20} title="Завершено" />
    }
    if (entry?.isPaused) {
      return <FaClock className="text-yellow-500" size={20} title="На паузе" />
    }
    if (entry?.startTime) {
      return <FaClock className="text-blue-500" size={20} title="В процессе" />
    }
    return <FaCircle className="text-gray-400" size={20} title="Не начато" />
  }

  const getTimeDisplay = () => {
    if (entry?.startTime && entry?.endTime) {
      return `${formatTime(entry.startTime)} - ${formatTime(entry.endTime)}`
    }
    if (entry?.isPaused && entry?.pausedAt) {
      return `Пауза с ${formatTime(entry.pausedAt)}`
    }
    if (entry?.startTime) {
      return `Начало: ${formatTime(entry.startTime)}`
    }
    return null
  }

  const checklistCompletion = getChecklistCompletionCount()

  const handleCompleteClick = () => {
    if (
      duty.hasChecklist &&
      checklistCompletion &&
      checklistCompletion.total > 0 &&
      checklistCompletion.completed < checklistCompletion.total
    ) {
      setShowIncompleteChecklistModal(true)
      return
    }
    if (onComplete) onComplete()
  }

  const handleConfirmComplete = () => {
    setShowIncompleteChecklistModal(false)
    if (onComplete) onComplete()
  }

  const handlePauseFromModal = () => {
    setShowIncompleteChecklistModal(false)
    if (onPause) onPause()
  }

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {getStatusIcon()}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold">{duty.name}</h3>
              {duty.isQuantitative && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                  Количественная
                </span>
              )}
              {duty.hasChecklist && checklistCompletion && (
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  Чек-лист: {checklistCompletion.completed}/{checklistCompletion.total}
                </span>
              )}
              {entry?.isPaused && !entry?.endTime && (
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded font-semibold">
                  На паузе
                </span>
              )}
              {getTimeDisplay() && (
                <span className="text-sm text-gray-500 whitespace-nowrap">{getTimeDisplay()}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {!isEditing && !entry?.endTime && entry?.startTime && entry?.isPaused && onResume && (
            <button
              type="button"
              onClick={onResume}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Продолжить
            </button>
          )}
          {!isEditing && !entry?.endTime && entry?.startTime && !entry?.isPaused && onPause && (
            <button
              type="button"
              onClick={onPause}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              На паузу
            </button>
          )}
          {!isEditing && !entry?.endTime && !entry?.isPaused && onComplete && (
            <button
              type="button"
              onClick={handleCompleteClick}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Завершить
            </button>
          )}
          {!isEditing && !entry?.isPaused && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-main-600 text-white rounded hover:bg-main-700"
            >
              {entry ? 'Редактировать' : 'Заполнить'}
            </button>
          )}
          {onRemove && !entry?.isPaused && (
            <button
              type="button"
              onClick={onRemove}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              title="Удалить обязанность из списка"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {showIncompleteChecklistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative">
            <button
              type="button"
              onClick={() => setShowIncompleteChecklistModal(false)}
              className="absolute text-gray-400 hover:text-gray-600 text-2xl leading-none"
              style={{ top: '12px', right: '12px' }}
              title="Закрыть"
            >
              ×
            </button>
            <div className="p-6 pr-10">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Вы уверены что хотите завершить?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Обязанность можно перевести в паузу.
                {checklistCompletion && (
                  <span className="block mt-2 text-purple-700">
                    Чек-лист заполнен: {checklistCompletion.completed} из{' '}
                    {checklistCompletion.total}
                  </span>
                )}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handlePauseFromModal}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-semibold"
                >
                  На паузу
                </button>
                <button
                  type="button"
                  onClick={handleConfirmComplete}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
                >
                  Хочу завершить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Чек-лист под статусом */}
      {duty.hasChecklist &&
        sortedChecklistItems.length > 0 &&
        entry?.startTime &&
        !entry?.endTime &&
        !entry?.isPaused && (
        <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="text-sm font-semibold text-purple-900 mb-2">Чек-лист</h4>
          <div className="space-y-2">
            {sortedChecklistItems.map((item) => (
              <label
                key={item._id}
                htmlFor={`checklist-${item._id}`}
                className="flex items-center gap-2 cursor-pointer hover:bg-purple-100 p-2 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  id={`checklist-${item._id}`}
                  checked={!!checklistProgress[item._id]}
                  onChange={() => {
                    const newProgress = {
                      ...checklistProgress,
                      [item._id]: !checklistProgress[item._id]
                    }
                    setChecklistProgress(newProgress)
                    // Автоматически сохраняем при изменении чек-листа
                    onSave(String(duty._id), value, comment, uniqueKey, newProgress)
                  }}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span
                  className={`text-sm ${
                    checklistProgress[item._id] ? 'line-through text-gray-500' : 'text-gray-700'
                  }`}
                >
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {isEditing ? (
        <div className="space-y-3 mt-4">
          {duty.isQuantitative ? (
            <div>
              <label
                htmlFor={`duty-quantity-${duty._id}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Количество
              </label>
              <div className="flex items-center gap-2">
                <input
                  id={`duty-quantity-${duty._id}`}
                  type="number"
                  min="0"
                  step="1"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-main-600"
                  placeholder="Введите количество"
                />
                <button
                  type="button"
                  onClick={() => {
                    const currentValue = Number(value) || 0
                    setValue(String(currentValue + 1))
                  }}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-bold"
                  title="Увеличить на 1"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const currentValue = Number(value) || 0
                    if (currentValue > 0) {
                      setValue(String(currentValue - 1))
                    }
                  }}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-bold"
                  title="Уменьшить на 1"
                >
                  −
                </button>
              </div>
            </div>
          ) : null}
          <div>
            <label
              htmlFor={`duty-comment-${duty._id}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Комментарий
            </label>
            <textarea
              id={`duty-comment-${duty._id}`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-main-600"
              rows="3"
              placeholder="Добавьте комментарий (необязательно)"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <div className="text-gray-600">
          {entry ? (
            <div>
              {duty.isQuantitative ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <p>
                    <strong>Количество:</strong>{' '}
                    <span className="text-lg font-semibold">{entry.value || '0'}</span>
                  </p>
                  {entry.isPaused && !entry.endTime && (
                    <p>
                      <strong>Статус:</strong>{' '}
                      <span className="text-yellow-600 font-semibold">На паузе</span>
                    </p>
                  )}
                </div>
              ) : (
                <p>
                  <strong>Статус:</strong>{' '}
                  {entry.endTime ? (
                    <span className="text-green-600 font-semibold">Выполнено</span>
                  ) : entry.isPaused ? (
                    <span className="text-yellow-600 font-semibold">На паузе</span>
                  ) : entry.startTime ? (
                    <span className="text-blue-600 font-semibold">В работе</span>
                  ) : (
                    <span className="text-gray-400">Не начато</span>
                  )}
                </p>
              )}
              {entry.comment && (
                <p className="mt-2">
                  <strong>Комментарий:</strong> {entry.comment}
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-400">Не заполнено</p>
          )}
        </div>
      )}
    </div>
  )
}

export default EmployeeJournal
