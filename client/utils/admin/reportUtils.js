// eslint-disable-next-line import/prefer-default-export
export const filterByEmployee = (data, employeeId) => {
  if (employeeId && data) {
    return data?.id === employeeId
  }
  return true
}

export const filterReportByEmployee = (data, employeeId) => {
  if (employeeId && data) {
    return data.employee?.filter((person) => person?.id === employeeId)?.length
  }
  return true
}

export const getEmployeeArray = (report) =>
  report
    ? report
        .reduce((acc, rec) => [...acc, ...rec.employee], [])
        .filter(
          (it) =>
            !it.name.toLowerCase().includes('студент') &&
            !it.surname.toLowerCase().includes('студент')
        )
        .reduce((acc, rec) => acc.concat(rec), [])
        .reduce((acc, rec) => {
          const x = acc.find((item) => item.id === rec.id)
          if (!x) {
            return acc.concat([rec])
          }
          return acc
        }, [])
    : []
