import React from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { TableRow, TableCell } from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import BooleanIcon from '../shared/boolean-icon'
import windowTypeList from '../../lists/window-type-list'
import type { IWindowPrice } from '../../../common/types/generated/WindowPrice'

const TYPE_NAMES: Record<string, string> = Object.fromEntries(
  (windowTypeList as { name: string; value: string }[]).map((it) => [it.value, it.name])
)

interface IWindowpriceRowProps extends IWindowPrice {
  basePath: string
  onDelete: (id: string) => void
}

const WindowpriceRow = (props: IWindowpriceRowProps) => {
  const removeItem = () => {
    props.onDelete(props.id as string)
  }

  return (
    <TableRow className="bg-white">
      <TableCell className="truncate">{props.name}</TableCell>
      <TableCell className="text-gray-800">
        <Badge variant="secondary">{TYPE_NAMES[props.type] ?? props.type}</Badge>
      </TableCell>
      <TableCell className="truncate text-gray-800">{props.category}</TableCell>
      <TableCell className="text-gray-800">{props.number ?? '—'}</TableCell>
      <TableCell className="text-gray-800">
        <BooleanIcon value={props.free === 'yes'} />
      </TableCell>
      <TableCell className="whitespace-nowrap px-1 text-center">
        <Button asChild variant="default" size="icon-sm" title="Редактировать">
          <Link
            to={{
              pathname: `/${props.basePath}/edit/${props.id}`,
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

export default WindowpriceRow
