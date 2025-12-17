import React, { useState } from 'react'

const DutyRow = ({
  duty,
  isEditing,
  onEdit,
  onCancel,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown
}) => {
  const [name, setName] = useState(duty.name)
  const [isQuantitative, setIsQuantitative] = useState(duty.isQuantitative || false)
  const [completionTimeMinutes, setCompletionTimeMinutes] = useState(
    duty.completionTimeMinutes ? String(duty.completionTimeMinutes) : ''
  )

  const handleSave = () => {
    onUpdate({
      name: name.trim(),
      isQuantitative,
      completionTimeMinutes: completionTimeMinutes ? Number(completionTimeMinutes) : null
    })
  }

  const handleCancel = () => {
    setName(duty.name)
    setIsQuantitative(duty.isQuantitative || false)
    setCompletionTimeMinutes(duty.completionTimeMinutes ? String(duty.completionTimeMinutes) : '')
    onCancel()
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-3 p-3 border-2 border-main-600 rounded-lg bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-main-600"
              autoFocus
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isQuantitative}
              onChange={(e) => setIsQuantitative(e.target.checked)}
              className="mr-2"
            />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
            <label className="text-sm text-gray-700">Количественная</label>
          </div>
        </div>
        <div>
          <label htmlFor={`completionTime-${duty._id}`} className="block text-sm text-gray-700 mb-1">
            Норма выполнения (минуты)
            {isQuantitative && (
              <span className="text-gray-500 font-normal"> - для количественных обязанностей время указывается для 1 шт</span>
            )}
          </label>
          <input
            type="number"
            id={`completionTime-${duty._id}`}
            min="0"
            value={completionTimeMinutes}
            onChange={(e) => setCompletionTimeMinutes(e.target.value)}
            placeholder="Необязательно"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-main-600"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            ✓
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 p-3 border rounded-lg bg-white hover:bg-gray-50">
      {/* Кнопки перемещения */}
      <div className="flex flex-col gap-1">
        {onMoveUp && (
          <button
            type="button"
            onClick={onMoveUp}
            className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            title="Вверх"
          >
            ↑
          </button>
        )}
        {onMoveDown && (
          <button
            type="button"
            onClick={onMoveDown}
            className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            title="Вниз"
          >
            ↓
          </button>
        )}
      </div>

      {/* Название обязанности */}
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium">{duty.name}</span>
          {duty.isQuantitative && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
              Количественная
            </span>
          )}
          {duty.completionTimeMinutes && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
              Норма: {duty.completionTimeMinutes} мин.
            </span>
          )}
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="px-3 py-1 text-sm bg-main-500 text-white rounded hover:bg-main-600"
        >
          Редактировать
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
        >
          Удалить
        </button>
      </div>
    </div>
  )
}

export default DutyRow
