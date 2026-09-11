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
        <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-xs">
          {prices.map((it) => (
            <span key={it.label} className="whitespace-nowrap">
              <span className="text-muted-foreground">{it.label}</span> {it.value}
            </span>
          ))}
        </div>
      ) : (
        '—'
      )}
    </TableCell>
  )
}

export default PriceFieldsCell
