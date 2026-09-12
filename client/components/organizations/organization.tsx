import React from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { TableRow, TableCell } from '../ui/table'
import { Button } from '../ui/button'
import type { IOrganization } from '../../../common/types/generated/Organization'

interface IOrganizationRowProps extends IOrganization {
  deleteOrganization: (id: string, value?: string) => void
}

const OrganizationRow = (props: IOrganizationRowProps) => {
  const removeOrganization = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.deleteOrganization(props.id as string, e.currentTarget.value)
  }

  return (
    <TableRow className="bg-white">
      <TableCell className="truncate">{props.name}</TableCell>
      <TableCell className="text-gray-800">{props.phone || '—'}</TableCell>
      <TableCell className="whitespace-nowrap px-1 text-center">
        <Button asChild variant="default" size="icon-sm" title="Редактировать">
          <Link
            to={{ pathname: `/organization/edit/${props.id}`, state: { preserveScroll: true } }}
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
          onClick={removeOrganization}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default OrganizationRow
