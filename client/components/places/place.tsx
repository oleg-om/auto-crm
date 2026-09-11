import React from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { TableRow, TableCell } from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { formatLegacyDate } from '../../lib/legacy-date'
import type { IPlace } from '../../../common/types/generated/Place'

interface IPlaceRowProps extends IPlace {
  deletePlace: (id: string, value?: string) => void
}

const PlaceRow = (props: IPlaceRowProps) => {
  const removePlace = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.deletePlace(props.id as string, e.currentTarget.value)
  }

  const services = [
    props.razval === 'true' ? 'Развал-схождение' : null,
    props.oil === 'true' ? 'Замена масла' : null,
    props.shinomontazh === 'true' ? 'Шиномонтаж' : null,
    props.sto === 'true' ? 'СТО' : null,
    Number(props.washboxes) > 0 ? 'Автомойка' : null
  ].filter((it): it is string => it !== null)

  const isInactive = props.active === false

  return (
    <TableRow className={isInactive ? 'bg-slate-100 text-muted-foreground' : 'bg-white'}>
      <TableCell className="truncate">{props.name}</TableCell>
      <TableCell className="hidden sm:table-cell text-gray-800">
        <div className="flex flex-wrap gap-1">
          {services.length > 0 ? (
            services.map((it) => (
              <Badge key={it} variant="secondary" className="max-w-full truncate">
                {it}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">Не указаны</span>
          )}
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell truncate">
        {Number(props.workTime) === 24 ? '24 часа' : '10 часов'}
      </TableCell>
      <TableCell className="hidden sm:table-cell truncate">
        {formatLegacyDate(props.date)}
      </TableCell>
      <TableCell className="whitespace-nowrap px-1 text-center">
        <Button asChild variant="outline" size="icon" title="Редактировать">
          <Link
            to={{ pathname: `/place/edit/${props.id}`, state: { preserveScroll: true } }}
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
          onClick={removePlace}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default PlaceRow
