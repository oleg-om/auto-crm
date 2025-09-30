const Employee = require('../model/employee')
const EmployeeReport = require('../model/EmployeeReport')

// Вспомогательная функция для получения всех уникальных дней в диапазоне дат
function getUniqueDaysInRange(startDate, endDate) {
  const days = new Set()
  const current = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date(startDate)

  // Убедимся, что даты валидны
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(current.getTime())) return days
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(end.getTime())) end.setTime(current.getTime())

  // Нормализуем время до 00:00:00 для корректного сравнения дней
  current.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)

  // Добавляем все дни в диапазоне
  while (current <= end) {
    days.add(current.toISOString().split('T')[0]) // Формат: YYYY-MM-DD
    current.setDate(current.getDate() + 1)
  }

  return days
}

// Контроллер для группировки стоимости по сотрудникам
async function calculateTotalCostByEmployee(req, res, Model) {
  console.log('req', req.path)
  const isShinomontazh = req.path.includes('shinomontazh')
  try {
    // Получаем все заказы
    const { month, year } = req.query

    const orders = await Model.find({
      $expr: {
        $and: [
          { $eq: [{ $year: '$dateFinish' }, Number(year)] },
          { $eq: [{ $month: '$dateFinish' }, Number(month)] }
        ]
      }
    })

    // Получаем данные о сотрудниках для процента по Сто и по Шиномонтажу
    const employees = await Employee.find()
    const employeeData = employees.reduce((acc, emp) => {
      acc[emp.id] = {
        stoPercent: parseFloat(emp?.stoPercent) || 0, // Преобразуем stoPercent в число, если не число — 0,
        shinomontazhPercent: parseFloat(emp?.shinomontazhPercent) || 0, // Преобразуем stoPercent в число, если не число — 0
        oformlen: emp?.oformlen || false, // оформлен или нет
        oformlenNalog: parseFloat(emp?.oformlenNalog) || 0, // сумма налога
        cardSum: parseFloat(emp?.cardSum) || 0 // сумма на карту
      }
      return acc
    }, {})

    // Получаем данные из EmployeeReport для подсчета val
    const employeeReports = await EmployeeReport.find({
      month: `${month.padStart(2, '0')}.${year}`
    })
    const employeeSalaries = employeeReports.reduce((acc, report) => {
      const { employeeId } = report
      if (!acc[employeeId]) {
        acc[employeeId] = 0
      }
      acc[employeeId] += parseFloat(report.val) || 0 // Суммируем val, если не число — 0
      return acc
    }, {})

    // Объект для группировки по employee.id
    const groupedByEmployee = {}

    // Проходим по каждому заказу
    orders.forEach((order) => {
      // Проверяем статус оплаты
      // if (order?.payment !== 'yes' || !order?.dateFinish) {
      //   return
      // }

      if (!['Оплачено', 'Безнал', 'Терминал', 'Комбинированный'].includes(order.status)) {
        return
      }

      // Проверяем, есть ли сотрудники в заказе
      if (order.employee && Array.isArray(order.employee)) {
        order.employee.forEach((emp) => {
          const employeeId = emp.id

          // Инициализируем объект для сотрудника, если его еще нет
          if (!groupedByEmployee[employeeId]) {
            groupedByEmployee[employeeId] = {
              employeeName: `${emp.name || ''} ${emp.surname || ''}`.trim(),
              totalServicesCost: 0,
              totalMaterialCost: 0,
              totalCost: 0,
              percent: 0,
              oformlen: employeeData[employeeId]?.oformlen || false,
              oformlenNalog: employeeData[employeeId]?.oformlenNalog || 0,
              cardSum: employeeData[employeeId]?.cardSum || 0,
              uniqueWorkDays: new Set(),
              advances: employeeSalaries[employeeId] || 0,
              salary: 0, // Зарплата,
              rest: 0 // остаток
            }
          }

          // Выбираем процент
          if (isShinomontazh) {
            groupedByEmployee[employeeId].percent =
              employeeData[employeeId]?.shinomontazhPercent || 0
          } else {
            groupedByEmployee[employeeId].percent = employeeData[employeeId]?.stoPercent || 0
          }

          // Подсчет стоимости услуг (services)
          if (order.services && Array.isArray(order.services)) {
            order.services.forEach((service) => {
              const price = parseFloat(service.price) || 0
              const quantity = Number(service.quantity) || 0
              groupedByEmployee[employeeId].totalServicesCost += price * quantity
            })
          }

          // Подсчет стоимости материалов (material)
          if (order.material && Array.isArray(order.material)) {
            order.material.forEach((mat) => {
              const price = parseFloat(mat.price) || 0
              const quantity = Number(mat.quantity) || 0
              groupedByEmployee[employeeId].totalMaterialCost += price * quantity
            })
          }

          // считаем сумму услуг и материалов
          groupedByEmployee[employeeId].totalCost =
            groupedByEmployee[employeeId].totalServicesCost +
            groupedByEmployee[employeeId].totalMaterialCost

          // Подсчет зарплаты
          const { percent, totalCost, cardSum, advances } = groupedByEmployee[employeeId]

          groupedByEmployee[employeeId].salary = Math.round((totalCost * percent) / 100)
          groupedByEmployee[employeeId].rest = Math.round(
            groupedByEmployee[employeeId].salary - (cardSum + advances)
          )

          // Получаем уникальные дни из диапазона dateStart и dateFinish
          const uniqueDays = getUniqueDaysInRange(order.dateStart, order.dateFinish)
          uniqueDays.forEach((day) => groupedByEmployee[employeeId].uniqueWorkDays.add(day))
        })
      }
    })

    // Преобразуем объект в массив для ответа
    const result = Object.keys(groupedByEmployee).map((employeeId) => ({
      employeeId,
      employeeName: groupedByEmployee[employeeId].employeeName,
      totalServicesCost: groupedByEmployee[employeeId].totalServicesCost,
      totalMaterialCost: groupedByEmployee[employeeId].totalMaterialCost,
      totalCost:
        groupedByEmployee[employeeId].totalServicesCost +
        groupedByEmployee[employeeId].totalMaterialCost,
      percent: groupedByEmployee[employeeId].percent,
      oformlen: groupedByEmployee[employeeId]?.oformlen,
      oformlenNalog: groupedByEmployee[employeeId]?.oformlenNalog,
      cardSum: groupedByEmployee[employeeId]?.cardSum,
      uniqueWorkDaysCount: groupedByEmployee[employeeId].uniqueWorkDays.size,
      advances: groupedByEmployee[employeeId].advances,
      salary: groupedByEmployee[employeeId].salary,
      rest: groupedByEmployee[employeeId].rest
    }))

    // Возвращаем результат
    res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error calculating total cost by employee:', error)
    res.status(500).json({
      success: false,
      message: 'Error calculating total cost by employee',
      error: error.message
    })
  }
}

module.exports = {
  calculateTotalCostByEmployee
}
