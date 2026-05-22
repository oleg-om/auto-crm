function parseCalendarParts(year, month, day) {
  const y = parseInt(year, 10)
  const m = parseInt(month, 10)
  const d = parseInt(day, 10)
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) {
    return null
  }
  if (m < 1 || m > 12 || d < 1 || d > 31) {
    return null
  }
  return { year: y, month: m, day: d }
}

/** $expr filter for preentry calendar day (dateStart or datePreentry). */
function buildPreentryDateExpr(year, month, day) {
  const parts = parseCalendarParts(year, month, day)
  if (!parts) return null
  const { year: y, month: m, day: d } = parts
  return {
    $expr: {
      $or: [
        {
          $and: [
            { $eq: [{ $year: '$dateStart' }, y] },
            { $eq: [{ $month: '$dateStart' }, m] },
            { $eq: [{ $dayOfMonth: '$dateStart' }, d] }
          ]
        },
        {
          $and: [
            { $eq: [{ $year: '$datePreentry' }, y] },
            { $eq: [{ $month: '$datePreentry' }, m] },
            { $eq: [{ $dayOfMonth: '$datePreentry' }, d] }
          ]
        }
      ]
    }
  }
}

module.exports = { parseCalendarParts, buildPreentryDateExpr }
