const EmployeeReport = require('../model/EmployeeReport')

const getBasicMonth = async (req, res, Model) => {
  try {
    const { month, year } = req.query

    // 1. Получаем все записи Shinomontazh за указанный месяц
    const shinomontazhList = await Model.find({
      $expr: {
        $and: [
          { $eq: [{ $year: '$dateFinish' }, Number(year)] },
          { $eq: [{ $month: '$dateFinish' }, Number(month)] }
        ]
      }
    })

    // 2. Для каждой записи обрабатываем массив employee
    const enhancedList = await Promise.all(
      shinomontazhList.map(async (record) => {
        // 3. Обрабатываем каждого сотрудника в массиве
        const enhancedEmployees = await Promise.all(
          record.employee.map(async (emp) => {
            // 4. Ищем соответствующие записи в EmployeeReport
            const reports = await EmployeeReport.find({
              employeeId: emp.id, // или emp.employeeId, в зависимости от структуры
              month: `${month.padStart(2, '0')}.${year}`
            })

            // предыдущий месяц
            const currentMonth = parseInt(month, 10)
            const currentYear = parseInt(year, 10)

            const prevMonthNum = currentMonth === 1 ? 12 : currentMonth - 1
            const prevMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear

            const prevMonthReports = await EmployeeReport.find({
              employeeId: emp.id, // или emp.employeeId, в зависимости от структуры
              month: `${prevMonthNum.toString().padStart(2, '0')}.${prevMonthYear}`
            })

            // 5. Возвращаем сотрудника с дополненными данными
            return {
              ...(emp.toObject ? emp.toObject() : emp),
              data: reports,
              prevMonthData: prevMonthReports
            }
          })
        )

        // 6. Возвращаем запись с обновленным массивом employee
        return {
          ...record.toObject(),
          employee: enhancedEmployees
        }
      })
    )

    return res.json({ status: 'ok', data: enhancedList })
  } catch (error) {
    console.error('Error in getMonth:', error)
    return res.status(500).json({ status: 'error', message: error.message })
  }
}

module.exports = { getBasicMonth }
