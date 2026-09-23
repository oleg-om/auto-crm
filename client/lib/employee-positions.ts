import type { IEmployee } from '../../common/types/generated/Employee'

/**
 * IDs of the positions an employee holds for the electronic journal: the main one, plus the
 * additional one when set and different from the main. Shared by the full journal
 * (client/components/journal/EmployeeJournal.js) and the simplified kiosk screen
 * (client/features/journal-kiosk) so duty lookups agree on which positions "belong" to an
 * employee.
 */
export const getEmployeePositionIds = (
  employee?: Pick<IEmployee, 'positionId' | 'positionIdAdditional'> | null
): string[] => {
  if (!employee) return []
  const ids: string[] = []
  if (employee.positionId) ids.push(employee.positionId)
  if (employee.positionIdAdditional && employee.positionIdAdditional !== employee.positionId) {
    ids.push(employee.positionIdAdditional)
  }
  return ids
}

export default getEmployeePositionIds
