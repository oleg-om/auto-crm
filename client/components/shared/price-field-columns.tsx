import React from 'react'
import { TableCell } from '../ui/table'

interface IPriceField {
  key: string
  label: string
}

interface IPriceFieldColumnsProps {
  fields: IPriceField[]
  item: Record<string, unknown>
}

// One <TableCell> per price field, used when the table breaks prices out into their own
// columns (only meaningful once a single Направление is selected - see PriceFieldsCell for the
// stacked-in-one-cell fallback shown when multiple directions are mixed in the list).
const PriceFieldColumns = ({ fields, item }: IPriceFieldColumnsProps) => (
  <>
    {fields.map((field) => {
      const value = item[field.key] as number | undefined
      return (
        <TableCell key={field.key} className="text-center text-xs text-gray-800">
          {value ?? '—'}
        </TableCell>
      )
    })}
  </>
)

export default PriceFieldColumns
