import React from 'react'
import { Link } from 'react-router-dom'
import { TableRow, TableCell } from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import type { IEmployee } from '../../types/employee'
import type { IPlace } from '../../types/place'

interface IEmployeeRowProps extends IEmployee {
  place: IPlace[]
  deleteEmployee: (id: string, value?: string) => void
}

const EmployeeRow = (props: IEmployeeRowProps) => {
  const removeEmployee = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.deleteEmployee(props.id, (e.target as HTMLButtonElement).value)
  }

  const newPlaceArray = props.address.reduce<string[]>((r, e) => {
    const c = props.place.find((a) => e === a.id)
    if (c) r.push(c.name)
    return r
  }, [])
  return (
    <TableRow className="bg-white">
      <TableCell className="text-gray-800 whitespace-nowrap">
        {props.name} {props.surname}
      </TableCell>
      <TableCell className="text-gray-800">
        <div className="flex flex-wrap gap-1">
          {newPlaceArray.map((it) => (
            <Badge key={it} variant="secondary">
              {it}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell className="text-gray-800">
        <div className="flex flex-wrap gap-1">
          {props.role.map((it) => (
            <Badge key={it} variant="outline">
              {it}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell className="text-center whitespace-nowrap">
        <Button asChild variant="outline" size="sm">
          <Link to={`/employee/edit/${props.id}`}>Редактировать</Link>
        </Button>
        <Button variant="destructive" size="sm" className="ml-1" onClick={removeEmployee}>
          Удалить
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default EmployeeRow
