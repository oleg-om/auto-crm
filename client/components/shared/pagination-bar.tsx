import React from 'react'
import { getPageNumbers, DEFAULT_PAGE_SIZE_OPTIONS } from '../../hooks/use-pagination'
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from '../ui/pagination'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface IPaginationBarProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize: number
  onPageSizeChange: (size: number) => void
  totalItems: number
  pageSizeOptions?: number[]
}

const PaginationBar = ({
  page,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS
}: IPaginationBarProps) => (
  <div className="my-4 flex flex-col items-center gap-3 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center">
    <div className="hidden sm:block" />
    {totalPages > 1 ? (
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={page === 1}
              onClick={() => onPageChange(Math.max(1, page - 1))}
            />
          </PaginationItem>
          {getPageNumbers(page, totalPages).map((it) =>
            typeof it === 'number' ? (
              <PaginationItem key={it}>
                <PaginationButton isActive={it === page} onClick={() => onPageChange(it)}>
                  {it}
                </PaginationButton>
              </PaginationItem>
            ) : (
              <PaginationItem key={it}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              disabled={page === totalPages}
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    ) : (
      <div className="hidden sm:block" />
    )}
    <div className="flex items-center gap-1.5 sm:justify-self-end">
      <Label
        htmlFor="pageSize"
        className="whitespace-nowrap text-xs text-muted-foreground sm:text-sm"
      >
        Показывать по
      </Label>
      <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
        <SelectTrigger id="pageSize" className="h-8 w-[64px] px-2 text-xs sm:text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {pageSizeOptions.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="whitespace-nowrap text-xs text-muted-foreground sm:text-sm">
        из {totalItems}
      </span>
    </div>
  </div>
)

export default PaginationBar
