import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { FaCheckCircle, FaClock, FaCircle } from 'react-icons/fa'
import Navbar from '../Navbar'
import Modal from '../Modal.delete'
import { getPositions } from '../../redux/reducers/positions'
import standardDutiesList from '../../lists/standard-duties-list'
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

  // Найти сотрудника по userName из auth (userName в аккаунте содержит id сотрудника)
  const currentEmployee = employees.find((emp) => emp.id === auth.user?.userName)

  useEffect(() => {
    dispatch(getPositions())
  }, [dispatch])

  const loadWorkDayStart = async () => {
    if (!currentEmployee) return

    try {
      const response = await fetch(
        `/api/v1/workDayStart/employee/${currentEmployee.id}/date/${selectedDate}`
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
    if (!currentEmployee || !currentEmployee.positionId) {
      notify('Должность не назначена. Обратитесь к администратору.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `/api/v1/journalEntry/employee/${currentEmployee.id}/date/${selectedDate}`
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
          employeeId: currentEmployee.id,
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
          employeeId: currentEmployee.id,
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
    if (currentEmployee) {
      loadWorkDayStart()
      if (currentEmployee.positionId) {
        loadEntries()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, currentEmployee?.id, currentEmployee?.positionId])

  const handleSaveEntry = async (dutyId, value, comment, uniqueKey) => {
    if (!currentEmployee || !currentEmployee.positionId) {
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

    try {
      const response = await fetch('/api/v1/journalEntry/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          entryId: entryKey, // Используем ID записи из БД
          employeeId: currentEmployee.id,
          positionId: currentEmployee.positionId,
          dutyId: dutyIdStr,
          date: selectedDate,
          value,
          comment,
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
    if (!currentEmployee || !currentEmployee.positionId) {
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
    const now = new Date()
    const endTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`

    try {
      const response = await fetch('/api/v1/journalEntry/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          entryId: entryKey, // Используем ID записи из БД
          employeeId: currentEmployee.id,
          positionId: currentEmployee.positionId,
          dutyId: dutyIdStr,
          date: selectedDate,
          value: currentEntry?.value,
          comment: currentEntry?.comment,
          startTime: currentEntry?.startTime,
          endTime
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

  const currentPosition = positions.find((p) => p.id === currentEmployee.positionId)

  if (!currentPosition) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 mb-4">
          <h1 className="text-3xl py-4 border-b mb-6">Электронный журнал</h1>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
            <p>Должность не назначена. Обратитесь к администратору.</p>
          </div>
        </div>
      </div>
    )
  }

  const sortedDuties = [...(currentPosition.duties || [])].sort((a, b) => {
    const orderA = a.order !== undefined ? a.order : 0
    const orderB = b.order !== undefined ? b.order : 0
    return orderA - orderB
  })

  // Используем sortedDuties в handleAddStandardDuty
  // Объявляем функцию после определения sortedDuties

  // Получаем все обязанности, которые были добавлены (с учетом повторений)
  // Создаем массив объектов с уникальными ключами для каждой добавленной обязанности
  const addedDuties = addedDutyIds
    .map((entryId, index) => {
      // Находим запись по ID из БД
      const entry = entries[entryId]
      if (!entry) return null

      // Находим обязанность по dutyId из записи
      const duty = sortedDuties.find((d) => d._id.toString() === entry.dutyId)
      return duty ? { ...duty, uniqueKey: entryId, index } : null
    })
    .filter(Boolean)

  // Все обязанности доступны для добавления (можно добавлять повторно)
  const availableDuties = sortedDuties

  const handleAddDuty = async (dutyId) => {
    if (!currentEmployee || !currentEmployee.positionId) {
      notify('Должность не назначена')
      return
    }

    const dutyIdStr = String(dutyId)

    // Записываем время начала при добавлении обязанности
    const now = new Date()
    const startTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`

    try {
      // Сразу создаем запись в БД с временем начала
      const response = await fetch('/api/v1/journalEntry/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employeeId: currentEmployee.id,
          positionId: currentEmployee.positionId,
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
    if (!currentEmployee || !currentEmployee.positionId) {
      notify('Должность не назначена')
      return
    }

    try {
      // Проверяем, есть ли уже такая обязанность в должности
      const existingDuty = sortedDuties.find(
        (d) => d.name.toLowerCase() === standardDuty.name.toLowerCase()
      )

      let dutyId
      if (existingDuty) {
        // Используем существующую обязанность
        dutyId = existingDuty._id.toString()
      } else {
        // Создаем новую обязанность в должности
        const addDutyResponse = await fetch(`/api/v1/position/${currentEmployee.positionId}/duty`, {
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
      const now = new Date()
      const startTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`

      const response = await fetch('/api/v1/journalEntry/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employeeId: currentEmployee.id,
          positionId: currentEmployee.positionId,
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
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{currentPosition.name}</span>
              {' - '}
              <span>
                {currentEmployee.name} {currentEmployee.surname}
              </span>
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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Начало рабочего дня:{' '}
                      <span className="font-medium">{workDayData.startTime}</span>
                    </p>
                    {workDayData.endTime && (
                      <p className="text-sm text-gray-600 mt-1">
                        Окончание рабочего дня:{' '}
                        <span className="font-medium">{workDayData.endTime}</span>
                      </p>
                    )}
                  </div>
                  {!workDayEnded && (
                    <button
                      type="button"
                      onClick={handleEndWorkDay}
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
                {addedDuties.length === 0 ? (
                  <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
                    Нет добавленных обязанностей. Нажмите Добавить обязанность чтобы начать.
                  </div>
                ) : (
                   addedDuties.map((duty) => {
                     const entry = entries[duty.uniqueKey]
                     return (
                       <DutyEntryForm
                         key={duty.uniqueKey}
                         duty={duty}
                         entry={entry}
                         onSave={handleSaveEntry}
                         onComplete={() => handleCompleteDuty(duty._id, duty.uniqueKey, duty)}
                         onRemove={() => handleRemoveDutyClick(duty.uniqueKey)}
                         uniqueKey={duty.uniqueKey}
                       />
                     )
                   })
                )}

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
    </div>
  )
}

const AddDutyModal = ({ availableDuties, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">Выберите обязанность</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {availableDuties.length === 0 ? (
            <p className="text-gray-500">Нет доступных обязанностей</p>
          ) : (
            availableDuties.map((duty) => (
              <button
                key={duty._id}
                type="button"
                onClick={() => onSelect(duty._id.toString())}
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
          {standardDuties.map((standardDuty, index) => (
            <div
              key={index}
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

const DutyEntryForm = ({ duty, entry, onSave, onComplete, onRemove, uniqueKey }) => {
  const [value, setValue] = useState(entry?.value || '')
  const [comment, setComment] = useState(entry?.comment || '')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (entry) {
      setValue(entry.value || '')
      setComment(entry.comment || '')
    } else {
      setValue('')
      setComment('')
    }
    setIsEditing(false)
  }, [entry])

  const handleSave = () => {
    // Преобразуем ID в строку для консистентности и передаем uniqueKey
    onSave(String(duty._id), value, comment, uniqueKey)
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (entry) {
      setValue(entry.value || '')
      setComment(entry.comment || '')
    } else {
      setValue('')
      setComment('')
    }
    setIsEditing(false)
  }

  const formatTime = (time) => {
    if (!time) return null
    return time
  }

  const getStatusIcon = () => {
    if (entry?.endTime) {
      return <FaCheckCircle className="text-green-500" size={20} title="Завершено" />
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
    if (entry?.startTime) {
      return `Начало: ${formatTime(entry.startTime)}`
    }
    return null
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
              {getTimeDisplay() && (
                <span className="text-sm text-gray-500 whitespace-nowrap">{getTimeDisplay()}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {!isEditing && !entry?.endTime && onComplete && (
            <button
              type="button"
              onClick={onComplete}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Завершить
            </button>
          )}
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-main-600 text-white rounded hover:bg-main-700"
            >
              {entry ? 'Редактировать' : 'Заполнить'}
            </button>
          )}
          {onRemove && (
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

      {isEditing ? (
        <div className="space-y-3">
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
                <div className="flex items-center gap-2">
                  <p>
                    <strong>Количество:</strong>{' '}
                    <span className="text-lg font-semibold">{entry.value || '0'}</span>
                  </p>
                </div>
              ) : (
                <p>
                  <strong>Статус:</strong>{' '}
                  {entry.endTime ? (
                    <span className="text-green-600 font-semibold">Выполнено</span>
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
