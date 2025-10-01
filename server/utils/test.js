const dayjs = require('dayjs')
const Employee = require('../model/employee')
const EmployeeReport = require('../model/EmployeeReport')
// const statuses = require('../../common/enums/shinomontazh-statuses')

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

function roundObject(obj) {
  Object.keys(obj).forEach((key) => {
    const value = obj[key]

    if (typeof value === 'number') {
      // eslint-disable-next-line no-param-reassign
      obj[key] = Math.round(value)
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      roundObject(value) // рекурсия
    }
  })
}

function groupOrdersByDate(orders) {
  return orders
    .sort((a, b) => new Date(b.dateFinish) - new Date(a.dateFinish)) // от новых к старым
    .reduce((acc, order) => {
      const key = dayjs(order.dateFinish).format('DD.MM.YYYY')

      if (!acc[key]) acc[key] = []
      acc[key].push(order)

      return acc
    }, {})
}

// Контроллер для группировки стоимости по сотрудникам
async function calculateTotalCostByEmployee(req, res, Model) {
  const isShinomontazh = req.path.includes('shinomontazh')
  try {
    // Получаем все заказы
    const { month, year } = req.body

    const day = req.body?.day
    const employee = req.body?.employee
    const countMaterials = req.body?.countMaterials
    const countOnlyPaidOrders = req.body?.countOnlyPaidOrders

    const orders = await Model.find({
      $expr: {
        $and: [
          { $eq: [{ $year: '$dateFinish' }, Number(year)] },
          { $eq: [{ $month: '$dateFinish' }, Number(month)] },
          ...(day ? [{ $eq: [{ $dayOfMonth: '$dateFinish' }, Number(day)] }] : []),
          ...(employee
            ? [
                {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: '$employee',
                          cond: { $eq: ['$$this.id', employee] }
                        }
                      }
                    },
                    0
                  ]
                }
              ]
            : [])
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
      month: `${month}.${year}`
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
              total: {
                all: { totalServicesCost: 0, totalMaterialCost: 0, totalCost: 0 },
                cash: { totalServicesCost: 0, totalMaterialCost: 0, totalCost: 0 },
                terminal: { totalServicesCost: 0, totalMaterialCost: 0, totalCost: 0 },
                cashless: { totalServicesCost: 0, totalMaterialCost: 0, totalCost: 0 },
                discount: { totalServicesCost: 0, totalMaterialCost: 0, totalCost: 0 }
              },
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

          // функция для подсчета услуг или материалов
          function calculateMaterialOrService(item) {
            const price = parseFloat(item.price) || 0

            const quantity = Number(item.quantity) || 0

            let total = price * quantity

            const discount = parseFloat(order?.discount) || 0
            const numberPercent = (total / 100) * discount

            if (discount) {
              total = numberPercent
            }

            if (countOnlyPaidOrders) {
              if (order?.payment !== 'cancel' && order?.payment !== 'no') {
                return total / order.employee.length
              }
            } else if (order?.payment === 'cancel' || order?.payment === 'no') {
              return total / order.employee.length
            }

            return 0
          }

          // Подсчет стоимости услуг (services)
          if (order.services && Array.isArray(order.services)) {
            // eslint-disable-next-line consistent-return
            order.services.forEach((service) => {
              const total = calculateMaterialOrService(service)
              groupedByEmployee[employeeId].total.all.totalServicesCost += total

              if (order.status === 'Комбинированный') {
                if (order?.combTerm) {
                  groupedByEmployee[employeeId].total.terminal.totalServicesCost += parseFloat(
                    order.combTerm || 0
                  )
                }

                if (order?.combCash) {
                  groupedByEmployee[employeeId].total.cash.totalServicesCost += parseFloat(
                    order.combCash || 0
                  )
                }
              }

              if (service.free === 'yes') {
                groupedByEmployee[employeeId].total.discount.totalServicesCost += total
              }

              if (order.status === 'Безнал') {
                groupedByEmployee[employeeId].total.cashless.totalServicesCost += total
              }

              if (order.status === 'Терминал') {
                groupedByEmployee[employeeId].total.terminal.totalServicesCost += total
              }

              if (order.status === 'Оплачено') {
                groupedByEmployee[employeeId].total.cash.totalServicesCost += total
              }
            })
          }

          // Подсчет стоимости материалов (material)
          if (order.material && Array.isArray(order.material)) {
            order.material.forEach((mat) => {
              const total = calculateMaterialOrService(mat)
              groupedByEmployee[employeeId].total.all.totalMaterialCost += total

              if (mat.free === 'yes') {
                groupedByEmployee[employeeId].total.discount.totalMaterialCost += total
              }

              if (order.status === 'Безнал') {
                groupedByEmployee[employeeId].total.cashless.totalMaterialCost += total
              }

              if (order.status === 'Терминал') {
                groupedByEmployee[employeeId].total.terminal.totalMaterialCost += total
              }

              if (order.status === 'Оплачено') {
                groupedByEmployee[employeeId].total.cash.totalServicesCost += total
              }
            })
          }

          // Округление всех сумм услуг и материалов
          roundObject(groupedByEmployee[employeeId].total)

          // считаем сумму услуг и материалов
          const totals = groupedByEmployee[employeeId].total

          Object.keys(totals).forEach((key) => {
            const item = totals[key]

            if (countMaterials) {
              item.totalCost = item.totalServicesCost + item.totalMaterialCost
            } else {
              item.totalCost = item.totalServicesCost
            }
          })

          // Подсчет зарплаты
          const { percent, total, cardSum, advances } = groupedByEmployee[employeeId]

          groupedByEmployee[employeeId].salary = Math.round((total.all.totalCost * percent) / 100)
          groupedByEmployee[employeeId].rest = Math.round(
            groupedByEmployee[employeeId].salary - (cardSum + advances)
          )

          // Получаем уникальные дни из диапазона dateStart и dateFinish
          const uniqueDays = getUniqueDaysInRange(order.dateStart, order.dateFinish)
          uniqueDays.forEach((d) => groupedByEmployee[employeeId].uniqueWorkDays.add(d))
        })
      }
    })

    // Считаем total
    const total = {
      all: 0,
      cashless: 0,
      terminal: 0,
      cash: 0,
      discount: 0
    }

    // Преобразуем объект в массив для ответа
    const result = Object.keys(groupedByEmployee).map((employeeId) => {
      total.all += groupedByEmployee[employeeId].total.all.totalCost
      total.cashless += groupedByEmployee[employeeId].total.cashless.totalCost
      total.terminal += groupedByEmployee[employeeId].total.terminal.totalCost
      total.cash += groupedByEmployee[employeeId].total.cash.totalCost
      total.discount += groupedByEmployee[employeeId].total.discount.totalCost

      // Округление total
      roundObject(total)

      return {
        employeeId,
        employeeName: groupedByEmployee[employeeId].employeeName,
        total: groupedByEmployee[employeeId].total,
        percent: groupedByEmployee[employeeId].percent,
        oformlen: groupedByEmployee[employeeId]?.oformlen,
        oformlenNalog: groupedByEmployee[employeeId]?.oformlenNalog,
        cardSum: groupedByEmployee[employeeId]?.cardSum,
        uniqueWorkDaysCount: groupedByEmployee[employeeId].uniqueWorkDays.size,
        advances: groupedByEmployee[employeeId].advances,
        salary: groupedByEmployee[employeeId].salary,
        rest: groupedByEmployee[employeeId].rest
      }
    })

    // Возвращаем результат
    res.status(200).json({
      success: true,
      data: result.sort((a, b) => a.employeeName.localeCompare(b.employeeName)),
      total,
      orders: day || employee ? groupOrdersByDate(orders) : []
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
