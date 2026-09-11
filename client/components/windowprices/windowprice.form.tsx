import React, { useState } from 'react'
import windowTypeList from '../../lists/window-type-list'
import windowFleetCategoryList from '../../lists/window-fleet-category-list'
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../ui/alert-dialog'
import type { IWindowPrice } from '../../../common/types/generated/WindowPrice'

const NONE = 'none'

const FLEET_TYPES = new Set(['gruz', 'selhoz'])

interface IFormState {
  name: string
  type: string
  category: string
  number: string
  free: string
  price: string
}

const emptyState: IFormState = {
  name: '',
  type: '',
  category: '',
  number: '',
  free: '',
  price: ''
}

const toFormState = (item?: IWindowPrice): IFormState =>
  item
    ? {
        name: item.name,
        type: item.type,
        category: item.category,
        number: item.number != null ? String(item.number) : '',
        free: item.free ?? '',
        price: item.price != null ? String(item.price) : ''
      }
    : emptyState

const toPayload = (state: IFormState) => ({
  name: state.name,
  type: state.type,
  category: state.category,
  number: state.number,
  free: state.free,
  price: state.price
})

type IFormErrors = Partial<Record<'name' | 'type' | 'category', string>>

interface IWindowpriceFormProps {
  mode: 'create' | 'edit'
  item?: IWindowPrice
  categoryOptions: { id: string; name: string }[]
  onSave: (payload: Record<string, unknown>) => void
  onDelete: () => void
  onCancel: () => void
}

const WindowpriceForm = ({
  mode,
  item,
  categoryOptions,
  onSave,
  onDelete,
  onCancel
}: IWindowpriceFormProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [state, setState] = useState<IFormState>(() => toFormState(item))
  const [errors, setErrors] = useState<IFormErrors>({})

  const submit = () => {
    const nextErrors: IFormErrors = {}
    if (!state.name.trim()) nextErrors.name = 'Введите название'
    if (!state.type) nextErrors.type = 'Выберите направление'
    if (!state.category) nextErrors.category = 'Выберите категорию'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSave(toPayload(state))
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState((prevState) => ({ ...prevState, [name]: value }))
    if (name === 'name') {
      setErrors((prevErrors) => {
        if (!prevErrors.name) return prevErrors
        const nextErrors = { ...prevErrors }
        delete nextErrors.name
        return nextErrors
      })
    }
  }

  const isFleetType = FLEET_TYPES.has(state.type)
  const fleetCategoryOptions = isFleetType ? windowFleetCategoryList : []

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-4">
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Название услуги</FieldLabel>
              <Input
                id="name"
                name="name"
                value={state.name}
                placeholder="Отображаемое название услуги"
                required
                aria-invalid={!!errors.name}
                onChange={onChange}
              />
              <FieldError>{errors.name}</FieldError>
            </Field>
            <Field data-invalid={!!errors.type}>
              <FieldLabel htmlFor="type">Направление</FieldLabel>
              <Select
                value={state.type === '' ? NONE : state.type}
                onValueChange={(value) => {
                  const nextType = value === NONE ? '' : value
                  setState((prev) => ({
                    ...prev,
                    type: nextType,
                    category: FLEET_TYPES.has(nextType) !== isFleetType ? '' : prev.category
                  }))
                  setErrors((prev) => {
                    if (!prev.type) return prev
                    const next = { ...prev }
                    delete next.type
                    return next
                  })
                }}
              >
                <SelectTrigger id="type" aria-invalid={!!errors.type}>
                  <SelectValue placeholder="Выберите направление" />
                </SelectTrigger>
                <SelectContent>
                  {windowTypeList.map((it: { name: string; value: string }) => (
                    <SelectItem key={it.value} value={it.value}>
                      {it.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{errors.type}</FieldError>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!errors.category}>
              <FieldLabel htmlFor="category">Категория</FieldLabel>
              <Select
                value={state.category === '' ? NONE : state.category}
                onValueChange={(value) => {
                  setState((prev) => ({ ...prev, category: value === NONE ? '' : value }))
                  setErrors((prev) => {
                    if (!prev.category) return prev
                    const next = { ...prev }
                    delete next.category
                    return next
                  })
                }}
              >
                <SelectTrigger
                  id="category"
                  aria-invalid={!!errors.category}
                  disabled={!state.type}
                >
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {isFleetType
                    ? fleetCategoryOptions.map((it: { name: string; value: string }) => (
                        <SelectItem key={it.value} value={it.value}>
                          {it.name}
                        </SelectItem>
                      ))
                    : categoryOptions.map((it) => (
                        <SelectItem key={it.id} value={it.name}>
                          {it.name}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
              <FieldError>{errors.category}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="number">Порядковый номер</FieldLabel>
              <Input
                id="number"
                name="number"
                type="number"
                value={state.number}
                placeholder="Введите номер"
                onChange={onChange}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="free">Акция</FieldLabel>
              <Select
                value={state.free === '' ? NONE : state.free}
                onValueChange={(value) =>
                  setState((prev) => ({ ...prev, free: value === NONE ? '' : value }))
                }
              >
                <SelectTrigger id="free">
                  <SelectValue placeholder="Не выбрано" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Не выбрано</SelectItem>
                  <SelectItem value="yes">Да</SelectItem>
                  <SelectItem value="no">Нет</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="price">Цена</FieldLabel>
              <Input
                id="price"
                name="price"
                type="number"
                value={state.price}
                placeholder="Введите цену"
                onChange={onChange}
              />
            </Field>
          </div>
        </FieldGroup>
      </div>

      <div className="flex shrink-0 justify-between border-t px-6 py-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <div className="flex gap-2">
          {mode === 'edit' ? (
            <Button type="button" variant="destructive" onClick={() => setIsDeleteOpen(true)}>
              Удалить
            </Button>
          ) : null}
          <Button type="submit" onClick={submit}>
            {mode === 'create' ? 'Добавить' : 'Сохранить'}
          </Button>
        </div>
      </div>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить услугу?</AlertDialogTitle>
            <AlertDialogDescription>
              Удалив запись вы не сможете ее восстановить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default WindowpriceForm
