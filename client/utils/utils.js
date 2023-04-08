/* eslint-disable import/prefer-default-export */
export const handleEnterpress = (e, func) => {
  if (e.keyCode === 13) {
    func()
  }
}
