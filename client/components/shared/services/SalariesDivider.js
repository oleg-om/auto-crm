import React, { useEffect, useState } from 'react'

export const checkSalariesIsNotValid = (employees) => {
  const everyHasPercent = employees.every((e) => e?.salaryPercent)

  const total = employees.reduce((s, e) => s + Number(e?.salaryPercent || 0), 0)
  const notValid = total !== 100

  if (!total) {
    return false
  }

  if (!everyHasPercent) {
    return true
  }

  return notValid
}

export default function SalaryPercentModal({ employees, setEmployees }) {
  const [open, setOpen] = useState(false)
  const [localEmployees, setLocalEmployees] = useState([])

  // Проверяем, есть ли разные роли
  const hasDifferentRoles = (() => {
    const roles = employees.map((e) => e.role)
    return new Set(roles).size > 1
  })()

  // Делим проценты поровну
  const getEqualDistribution = () => {
    const equal = Math.floor(100 / employees.length)
    return employees.map((e, i) => ({
      ...e,
      salaryPercent:
        e.salaryPercent != null
          ? e.salaryPercent
          : i === employees.length - 1
          ? 100 - equal * (employees.length - 1)
          : equal
    }))
  }

  // Открыть модалку
  const openModal = () => {
    if (!hasDifferentRoles) return
    setLocalEmployees(getEqualDistribution())
    setOpen(true)
  }

  useEffect(() => {
    if (!hasDifferentRoles) return

    // если модалка открыта — ничего не делаем
    if (open) return

    // если модалка закрыта — распределяем заново
    setLocalEmployees(getEqualDistribution())
    console.log('open', getEqualDistribution())
  }, [employees, open])

  const closeModal = () => {
    setOpen(false)
  }

  const handlePercentChange = (id, value) => {
    let val = Number(value)

    if (val < 0) val = 0
    if (val > 100) val = 100

    const updated = localEmployees.map((e) =>
      e.id === id ? { ...e, salaryPercent: val } : { ...e }
    )

    // Остаток = 100 - процент выбранного
    const chosen = updated.find((e) => e.id === id)
    const others = updated.filter((e) => e.id !== id)

    const rest = 100 - chosen.salaryPercent

    if (rest < 0) return // не даём превышать

    const equal = others.length ? Math.floor(rest / others.length) : 0
    const remainder = others.length ? rest - equal * others.length : 0

    const redistributed = updated.map((e) => {
      if (e.id === id) return e

      const index = others.findIndex((o) => o.id === e.id)

      return {
        ...e,
        salaryPercent:
          index === others.length - 1
            ? equal + remainder // последнему отдаём остаток
            : equal
      }
    })

    setLocalEmployees(redistributed)
  }

  const total = localEmployees.reduce((s, e) => s + Number(e.salaryPercent), 0)
  const valid = total === 100

  const handleSave = () => {
    if (!valid) return
    setEmployees(localEmployees)
    closeModal()
  }

  function getRole(role) {
    if (role === 'main') return 'Старший'
    if (role === 'second') return 'Исполнитель'
    if (role === 'student') return 'Студент'
    return role
  }

  if (!hasDifferentRoles) {
    return null
  }

  return (
    <div>
      {/* Кнопка открытия */}
      {hasDifferentRoles && (
        <button
          type="button"
          onClick={openModal}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mx-3 mb-4"
        >
          Распределить проценты
        </button>
      )}

      {/* Модалка */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Распределение процентов</h2>

            <div className="space-y-3 max-h-80 overflow-auto pr-1">
              {localEmployees.map((e) => (
                <div key={e.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    {e.surname} {e.name}
                    <div className="text-xs text-gray-500">{getRole(e.role)}</div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={e.salaryPercent}
                      onChange={(ev) => handlePercentChange(e.id, ev.target.value)}
                      onFocus={(ev) => {
                        if (ev.target.value === '0') {
                          // eslint-disable-next-line no-param-reassign
                          ev.target.value = ''
                        }
                      }}
                      className="w-20 border px-2 py-1 rounded"
                      min="0"
                      max="100"
                    />
                    <span>%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Сумма */}
            <div
              className={`mt-3 text-sm font-semibold ${valid ? 'text-green-600' : 'text-red-600'}`}
            >
              {valid ? '✅ Сумма: 100%' : `⚠️ Сумма должна быть 100%, сейчас: ${total}%`}
            </div>

            {/* Кнопки */}
            <div className="flex justify-end space-x-3 mt-5">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Отмена
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={!valid}
                className={`px-4 py-2 rounded text-white ${
                  valid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
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
