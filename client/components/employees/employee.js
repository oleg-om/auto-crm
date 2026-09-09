import React from 'react'
import { Link } from 'react-router-dom'
import { TableRow, TableCell } from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

const EmployeeRow = (props) => {
  const removeEmployee = (e) => {
    props.deleteEmployee(props.id, e.target.value)
  }

  const newPlaceArray = props.address.reduce((r, e) => {
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
