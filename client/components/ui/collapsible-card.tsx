import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Card, CardTitle, CardDescription, CardContent } from './card'

interface ICollapsibleCardProps {
  title: string
  description?: string
  defaultOpen?: boolean
  contentClassName?: string
  children: React.ReactNode
}

const CollapsibleCard = ({
  title,
  description,
  defaultOpen = false,
  contentClassName,
  children
}: ICollapsibleCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <Card className="bg-muted/50">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 p-6 text-left"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="flex flex-col gap-1.5">
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen ? (
        <CardContent className={cn('pt-0', contentClassName)}>{children}</CardContent>
      ) : null}
    </Card>
  )
}

export default CollapsibleCard
