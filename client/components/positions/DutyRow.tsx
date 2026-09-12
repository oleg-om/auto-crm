import React from 'react'
import { ArrowDown, ArrowUp, Pencil, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import type { IDuty } from './duty.form'

interface IDutyRowProps {
  duty: IDuty
  onEdit: () => void
  onDelete: () => void
  onMoveUp: (() => void) | null
  onMoveDown: (() => void) | null
}

const DutyRow = ({ duty, onEdit, onDelete, onMoveUp, onMoveDown }: IDutyRowProps) => (
  <div className="flex items-center gap-2 rounded-lg border bg-white p-3 hover:bg-muted/40">
    <div className="flex flex-col gap-1">
      {onMoveUp ? (
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          className="h-6 w-6"
          title="Вверх"
          onClick={onMoveUp}
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </Button>
      ) : null}
      {onMoveDown ? (
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          className="h-6 w-6"
          title="Вниз"
          onClick={onMoveDown}
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </Button>
      ) : null}
    </div>

    <div className="flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">{duty.name}</span>
        {duty.isQuantitative ? <Badge variant="secondary">Количественная</Badge> : null}
        {duty.hasChecklist ? (
          <Badge variant="secondary">Чек-лист ({duty.checklistItems?.length || 0})</Badge>
        ) : null}
        {duty.addOnlyOnce ? <Badge variant="secondary">Только 1 раз</Badge> : null}
        {duty.completionTimeMinutes ? (
          <Badge variant="secondary">Норма: {duty.completionTimeMinutes} мин.</Badge>
        ) : null}
      </div>
    </div>

    <div className="flex gap-1">
      <Button type="button" variant="default" size="icon-sm" title="Редактировать" onClick={onEdit}>
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <Button type="button" variant="destructive" size="icon-sm" title="Удалить" onClick={onDelete}>
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  </div>
)

export default DutyRow
