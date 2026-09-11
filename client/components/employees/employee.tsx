import React from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { TableRow, TableCell } from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import BadgeList from '../ui/badge-list'
import roleList from '../../lists/role-list'
import { formatLegacyDate } from '../../lib/legacy-date'
import type { IEmployee } from '../../../common/types/generated/Employee'
import type { IPlace } from '../../../common/types/generated/Place'

const ROLE_NAMES: Record<string, string> = Object.fromEntries(
  roleList.map((it: { name: string; value: string; color: string }) => [it.value, it.name])
)

const ROLE_COLORS: Record<string, string> = Object.fromEntries(
  roleList.map((it: { name: string; value: string; color: string }) => [it.value, it.color])
)

interface IEmployeeRowProps extends IEmployee {
  place: IPlace[]
  deleteEmployee: (id: string, value?: string) => void
}

const EmployeeRow = (props: IEmployeeRowProps) => {
  const removeEmployee = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.deleteEmployee(props.id, e.currentTarget.value)
  }

  const isInactive = props.active === false

  const newPlaceArray = props.address.reduce<string[]>((r, e) => {
    const c = props.place.find((a) => e === a.id)
    if (c) r.push(c.name)
    return r
  }, [])
  return (
    <TableRow className={isInactive ? 'bg-slate-100 text-muted-foreground' : 'bg-white'}>
      <TableCell className="truncate">
        {props.name} {props.surname}
      </TableCell>
      <TableCell className="hidden sm:table-cell text-gray-800">
        <div className="flex flex-wrap gap-1">
          {newPlaceArray.map((it) => (
            <Badge key={it} variant="secondary" className="max-w-full truncate">
              {it}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell text-gray-800">
        <BadgeList values={props.role} labels={ROLE_NAMES} colors={ROLE_COLORS} />
      </TableCell>
      <TableCell className="hidden sm:table-cell truncate">
        {formatLegacyDate(props.date)}
      </TableCell>
      <TableCell className="whitespace-nowrap px-1 text-center">
        <Button asChild variant="outline" size="icon-sm" title="Редактировать">
          <Link
            to={{ pathname: `/employee/edit/${props.id}`, state: { preserveScroll: true } }}
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
          onClick={removeEmployee}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default EmployeeRow
