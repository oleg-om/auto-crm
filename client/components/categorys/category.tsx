import React from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { TableRow, TableCell } from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import categoryList from '../../lists/category-list'
import type { ICategory } from '../../../common/types/generated/Category'

const TYPE_NAMES: Record<string, string> = Object.fromEntries(
  (categoryList as { name: string; value: string }[]).map((it) => [it.value, it.name])
)

interface ICategoryRowProps extends ICategory {
  deleteCategory: (id: string, value?: string) => void
}

const CategoryRow = (props: ICategoryRowProps) => {
  const removeCategory = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.deleteCategory(props.id as string, e.currentTarget.value)
  }

  return (
    <TableRow className="bg-white">
      <TableCell className="truncate">{props.name}</TableCell>
      <TableCell className="text-gray-800">
        <Badge variant="secondary">{TYPE_NAMES[props.type ?? ''] ?? props.type}</Badge>
      </TableCell>
      <TableCell className="whitespace-nowrap px-1 text-center">
        <Button asChild variant="default" size="icon-sm" title="Редактировать">
          <Link
            to={{ pathname: `/category/edit/${props.id}`, state: { preserveScroll: true } }}
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
          onClick={removeCategory}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default CategoryRow
