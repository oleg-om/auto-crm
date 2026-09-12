import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Pencil, Plus } from 'lucide-react'
import { deleteDuty, reorderDuties, updatePosition } from '../../redux/reducers/positions'
import DutyRow from './DutyRow'
import DutyForm from './duty.form'
import type { IDuty } from './duty.form'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent } from '../ui/card'
import { Field, FieldGroup, FieldLabel } from '../ui/field'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import 'react-toastify/dist/ReactToastify.css'
import type { IPosition } from '../../../common/types/generated/Position'

interface IPositionTabProps {
  position: IPosition
}

interface IDutyDialogState {
  mode: 'create' | 'edit'
  duty?: IDuty
}

const PositionTab = ({ position }: IPositionTabProps) => {
  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const dispatch = useDispatch<any>()
  const [dutyDialog, setDutyDialog] = useState<IDutyDialogState | null>(null)
  const [isWorkTimeOpen, setIsWorkTimeOpen] = useState(false)
  const [workDayStartTime, setWorkDayStartTime] = useState(position.workDayStartTime || '')
  const [workDayEndTime, setWorkDayEndTime] = useState(position.workDayEndTime || '')

  const openWorkTimeDialog = () => {
    setWorkDayStartTime(position.workDayStartTime || '')
    setWorkDayEndTime(position.workDayEndTime || '')
    setIsWorkTimeOpen(true)
  }

  const handleSaveWorkTime = () => {
    dispatch(
      updatePosition(position.id, {
        workDayStartTime: workDayStartTime || null,
        workDayEndTime: workDayEndTime || null
      })
    ).then(() => {
      setIsWorkTimeOpen(false)
      notify('Время работы обновлено')
    })
  }

  const sortedDuties = [...(position.duties || [])].sort((a, b) => {
    const orderA = a.order !== undefined ? a.order : 0
    const orderB = b.order !== undefined ? b.order : 0
    return orderA - orderB
  })

  const handleDeleteDuty = (dutyId: string) => {
    dispatch(deleteDuty(position.id, dutyId)).then(() => {
      notify('Обязанность удалена')
    })
  }

  const handleMoveDuty = (dutyId: string, direction: 'up' | 'down') => {
    const currentIndex = sortedDuties.findIndex((d) => d._id === dutyId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= sortedDuties.length) return

    const newDutyIds = sortedDuties.map((d) => (d._id as string).toString())
    const [moved] = newDutyIds.splice(currentIndex, 1)
    newDutyIds.splice(newIndex, 0, moved)

    dispatch(reorderDuties(position.id, newDutyIds)).then(() => {
      notify('Порядок изменен')
    })
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="mb-4 text-2xl font-bold">{position.name}</h2>

        <div className="mb-6 rounded-lg bg-muted/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Время работы</h3>
            <Button type="button" variant="ghost" size="sm" onClick={openWorkTimeDialog}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Редактировать
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {position.workDayStartTime || position.workDayEndTime ? (
              <div>
                {position.workDayStartTime ? (
                  <span>Начало: {position.workDayStartTime}</span>
                ) : null}
                {position.workDayStartTime && position.workDayEndTime ? (
                  <span className="mx-2">•</span>
                ) : null}
                {position.workDayEndTime ? <span>Конец: {position.workDayEndTime}</span> : null}
              </div>
            ) : (
              <span>Время работы не установлено</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          {sortedDuties.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Нет обязанностей. Добавьте первую обязанность.
            </div>
          ) : (
            <div className="space-y-2">
              {sortedDuties.map((duty, index) => (
                <DutyRow
                  key={duty._id}
                  duty={duty}
                  onEdit={() => setDutyDialog({ mode: 'edit', duty })}
                  onDelete={() => handleDeleteDuty(duty._id as string)}
                  onMoveUp={index > 0 ? () => handleMoveDuty(duty._id as string, 'up') : null}
                  onMoveDown={
                    index < sortedDuties.length - 1
                      ? () => handleMoveDuty(duty._id as string, 'down')
                      : null
                  }
                />
              ))}
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed"
          onClick={() => setDutyDialog({ mode: 'create' })}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Добавить обязанность
        </Button>
      </CardContent>

      <Dialog
        open={!!dutyDialog}
        onOpenChange={(open) => (!open ? setDutyDialog(null) : undefined)}
      >
        <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
          <DialogHeader className="shrink-0 border-b px-6 py-4">
            <DialogTitle>
              {dutyDialog?.mode === 'create' ? 'Новая обязанность' : 'Редактировать обязанность'}
            </DialogTitle>
          </DialogHeader>
          {dutyDialog ? (
            <DutyForm
              key={dutyDialog.mode === 'edit' ? dutyDialog.duty?._id : 'create'}
              mode={dutyDialog.mode}
              duty={dutyDialog.duty}
              positionId={position.id as string}
              onSaved={() => setDutyDialog(null)}
              onCancel={() => setDutyDialog(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={isWorkTimeOpen} onOpenChange={setIsWorkTimeOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Время работы</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="workDayStartTime">Начало рабочего дня</FieldLabel>
                <Input
                  type="time"
                  id="workDayStartTime"
                  value={workDayStartTime}
                  onChange={(e) => setWorkDayStartTime(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="workDayEndTime">Конец рабочего дня</FieldLabel>
                <Input
                  type="time"
                  id="workDayEndTime"
                  value={workDayEndTime}
                  onChange={(e) => setWorkDayEndTime(e.target.value)}
                />
              </Field>
            </div>
          </FieldGroup>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsWorkTimeOpen(false)}>
              Отмена
            </Button>
            <Button type="button" onClick={handleSaveWorkTime}>
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PositionTab
