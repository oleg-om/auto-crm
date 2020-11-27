import { useRef, useEffect, useCallback } from "react"

export default function useOnClickOutside(handleClickOutside) {
  const ref = useRef()

  const handleClick = useCallback(
    (e) => {
      if (ref.current && ref.current.contains(e.target)) {
        return
      }
      handleClickOutside()
    },
    [handleClickOutside]
  )

  useEffect(() => {
    document.addEventListener("mousedown", handleClick)

    return () => {
      document.removeEventListener("mousedown", handleClick)
    }
  })

  return ref
}
