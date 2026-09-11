import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import stoTypeList from '../../lists/sto-type-list'
import stoPriceFieldList from '../../lists/sto-price-field-list'
import { createStoprice, updateStoprice, deleteStoprice } from '../../redux/reducers/sto.prices'
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
import type { IStoPrice } from '../../../common/types/generated/StoPrice'

const NONE = 'none'

const PRICE_FIELDS_BY_TYPE = stoPriceFieldList as Record<string, { key: string; label: string }[]>
const ALL_PRICE_FIELDS: string[] = Object.values(PRICE_FIELDS_BY_TYPE).flatMap((fields) =>
  fields.map((it) => it.key)
)

interface IFormState {
  name: string
  type: string
  category: string
  number: string
  free: string
  [priceField: string]: string
}

const emptyState: IFormState = {
  name: '',
  type: '',
  category: '',
  number: '',
  free: '',
  ...Object.fromEntries(ALL_PRICE_FIELDS.map((key) => [key, '']))
}

const toFormState = (stoprice?: IStoPrice): IFormState =>
  stoprice
    ? {
        name: stoprice.name,
        type: stoprice.type,
        category: stoprice.category,
        number: stoprice.number != null ? String(stoprice.number) : '',
        free: stoprice.free ?? '',
        ...Object.fromEntries(
          ALL_PRICE_FIELDS.map((key) => {
            const value = (stoprice as unknown as Record<string, number | undefined>)[key]
            return [key, value != null ? String(value) : '']
          })
        )
      }
    : emptyState

const toPayload = (state: IFormState) => {
  const priceFields = PRICE_FIELDS_BY_TYPE[state.type] ?? []
  const prices = Object.fromEntries(priceFields.map((it) => [it.key, state[it.key]]))
  return {
    name: state.name,
    type: state.type,
    category: state.category,
    number: state.number,
    free: state.free,
    ...prices
  }
}

type IFormErrors = Partial<Record<'name' | 'type' | 'category', string>>

interface ICategoryOption {
  id?: string
  name: string
}

interface IStopriceFormProps {
  mode: 'create' | 'edit'
  stoprice?: IStoPrice
  categoryOptions: ICategoryOption[]
  onSaved: () => void
  onCancel: () => void
}

const StopriceForm = ({
  mode,
  stoprice,
  categoryOptions,
  onSaved,
  onCancel
}: IStopriceFormProps) => {
  const dispatch = useDispatch<any>()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const [state, setState] = useState<IFormState>(() => toFormState(stoprice))
  const [errors, setErrors] = useState<IFormErrors>({})

  const removeStoprice = () => {
    if (!stoprice?.id) return
    dispatch(deleteStoprice(stoprice.id))
    notify('Услуга удалена')
    onSaved()
  }

  const submit = () => {
    const nextErrors: IFormErrors = {}
    if (!state.name.trim()) nextErrors.name = 'Введите название'
    if (!state.type) nextErrors.type = 'Выберите направление'
    if (!state.category) nextErrors.category = 'Выберите категорию'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      notify('Заполните обязательные поля')
      return
    }
    if (mode === 'create') {
      dispatch(createStoprice(toPayload(state)))
      notify('Услуга добавлена')
    } else if (stoprice?.id) {
      dispatch(updateStoprice(stoprice.id, toPayload(state)))
      notify('Данные изменены')
    }
    onSaved()
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

  const priceFields = PRICE_FIELDS_BY_TYPE[state.type] ?? []

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
                  setState((prev) => ({ ...prev, type: value === NONE ? '' : value }))
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
                  {stoTypeList.map((it: { name: string; value: string }) => (
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
                <SelectTrigger id="category" aria-invalid={!!errors.category}>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((it) => (
                    <SelectItem key={it.id ?? it.name} value={it.name}>
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
          </div>

          <Field>
            <FieldLabel>Цены</FieldLabel>
            {!state.type ? (
              <p className="text-sm text-muted-foreground">Сначала выберите направление</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-3">
                {priceFields.map((field) => (
                  <Field key={field.key}>
                    <FieldLabel htmlFor={field.key}>{field.label}</FieldLabel>
                    <Input
                      id={field.key}
                      name={field.key}
                      type="number"
                      value={state[field.key]}
                      placeholder="Введите цену"
                      onChange={onChange}
                    />
                  </Field>
                ))}
              </div>
            )}
          </Field>
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
            <AlertDialogAction onClick={removeStoprice}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default StopriceForm
