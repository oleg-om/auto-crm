import React from 'react'
import { TableCell } from '../ui/table'

interface IPriceField {
  key: string
  label: string
}

interface IPriceFieldsCellProps {
  fields: IPriceField[]
  item: Record<string, unknown>
}

const PriceFieldsCell = ({ fields, item }: IPriceFieldsCellProps) => {
  const prices = fields
    .map((field) => ({ label: field.label, value: item[field.key] as number | undefined }))
    .filter((it) => it.value != null)

  return (
    <TableCell className="text-gray-800">
      {prices.length > 0 ? (
        <div className="flex flex-col gap-0.5 py-1 text-xs leading-tight">
          {prices.map((it) => (
            <div key={it.label} className="flex items-baseline justify-between gap-2">
              <span className="truncate text-muted-foreground">{it.label}</span>
              <span className="shrink-0 font-medium">{it.value}</span>
            </div>
          ))}
        </div>
      ) : (
        '—'
      )}
    </TableCell>
  )
}

export default PriceFieldsCell
