export const handleEnterpress = (e, func) => {
  if (e.keyCode === 13) {
    func()
  }
}

export const socketCondition = (showSearch, page) => !showSearch && page && (!page || page === 1)

export const printWithAdditionalInfo = (obj, auth) => {
  if (!obj || !auth) {
    return obj
  }
  return {
    ...obj,
    accountPostNumber: auth?.user?.post || null
  }
}
