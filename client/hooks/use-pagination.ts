import { useState } from 'react'

export const getPageNumbers = (current: number, total: number): (number | string)[] => {
  const delta = 1
  const middle: number[] = []
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    middle.push(i)
  }
  const withEdges = [1, ...middle, total].filter(
    (v, i, arr) => arr.indexOf(v) === i && v >= 1 && v <= total
  )
  const result: (number | string)[] = []
  let prev = 0
  withEdges.forEach((v) => {
    if (prev && v - prev > 1) result.push(`ellipsis-${v}`)
    result.push(v)
    prev = v
  })
  return result
}

export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

export const usePagination = (itemCount: number, initialPageSize = 20) => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSizeState] = useState(initialPageSize)

  const setPageSize = (size: number) => {
    setPageSizeState(size)
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(itemCount / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * pageSize
  const pageEnd = pageStart + pageSize

  return {
    page: currentPage,
    pageSize,
    setPage,
    setPageSize,
    totalPages,
    pageStart,
    pageEnd
  }
}
