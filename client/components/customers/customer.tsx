import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { TableRow, TableCell } from '../ui/table'
import { Button } from '../ui/button'
import type { ICustomer } from '../../../common/types/generated/Customer'

// Not a schema field (see server/controller/customer.controller.js) - every
// Mongo _id already encodes its creation time, so the list/page endpoints
// derive `createdAt` from it at request time instead of needing a backfill.
interface ICustomerRowProps extends ICustomer {
  createdAt?: string
  deleteCustomer: (id: string, value?: string) => void
}

const CustomerRow = (props: ICustomerRowProps) => {
  const removeCustomer = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.deleteCustomer(props.id as string, e.currentTarget.value)
  }

  const car = [props.mark, props.model, props.mod].filter(Boolean).join(' ')

  return (
    <TableRow className="bg-white">
      <TableCell className="truncate">{props.name || '—'}</TableCell>
      <TableCell className="text-gray-800">{props.phone || '—'}</TableCell>
      <TableCell className="text-gray-800">
        {car || '—'}
        {props.regnumber ? (
          <span className="ml-1 text-muted-foreground">[{props.regnumber}]</span>
        ) : null}
      </TableCell>
      <TableCell className="hidden text-gray-800 sm:table-cell">
        {props.createdAt ? moment(props.createdAt).format('DD.MM.YYYY') : '—'}
      </TableCell>
      <TableCell className="whitespace-nowrap px-1 text-center">
        <Button asChild variant="secondary" size="icon-sm" title="Просмотр">
          <Link to={`/customer/view/${props.id}`} aria-label="Просмотр">
            <Eye className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <Button asChild variant="default" size="icon-sm" className="ml-1" title="Редактировать">
          <Link
            to={{ pathname: `/customer/edit/${props.id}`, state: { preserveScroll: true } }}
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
          onClick={removeCustomer}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default CustomerRow
