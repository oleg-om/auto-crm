import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { addDuty, updateDuty, deleteDuty, reorderDuties, updatePosition } from '../../redux/reducers/positions'
import DutyRow from './DutyRow'
import 'react-toastify/dist/ReactToastify.css'

const PositionTab = ({ position }) => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const dispatch = useDispatch()
  const [newDutyName, setNewDutyName] = useState('')
  const [newDutyIsQuantitative, setNewDutyIsQuantitative] = useState(false)
  const [newDutyCompletionTimeMinutes, setNewDutyCompletionTimeMinutes] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingDutyId, setEditingDutyId] = useState(null)
  const [workDayStartTime, setWorkDayStartTime] = useState(position.workDayStartTime || '')
  const [workDayEndTime, setWorkDayEndTime] = useState(position.workDayEndTime || '')
  const [isEditingWorkTime, setIsEditingWorkTime] = useState(false)

  useEffect(() => {
    setWorkDayStartTime(position.workDayStartTime || '')
    setWorkDayEndTime(position.workDayEndTime || '')
  }, [position.workDayStartTime, position.workDayEndTime])

  const handleSaveWorkTime = () => {
    dispatch(
      updatePosition(position.id, {
        workDayStartTime: workDayStartTime || null,
        workDayEndTime: workDayEndTime || null
      })
    ).then(() => {
      setIsEditingWorkTime(false)
      notify('Время работы обновлено')
    })
  }

  const sortedDuties = [...(position.duties || [])].sort((a, b) => {
    const orderA = a.order !== undefined ? a.order : 0
    const orderB = b.order !== undefined ? b.order : 0
    return orderA - orderB
  })

  const handleAddDuty = () => {
    if (!newDutyName.trim()) {
      notify('Введите название обязанности')
      return
    }
    dispatch(
      addDuty(position.id, {
        name: newDutyName.trim(),
        isQuantitative: newDutyIsQuantitative,
        completionTimeMinutes: newDutyCompletionTimeMinutes ? Number(newDutyCompletionTimeMinutes) : null
      })
    ).then(() => {
      setNewDutyName('')
      setNewDutyIsQuantitative(false)
      setNewDutyCompletionTimeMinutes('')
      setShowAddForm(false)
      notify('Обязанность добавлена')
    })
  }

  const handleUpdateDuty = (dutyId, updates) => {
    dispatch(updateDuty(position.id, dutyId, updates)).then(() => {
      setEditingDutyId(null)
      notify('Обязанность обновлена')
    })
  }

  const handleDeleteDuty = (dutyId) => {
    dispatch(deleteDuty(position.id, dutyId)).then(() => {
      notify('Обязанность удалена')
    })
  }

  const handleMoveDuty = (dutyId, direction) => {
    const currentIndex = sortedDuties.findIndex((d) => d._id === dutyId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= sortedDuties.length) return

    const newDutyIds = [...sortedDuties.map((d) => d._id.toString())]
    const [moved] = newDutyIds.splice(currentIndex, 1)
    newDutyIds.splice(newIndex, 0, moved)

    dispatch(reorderDuties(position.id, newDutyIds)).then(() => {
      notify('Порядок изменен')
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">{position.name}</h2>

      {/* Время работы */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-700">Время работы</h3>
          {!isEditingWorkTime && (
            <button
              type="button"
              onClick={() => setIsEditingWorkTime(true)}
              className="text-sm text-main-600 hover:text-main-700"
            >
              Редактировать
            </button>
          )}
        </div>
        {isEditingWorkTime ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="workDayStartTime" className="block text-sm text-gray-700 mb-1">
                  Начало рабочего дня
                </label>
                <input
                  type="time"
                  id="workDayStartTime"
                  value={workDayStartTime}
                  onChange={(e) => setWorkDayStartTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-main-600"
                />
              </div>
              <div>
                <label htmlFor="workDayEndTime" className="block text-sm text-gray-700 mb-1">
                  Конец рабочего дня
                </label>
                <input
                  type="time"
                  id="workDayEndTime"
                  value={workDayEndTime}
                  onChange={(e) => setWorkDayEndTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-main-600"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveWorkTime}
                className="px-4 py-2 bg-main-600 text-white rounded hover:bg-main-700"
              >
                Сохранить
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditingWorkTime(false)
                  setWorkDayStartTime(position.workDayStartTime || '')
                  setWorkDayEndTime(position.workDayEndTime || '')
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            {workDayStartTime || workDayEndTime ? (
              <div>
                {workDayStartTime && <span>Начало: {workDayStartTime}</span>}
                {workDayStartTime && workDayEndTime && <span className="mx-2">•</span>}
                {workDayEndTime && <span>Конец: {workDayEndTime}</span>}
              </div>
            ) : (
              <span className="text-gray-400">Время работы не установлено</span>
            )}
          </div>
        )}
      </div>

      {/* Список обязанностей */}
      <div className="mb-4">
        {sortedDuties.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Нет обязанностей. Добавьте первую обязанность.
          </div>
        ) : (
          <div className="space-y-2">
            {sortedDuties.map((duty, index) => (
              <DutyRow
                key={duty._id}
                duty={duty}
                isEditing={editingDutyId === duty._id}
                onEdit={() => setEditingDutyId(duty._id)}
                onCancel={() => setEditingDutyId(null)}
                onUpdate={(updates) => handleUpdateDuty(duty._id, updates)}
                onDelete={() => handleDeleteDuty(duty._id)}
                onMoveUp={index > 0 ? () => handleMoveDuty(duty._id, 'up') : null}
                onMoveDown={
                  index < sortedDuties.length - 1
                    ? () => handleMoveDuty(duty._id, 'down')
                    : null
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Форма добавления обязанности */}
      {!showAddForm ? (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-main-600 hover:text-main-600 transition-colors"
        >
          + Добавить обязанность
        </button>
      ) : (
        <div className="border-2 border-main-600 rounded-lg p-4 space-y-3">
          <input
            type="text"
            value={newDutyName}
            onChange={(e) => setNewDutyName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddDuty()
              }
            }}
            placeholder="Название обязанности"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-main-600"
            autoFocus
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isQuantitative"
              checked={newDutyIsQuantitative}
              onChange={(e) => setNewDutyIsQuantitative(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="isQuantitative" className="text-gray-700">
              Количественная обязанность
            </label>
          </div>
          <div>
            <label htmlFor="completionTimeMinutes" className="block text-sm text-gray-700 mb-1">
              Норма выполнения (минуты)
              {newDutyIsQuantitative && (
                <span className="text-gray-500 font-normal"> - для количественных обязанностей время указывается для 1 шт</span>
              )}
            </label>
            <input
              type="number"
              id="completionTimeMinutes"
              min="0"
              value={newDutyCompletionTimeMinutes}
              onChange={(e) => setNewDutyCompletionTimeMinutes(e.target.value)}
              placeholder="Необязательно"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-main-600"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddDuty}
              className="flex-1 px-4 py-2 bg-main-600 text-white rounded hover:bg-main-700"
            >
              Добавить
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false)
                setNewDutyName('')
                setNewDutyIsQuantitative(false)
                setNewDutyCompletionTimeMinutes('')
              }}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PositionTab

