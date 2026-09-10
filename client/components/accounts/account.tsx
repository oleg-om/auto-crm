import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { TableRow, TableCell } from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import accountRoleList from '../../lists/account-role-list'
import type { IUser } from '../../../common/types/generated/User'
import type { IEmployee } from '../../../common/types/generated/Employee'
import type { IPlace } from '../../../common/types/generated/Place'

const DEFAULT_ROLE_BADGE_COLOR = 'border-transparent bg-gray-100 text-gray-800 hover:bg-gray-100/80'

const ROLE_NAMES: Record<string, string> = Object.fromEntries(
  accountRoleList.map((it: { name: string; value: string; color: string }) => [it.value, it.name])
)

const ROLE_COLORS: Record<string, string> = Object.fromEntries(
  accountRoleList.map((it: { name: string; value: string; color: string }) => [it.value, it.color])
)

const VISIBLE_ROLES_LIMIT = 5

interface IAccountRowProps extends IUser {
  employees: IEmployee[]
  places: IPlace[]
  deleteAccount: (id: string, value?: string) => void
}

const AccountRow = (props: IAccountRowProps) => {
  const [showAllRoles, setShowAllRoles] = useState(false)

  const removeAccount = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.deleteAccount(props._id as string, e.currentTarget.value)
  }

  const employee = props.employees.find((it) => it.id === props.userName)
  const employeeLabel = employee ? `${employee.name} ${employee.surname ?? ''}`.trim() : null
  const place = props.places.find((it) => it.id === props.place)

  const roles = props.role ?? []
  const hasMoreRoles = roles.length > VISIBLE_ROLES_LIMIT
  const visibleRoles = showAllRoles ? roles : roles.slice(0, VISIBLE_ROLES_LIMIT)

  return (
    <TableRow className="bg-white">
      <TableCell className="truncate">{props.login}</TableCell>
      <TableCell className="text-gray-800">
        {employeeLabel ?? <span className="text-muted-foreground">Общий аккаунт</span>}
      </TableCell>
      <TableCell className="text-gray-800">
        {place ? place.name : <span className="text-muted-foreground">Общий аккаунт</span>}
      </TableCell>
      <TableCell className="text-gray-800">
        <div className="flex flex-wrap items-center gap-1">
          {visibleRoles.map((it) => (
            <Badge
              key={it}
              className={cn('max-w-full truncate', ROLE_COLORS[it] ?? DEFAULT_ROLE_BADGE_COLOR)}
            >
              {ROLE_NAMES[it] ?? it}
            </Badge>
          ))}
          {hasMoreRoles ? (
            <button
              type="button"
              className="text-xs font-medium text-primary hover:underline"
              onClick={() => setShowAllRoles((prev) => !prev)}
            >
              {showAllRoles ? 'Свернуть' : `Показать все (${roles.length})`}
            </button>
          ) : null}
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap px-1 text-center">
        <Button asChild variant="outline" size="icon" title="Редактировать">
          <Link
            to={{ pathname: `/account/edit/${props._id}`, state: { preserveScroll: true } }}
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
          onClick={removeAccount}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default AccountRow
