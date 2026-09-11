import React from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '../../lib/utils'

interface IBooleanIconProps {
  value: boolean
  className?: string
}

const BooleanIcon = ({ value, className }: IBooleanIconProps) => {
  const Icon = value ? Check : X
  return (
    <Icon
      className={cn('h-4 w-4', value ? 'text-emerald-600' : 'text-muted-foreground', className)}
      aria-label={value ? 'Да' : 'Нет'}
    />
  )
}

export default BooleanIcon
