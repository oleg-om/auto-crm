import React from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { TableRow, TableCell } from '../ui/table'
import { Button } from '../ui/button'
import BooleanIcon from '../shared/boolean-icon'
import PriceFieldColumns from '../shared/price-field-columns'
import diskpaintingPriceFieldList from '../../lists/diskpainting-price-field-list'
import type { IDiskpaintingPrice } from '../../../common/types/generated/DiskpaintingPrice'

const PRICE_FIELDS = diskpaintingPriceFieldList as { key: string; label: string }[]

interface IDiskpaintingpriceRowProps extends IDiskpaintingPrice {
  deleteDiskpaintingprice: (id: string, value?: string) => void
  showPrices?: boolean
}

const DiskpaintingpriceRow = (props: IDiskpaintingpriceRowProps) => {
  const removeItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.deleteDiskpaintingprice(props.id as string, e.currentTarget.value)
  }

  return (
    <TableRow className="bg-white">
      <TableCell className="truncate">{props.name}</TableCell>
      <TableCell className="truncate text-gray-800">{props.category}</TableCell>
      {props.showPrices ? (
        <PriceFieldColumns
          fields={PRICE_FIELDS}
          item={props as unknown as Record<string, unknown>}
        />
      ) : null}
      <TableCell className="text-gray-800">{props.number ?? '—'}</TableCell>
      <TableCell className="text-gray-800">
        <BooleanIcon value={props.free === 'yes'} />
      </TableCell>
      <TableCell className="whitespace-nowrap px-1 text-center">
        <Button asChild variant="default" size="icon-sm" title="Редактировать">
          <Link
            to={{
              pathname: `/diskpaintingprice/edit/${props.id}`,
              state: { preserveScroll: true }
            }}
            aria-label="Редактировать"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <Button
          variant="destructive"
          size="icon-sm"
          className="ml-1"
          title="Удалить"
          aria-label="Удалить"
          onClick={removeItem}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default DiskpaintingpriceRow
