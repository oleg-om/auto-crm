// Breaks ("Обед", "Отдых", "Перекур", or a custom "Перерыв" - see client/lists/standard-duties-list.js) are logged as
// journal duties like any other, but they aren't work the employee is obliged to complete - reports
// must not count them towards duty totals or flag them as unfinished duties. Matched by substring
// (case-insensitive) since positions may carry variants like "Перекур / чай".
const BREAK_DUTY_KEYWORDS = ['обед', 'отдых', 'перекур', 'перерыв']

// eslint-disable-next-line import/prefer-default-export
export const isBreakDuty = (name?: string | null): boolean => {
  const normalized = (name || '').toLowerCase()
  return BREAK_DUTY_KEYWORDS.some((keyword) => normalized.includes(keyword))
}
