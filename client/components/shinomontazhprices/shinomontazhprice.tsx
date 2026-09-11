import React from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { TableRow, TableCell } from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import BooleanIcon from '../shared/boolean-icon'
import shinomontazhTypeList from '../../lists/shinomontazhtype-list'
import shinomontazhCategoryList from '../../lists/shinomontazhprice-list'
import shinomontazhFleetCategoryList from '../../lists/shinomontazh-fleet-category-list'
import type { IShinomontazhPrice } from '../../../common/types/generated/ShinomontazhPrice'

const TYPE_NAMES: Record<string, string> = Object.fromEntries(
  (shinomontazhTypeList as { name: string; value: string }[]).map((it) => [it.value, it.name])
)

const CATEGORY_NAMES: Record<string, string> = Object.fromEntries(
  [
    ...(shinomontazhCategoryList as { name: string; value: string }[]),
    ...(shinomontazhFleetCategoryList as { name: string; value: string }[])
  ].map((it) => [it.value, it.name])
)

interface IShinomontazhpriceRowProps extends IShinomontazhPrice {
  deleteShinomontazhprice: (id: string, value?: string) => void
}

const ShinomontazhpriceRow = (props: IShinomontazhpriceRowProps) => {
  const removeShinomontazhprice = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.deleteShinomontazhprice(props.id as string, e.currentTarget.value)
  }

  return (
    <TableRow className="bg-white">
      <TableCell className="truncate">{props.name}</TableCell>
      <TableCell className="text-gray-800">
        <Badge variant="secondary">{TYPE_NAMES[props.type] ?? props.type}</Badge>
      </TableCell>
      <TableCell className="truncate text-gray-800">
        {CATEGORY_NAMES[props.category] ?? props.category}
      </TableCell>
      <TableCell className="text-gray-800">{props.number ?? '—'}</TableCell>
      <TableCell className="text-gray-800">
        <BooleanIcon value={props.free === 'yes'} />
      </TableCell>
      <TableCell className="whitespace-nowrap px-1 text-center">
        <Button asChild variant="default" size="icon-sm" title="Редактировать">
          <Link
            to={{
              pathname: `/shinomontazhprice/edit/${props.id}`,
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
          onClick={removeShinomontazhprice}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default ShinomontazhpriceRow
