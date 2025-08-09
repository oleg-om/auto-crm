import React, { useState } from 'react'

const WorkingDaysCell = ({ value }) => {
  // const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempValue, setTempValue] = useState(value)

  const handleSave = async () => {
    // dispatch(updateEmployee(emplId, {}))
    setIsModalOpen(false)
  }

  const handleChange = (v) => {
    setTempValue(v)
  }

  return (
    <div className="relative">
      {/* Основная ячейка */}
      <button type="button" onClick={() => setIsModalOpen(false)}>
        {value} дней
      </button>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-lg font-bold mb-4">Изменить рабочие дни</h2>

            <div className="flex items-center mb-2">
              <input
                type="number"
                value={tempValue}
                onChange={(e) => handleChange(e.target.value)}
                className="w-24 p-1 border rounded mr-2"
                placeholder="Кол-во"
              />
            </div>

            {/* Кнопки управления модальным окном */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded mr-2"
                onClick={() => {
                  setIsModalOpen(false)
                  setTempValue(value)
                }}
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

export default WorkingDaysCell
