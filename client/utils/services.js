/* eslint-disable import/prefer-default-export */
export const getActualPrice = (item, service) => {
  const findinChosen = service.find((it) => it.serviceName.includes(item.id))
  if (service && findinChosen) {
    return findinChosen?.price || item.actualprice
  }
  return item.actualprice
}
