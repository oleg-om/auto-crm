// Electronic journal records (server/model/journalEntry.js, server/model/workDayStart.js) bucket
// every record by calendar day using a `date` field stored at exact UTC midnight - not the
// server process's local midnight.
//
// The controllers used to build that boundary with `new Date(dateString); date.setHours(0,0,0,0)`
// - but `setHours` operates in the process's *local* timezone, so on any server not running in
// UTC this silently shifts the bucket by the local UTC offset. Two servers running in different
// timezones (e.g. a UTC production box and a MSK dev machine) then disagree on which instant
// "midnight, 23.09.2026" is, so the exact-match `date` query finds nothing for data written by
// the other one - this is exactly what happened restoring a prod dump onto a non-UTC dev machine.
// Always go through these helpers instead of `setHours`/`new Date(year, month, day)` for this
// field so every environment computes the same bucket regardless of its local timezone.

/**
 * Parses a 'YYYY-MM-DD' (or any Date-constructor-accepted) string/Date into the exact UTC
 * midnight of that calendar day.
 */
function toUtcDateOnly(dateInput) {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return date
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

/**
 * [start, end) UTC bounds for a 'YYYY-MM' month string, for a $gte/$lt range query against a
 * `date` field bucketed by toUtcDateOnly.
 */
function utcMonthRange(monthString) {
  const [year, month] = monthString.split('-').map(Number)
  return {
    start: new Date(Date.UTC(year, month - 1, 1)),
    end: new Date(Date.UTC(year, month, 1))
  }
}

module.exports = { toUtcDateOnly, utcMonthRange }
