/* eslint-disable import/prefer-default-export */
export const handleEnterpress = (e, func) => {
  if (e.keyCode === 13) {
    func()
  }
}

export const socketCondition = (showSearch, page) => !showSearch && page && (!page || page === 1)
