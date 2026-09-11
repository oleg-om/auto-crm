import React from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { TableRow, TableCell } from '../ui/table'
import { Button } from '../ui/button'
import BadgeList from '../ui/badge-list'
import accountRoleList from '../../lists/account-role-list'
import type { IUser } from '../../../common/types/generated/User'
import type { IEmployee } from '../../../common/types/generated/Employee'
import type { IPlace } from '../../../common/types/generated/Place'

const ROLE_NAMES: Record<string, string> = Object.fromEntries(
  accountRoleList.map((it: { name: string; value: string; color: string }) => [it.value, it.name])
)

const ROLE_COLORS: Record<string, string> = Object.fromEntries(
  accountRoleList.map((it: { name: string; value: string; color: string }) => [it.value, it.color])
)

interface IAccountRowProps extends IUser {
  employees: IEmployee[]
  places: IPlace[]
  deleteAccount: (id: string, value?: string) => void
}

const AccountRow = (props: IAccountRowProps) => {
  const removeAccount = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.deleteAccount(props._id as string, e.currentTarget.value)
  }

  const employee = props.employees.find((it) => it.id === props.userName)
  const employeeLabel = employee ? `${employee.name} ${employee.surname ?? ''}`.trim() : null
  const place = props.places.find((it) => it.id === props.place)

  return (
    <TableRow className="bg-white">
      <TableCell className="truncate">{props.login}</TableCell>
      <TableCell className="hidden sm:table-cell text-gray-800">
        {employeeLabel ?? <span className="text-muted-foreground">Общий аккаунт</span>}
      </TableCell>
      <TableCell className="hidden sm:table-cell text-gray-800">
        {place ? place.name : <span className="text-muted-foreground">Общий аккаунт</span>}
      </TableCell>
      <TableCell className="hidden sm:table-cell text-gray-800">
        <BadgeList values={props.role ?? []} labels={ROLE_NAMES} colors={ROLE_COLORS} />
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
