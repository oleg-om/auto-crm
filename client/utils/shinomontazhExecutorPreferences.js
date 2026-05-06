const STORAGE_PREFIX = 'autodom-crm:shinomontazh-executor-prefs:v1'

export function buildExecutorStorageKey(placeId, group, sortedIds) {
  return `${STORAGE_PREFIX}:${String(placeId)}:${String(group)}:${sortedIds.join('|')}`
}

/**
 * @param {string|number} placeId
 * @param {string|number} group
 * @param {string[]} employeeIds unsorted
 * @returns {{ ids: string[], entries: { id: string, role: string, salaryPercent?: number }[] } | null}
 */
export function loadExecutorPreferences(placeId, group, employeeIds) {
  try {
    const sorted = [...employeeIds].sort()
    if (sorted.length < 2) return null
    const key = buildExecutorStorageKey(placeId, group, sorted)
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || !Array.isArray(data.ids) || !Array.isArray(data.entries)) return null
    const savedSorted = [...data.ids].map(String).sort()
    const currentSorted = sorted.map(String).sort()
    if (savedSorted.join('|') !== currentSorted.join('|')) return null
    return data
  } catch {
    return null
  }
}

/**
 * @param {string|number} placeId
 * @param {string|number} group
 * @param {{ id: string, role: string, salaryPercent?: number, group?: number }[]} employeesSnapshot
 */
export function saveExecutorPreferences(placeId, group, employeesSnapshot) {
  try {
    const forGroup = employeesSnapshot.filter((e) => e.group === group)
    const sorted = [...new Set(forGroup.map((e) => String(e.id)))].sort()
    if (sorted.length < 2) return
    const key = buildExecutorStorageKey(placeId, group, sorted)
    const payload = {
      version: 1,
      ids: sorted,
      entries: forGroup.map((e) => ({
        id: String(e.id),
        role: e.role,
        salaryPercent: e.salaryPercent
      }))
    }
    localStorage.setItem(key, JSON.stringify(payload))
  } catch {
    /* quota / private mode */
  }
}

export function applyStoredPreferencesToEmployees(employees, stored) {
  if (!stored || !stored.entries) return employees
  const byId = {}
  stored.entries.forEach((entry) => {
    byId[String(entry.id)] = entry
  })
  return employees.map((e) => {
    const s = byId[String(e.id)]
    if (!s) return e
    return {
      ...e,
      role: s.role,
      salaryPercent: s.salaryPercent
    }
  })
}

export function employeesAlignWithStored(employees, stored) {
  if (!stored || !stored.entries) return false
  const byId = {}
  stored.entries.forEach((entry) => {
    byId[String(entry.id)] = entry
  })
  return employees.every((e) => {
    const s = byId[String(e.id)]
    if (!s) return true
    return e.role === s.role && Number(e.salaryPercent) === Number(s.salaryPercent)
  })
}

/** Сброс процентов у исполнителей текущей группы (смена «связки» — галочка снята/добавлен). */
export function stripSalaryPercentsForGroup(employees, groupNum) {
  return employees.map((e) => {
    if (e.group !== groupNum) return e
    const { salaryPercent, ...rest } = e
    return rest
  })
}
