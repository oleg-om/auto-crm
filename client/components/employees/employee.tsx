import React from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { TableRow, TableCell } from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ROLE_BADGE_COLORS, DEFAULT_ROLE_BADGE_COLOR } from '../../consts/role-badge-colors'
import { formatLegacyDate } from '../../lib/legacy-date'
import { cn } from '../../lib/utils'
import type { IEmployee } from '../../../common/types/generated/Employee'
import type { IPlace } from '../../../common/types/generated/Place'

interface IEmployeeRowProps extends IEmployee {
  place: IPlace[]
  deleteEmployee: (id: string, value?: string) => void
}

const EmployeeRow = (props: IEmployeeRowProps) => {
  const removeEmployee = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.deleteEmployee(props.id, e.currentTarget.value)
  }

  const newPlaceArray = props.address.reduce<string[]>((r, e) => {
    const c = props.place.find((a) => e === a.id)
    if (c) r.push(c.name)
    return r
  }, [])
  return (
    <TableRow className="bg-white">
      <TableCell className="truncate text-gray-800">
        {props.name} {props.surname}
      </TableCell>
      <TableCell className="text-gray-800">
        <div className="flex flex-wrap gap-1">
          {newPlaceArray.map((it) => (
            <Badge key={it} variant="secondary" className="max-w-full truncate">
              {it}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell className="text-gray-800">
        <div className="flex flex-wrap gap-1">
          {props.role.map((it) => (
            <Badge
              key={it}
              className={cn(
                'max-w-full truncate',
                ROLE_BADGE_COLORS[it] ?? DEFAULT_ROLE_BADGE_COLOR
              )}
            >
              {it}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell className="truncate text-gray-800">{formatLegacyDate(props.date)}</TableCell>
      <TableCell className="whitespace-nowrap px-1 text-center">
        <Button asChild variant="outline" size="icon" title="Редактировать">
          <Link
            to={{ pathname: `/employee/edit/${props.id}`, state: { preserveScroll: true } }}
            aria-label="Редактировать"
          >
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="destructive"
          size="icon"
          className="ml-1"
          title="Удалить"
          aria-label="Удалить"
          onClick={removeEmployee}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default EmployeeRow
