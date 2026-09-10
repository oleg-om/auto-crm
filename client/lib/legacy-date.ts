// Parses the `DD.MM.YYYY HH:mm` strings the server stores for `date` fields
// (see e.g. server/model/employee.js). Not ISO, and NOT safe to pass to
// `new Date(raw)` - V8 reads "5.3.2025" as month.day.year (May 3rd, not
// March 5th), silently swapping day/month for two-digit-or-less values.
export const parseLegacyDate = (raw?: string): Date | null => {
  if (!raw) return null
  const [datePart, timePart] = raw.trim().split(' ')
  const [day, month, year] = (datePart ?? '').split('.').map(Number)
  if (!day || !month || !year) return null
  const [hours, minutes] = (timePart ?? '').split(':').map(Number)
  const date = new Date(year, month - 1, day, hours || 0, minutes || 0)
  return Number.isNaN(date.getTime()) ? null : date
}

export const formatLegacyDate = (raw?: string): string => {
  const date = parseLegacyDate(raw)
  if (!date) return '—'
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`
}
