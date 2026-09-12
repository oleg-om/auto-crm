import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { ArrowDown, ArrowUp, Check, X } from 'lucide-react'
import { addDuty, updateDuty } from '../../redux/reducers/positions'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Checkbox } from '../ui/checkbox'
import { Field, FieldError, FieldGroup, FieldLabel, FieldContent, FieldTitle } from '../ui/field'
import 'react-toastify/dist/ReactToastify.css'
import type { IPosition } from '../../../common/types/generated/Position'

export type IDuty = NonNullable<IPosition['duties']>[number]
export type IDutyUpdate = Omit<IDuty, '_id' | 'order'>

interface IFormState {
  name: string
  isQuantitative: boolean
  hasChecklist: boolean
  addOnlyOnce: boolean
  checklistItems: NonNullable<IDuty['checklistItems']>
  completionTimeMinutes: string
}

const toFormState = (duty?: IDuty): IFormState => ({
  name: duty?.name ?? '',
  isQuantitative: duty?.isQuantitative ?? false,
  hasChecklist: duty?.hasChecklist ?? false,
  addOnlyOnce: duty?.addOnlyOnce ?? false,
  checklistItems: duty?.checklistItems ?? [],
  completionTimeMinutes: duty?.completionTimeMinutes ? String(duty.completionTimeMinutes) : ''
})

const toPayload = (state: IFormState): IDutyUpdate => ({
  name: state.name.trim(),
  isQuantitative: state.isQuantitative,
  hasChecklist: state.hasChecklist,
  addOnlyOnce: state.addOnlyOnce,
  checklistItems: state.hasChecklist ? state.checklistItems : [],
  completionTimeMinutes: state.completionTimeMinutes
    ? Number(state.completionTimeMinutes)
    : undefined
})

interface IDutyFormProps {
  positionId: string
  mode: 'create' | 'edit'
  duty?: IDuty
  onSaved: () => void
  onCancel: () => void
}

const DutyForm = ({ positionId, mode, duty, onSaved, onCancel }: IDutyFormProps) => {
  const dispatch = useDispatch<any>()

  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const [state, setState] = useState<IFormState>(() => toFormState(duty))
  const [newChecklistItem, setNewChecklistItem] = useState('')
  const [nameError, setNameError] = useState('')

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return
    setState((prev) => ({
      ...prev,
      checklistItems: [
        ...prev.checklistItems,
        { text: newChecklistItem.trim(), order: prev.checklistItems.length }
      ]
    }))
    setNewChecklistItem('')
  }

  const handleDeleteChecklistItem = (itemIndex: number) => {
    setState((prev) => ({
      ...prev,
      checklistItems: prev.checklistItems
        .filter((_, index) => index !== itemIndex)
        .map((item, index) => ({ ...item, order: index }))
    }))
  }

  const handleMoveChecklistItem = (itemIndex: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1
    setState((prev) => {
      if (newIndex < 0 || newIndex >= prev.checklistItems.length) return prev
      const newItems = [...prev.checklistItems]
      const [moved] = newItems.splice(itemIndex, 1)
      newItems.splice(newIndex, 0, moved)
      return { ...prev, checklistItems: newItems.map((item, index) => ({ ...item, order: index })) }
    })
  }

  const submit = () => {
    if (!state.name.trim()) {
      setNameError('Введите название обязанности')
      return
    }
    const payload = toPayload(state)
    if (mode === 'create') {
      dispatch(addDuty(positionId, payload)).then(() => {
        notify('Обязанность добавлена')
        onSaved()
      })
    } else if (duty?._id) {
      dispatch(updateDuty(positionId, duty._id, payload)).then(() => {
        notify('Обязанность обновлена')
        onSaved()
      })
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-4">
        <FieldGroup>
          <Field data-invalid={!!nameError}>
            <FieldLabel htmlFor="dutyName">Название обязанности</FieldLabel>
            <Input
              id="dutyName"
              value={state.name}
              aria-invalid={!!nameError}
              autoFocus
              onChange={(e) => {
                setState((prev) => ({ ...prev, name: e.target.value }))
                if (e.target.value.trim()) setNameError('')
              }}
            />
            <FieldError>{nameError}</FieldError>
          </Field>

          <div className="grid gap-3 sm:grid-cols-3">
            <FieldLabel htmlFor="isQuantitative">
              <Field orientation="horizontal">
                <Checkbox
                  id="isQuantitative"
                  checked={state.isQuantitative}
                  onCheckedChange={(checked) =>
                    setState((prev) => ({ ...prev, isQuantitative: checked === true }))
                  }
                />
                <FieldContent>
                  <FieldTitle>Количественная</FieldTitle>
                </FieldContent>
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="hasChecklist">
              <Field orientation="horizontal">
                <Checkbox
                  id="hasChecklist"
                  checked={state.hasChecklist}
                  onCheckedChange={(checked) =>
                    setState((prev) => ({ ...prev, hasChecklist: checked === true }))
                  }
                />
                <FieldContent>
                  <FieldTitle>Чек-лист</FieldTitle>
                </FieldContent>
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="addOnlyOnce">
              <Field orientation="horizontal">
                <Checkbox
                  id="addOnlyOnce"
                  checked={state.addOnlyOnce}
                  onCheckedChange={(checked) =>
                    setState((prev) => ({ ...prev, addOnlyOnce: checked === true }))
                  }
                />
                <FieldContent>
                  <FieldTitle>Только 1 раз</FieldTitle>
                </FieldContent>
              </Field>
            </FieldLabel>
          </div>

          {state.hasChecklist ? (
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="mb-2 text-sm font-semibold text-foreground">Чек-лист</p>
              {state.checklistItems.length > 0 ? (
                <div className="mb-2 space-y-1">
                  {state.checklistItems.map((item, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={index} className="flex items-center gap-2 rounded bg-background p-2">
                      <div className="flex flex-col gap-1">
                        {index > 0 ? (
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon-sm"
                            className="h-5 w-5"
                            title="Вверх"
                            onClick={() => handleMoveChecklistItem(index, 'up')}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                        ) : null}
                        {index < state.checklistItems.length - 1 ? (
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon-sm"
                            className="h-5 w-5"
                            title="Вниз"
                            onClick={() => handleMoveChecklistItem(index, 'down')}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        ) : null}
                      </div>
                      <span className="flex-1 text-sm">{item.text}</span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-sm"
                        className="h-6 w-6"
                        onClick={() => handleDeleteChecklistItem(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="flex gap-2">
                <Input
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddChecklistItem()
                    }
                  }}
                  placeholder="Добавить пункт"
                  className="h-8 text-sm"
                />
                <Button type="button" size="icon-sm" onClick={handleAddChecklistItem}>
                  <Check className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ) : null}

          <Field>
            <FieldLabel htmlFor="completionTimeMinutes">
              Норма выполнения (минуты)
              {state.isQuantitative ? (
                <span className="font-normal text-muted-foreground">
                  {' '}
                  — для количественных обязанностей время указывается для 1 шт
                </span>
              ) : null}
            </FieldLabel>
            <Input
              type="number"
              id="completionTimeMinutes"
              min="0"
              value={state.completionTimeMinutes}
              placeholder="Необязательно"
              onChange={(e) =>
                setState((prev) => ({ ...prev, completionTimeMinutes: e.target.value }))
              }
            />
          </Field>
        </FieldGroup>
      </div>

      <div className="flex shrink-0 justify-end gap-2 border-t px-6 py-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" onClick={submit}>
          {mode === 'create' ? 'Добавить' : 'Сохранить'}
        </Button>
      </div>
    </div>
  )
}

export default DutyForm
