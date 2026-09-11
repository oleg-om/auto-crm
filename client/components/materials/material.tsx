import React from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { TableRow, TableCell } from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import materialList from '../../lists/material-list'
import type { IMaterials } from '../../../common/types/generated/Materials'

const TYPE_NAMES: Record<string, string> = Object.fromEntries(
  (materialList as { name: string; value: string }[]).map((it) => [it.value, it.name])
)

interface IMaterialRowProps extends IMaterials {
  deleteMaterial: (id: string, value?: string) => void
}

const MaterialRow = (props: IMaterialRowProps) => {
  const removeMaterial = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.deleteMaterial(props.id as string, e.currentTarget.value)
  }

  return (
    <TableRow className="bg-white">
      <TableCell className="truncate">{props.name}</TableCell>
      <TableCell className="truncate text-gray-800">{props.artikul || '—'}</TableCell>
      <TableCell className="text-gray-800">{props.price}</TableCell>
      <TableCell className="text-gray-800">{props.quantity ?? '—'}</TableCell>
      <TableCell className="text-gray-800">
        <Badge variant="secondary">{TYPE_NAMES[props.type] ?? props.type}</Badge>
      </TableCell>
      <TableCell className="truncate text-gray-800">{props.category}</TableCell>
      <TableCell className="whitespace-nowrap px-1 text-center">
        <Button asChild variant="default" size="icon-sm" title="Редактировать">
          <Link
            to={{ pathname: `/material/edit/${props.id}`, state: { preserveScroll: true } }}
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
          onClick={removeMaterial}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default MaterialRow
