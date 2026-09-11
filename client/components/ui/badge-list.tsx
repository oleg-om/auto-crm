import React, { useState } from 'react'
import { Badge } from './badge'
import { cn } from '../../lib/utils'

export const DEFAULT_BADGE_COLOR =
  'border-transparent bg-gray-100 text-gray-800 hover:bg-gray-100/80'

interface IBadgeListProps {
  values: string[]
  labels?: Record<string, string>
  colors?: Record<string, string>
  limit?: number
  emptyText?: string
  className?: string
}

const BadgeList = ({
  values,
  labels = {},
  colors = {},
  limit = 5,
  emptyText,
  className
}: IBadgeListProps) => {
  const [showAll, setShowAll] = useState(false)
  const hasMore = values.length > limit
  const visible = showAll ? values : values.slice(0, limit)

  if (values.length === 0) {
    return emptyText ? <span className="text-sm text-muted-foreground">{emptyText}</span> : null
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-1', className)}>
      {visible.map((it) => (
        <Badge key={it} className={cn('max-w-full truncate', colors[it] ?? DEFAULT_BADGE_COLOR)}>
          {labels[it] ?? it}
        </Badge>
      ))}
      {hasMore ? (
        <button
          type="button"
          className="text-xs font-medium text-primary hover:underline"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? 'Свернуть' : `Показать все (${values.length})`}
        </button>
      ) : null}
    </div>
  )
}

export default BadgeList
