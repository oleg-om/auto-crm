const EmployeeReport = require('../model/EmployeeReport')

const getBasicMonth = async (req, res, Model) => {
  try {
    const { month, year } = req.query
    const monthNum = parseInt(month, 10)
    const yearNum = parseInt(year, 10)
    const monthPadded = month.padStart(2, '0')

    const nextMonthNum = monthNum === 12 ? 1 : monthNum + 1
    const nextYearNum = monthNum === 12 ? yearNum + 1 : yearNum
    const nextMonthPadded = nextMonthNum.toString().padStart(2, '0')

    const startDate = new Date(`${year}-${monthPadded}-01T00:00:00.000Z`)
    const endDate = new Date(`${nextYearNum}-${nextMonthPadded}-01T00:00:00.000Z`)

    const recordList = await Model.find({
      dateFinish: { $gte: startDate, $lt: endDate }
    })

    const allEmployeeIds = [
      ...new Set(recordList.flatMap((record) => record.employee.map((emp) => emp.id).filter(Boolean)))
    ]

    const prevMonthNum = monthNum === 1 ? 12 : monthNum - 1
    const prevMonthYear = monthNum === 1 ? yearNum - 1 : yearNum
    const currentMonthStr = `${monthPadded}.${year}`
    const prevMonthStr = `${prevMonthNum.toString().padStart(2, '0')}.${prevMonthYear}`

    const [currentMonthReports, prevMonthReports] = await Promise.all([
      EmployeeReport.find({ employeeId: { $in: allEmployeeIds }, month: currentMonthStr }),
      EmployeeReport.find({ employeeId: { $in: allEmployeeIds }, month: prevMonthStr })
    ])

    const groupById = (reports) =>
      reports.reduce((acc, r) => {
        if (!acc[r.employeeId]) acc[r.employeeId] = []
        acc[r.employeeId].push(r)
        return acc
      }, {})

    const currentById = groupById(currentMonthReports)
    const prevById = groupById(prevMonthReports)

    const enhancedList = recordList.map((record) => ({
      ...record.toObject(),
      employee: record.employee.map((emp) => ({
        ...(emp.toObject ? emp.toObject() : emp),
        data: currentById[emp.id] || [],
        prevMonthData: prevById[emp.id] || []
      }))
    }))

    return res.json({ status: 'ok', data: enhancedList })
  } catch (error) {
    console.error('Error in getMonth:', error)
    return res.status(500).json({ status: 'error', message: error.message })
  }
}

module.exports = { getBasicMonth }
