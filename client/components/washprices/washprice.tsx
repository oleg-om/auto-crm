import React from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { TableRow, TableCell } from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import BooleanIcon from '../shared/boolean-icon'
import PriceFieldsCell from '../shared/price-fields-cell'
import PriceFieldColumns from '../shared/price-field-columns'
import washTypeList from '../../lists/wash-type-list'
import washPriceFieldList from '../../lists/wash-price-field-list'
import type { IWashPrice } from '../../../common/types/generated/WashPrice'

const TYPE_NAMES: Record<string, string> = Object.fromEntries(
  (washTypeList as { name: string; value: string }[]).map((it) => [it.value, it.name])
)

const PRICE_FIELDS_BY_TYPE = washPriceFieldList as Record<string, { key: string; label: string }[]>

interface IWashpriceRowProps extends IWashPrice {
  deleteWashprice: (id: string, value?: string) => void
  showPrices?: boolean
  priceColumns?: { key: string; label: string }[] | null
}

const WashpriceRow = (props: IWashpriceRowProps) => {
  const removeWashprice = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.deleteWashprice(props.id as string, e.currentTarget.value)
  }

  return (
    <TableRow className="bg-white">
      <TableCell className="truncate">{props.name}</TableCell>
      <TableCell className="text-gray-800">
        <Badge variant="secondary">{TYPE_NAMES[props.type] ?? props.type}</Badge>
      </TableCell>
      <TableCell className="truncate text-gray-800">{props.category}</TableCell>
      {props.priceColumns ? (
        <PriceFieldColumns
          fields={props.priceColumns}
          item={props as unknown as Record<string, unknown>}
        />
      ) : props.showPrices ? (
        <PriceFieldsCell
          fields={PRICE_FIELDS_BY_TYPE[props.type] ?? []}
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
            to={{ pathname: `/washprice/edit/${props.id}`, state: { preserveScroll: true } }}
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
          onClick={removeWashprice}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default WashpriceRow
