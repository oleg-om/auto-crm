import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import diskpaintingPriceFieldList from '../../lists/diskpainting-price-field-list'
import {
  createDiskpaintingprice,
  updateDiskpaintingprice,
  deleteDiskpaintingprice
} from '../../redux/reducers/diskpainting.prices'
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
import type { IDiskpaintingPrice } from '../../../common/types/generated/DiskpaintingPrice'

const NONE = 'none'

const PRICE_FIELDS = diskpaintingPriceFieldList as { key: string; label: string }[]

interface IFormState {
  name: string
  category: string
  number: string
  free: string
  [priceField: string]: string
}

const emptyState: IFormState = {
  name: '',
  category: '',
  number: '',
  free: '',
  ...Object.fromEntries(PRICE_FIELDS.map((field) => [field.key, '']))
}

// The direction ("type") field is never exposed in this form - every record created here has
// always been hardcoded to "legk" (matching the legacy form), and editing preserves whatever
// value the record already has. See diskpainting-type-list.js for context.
const toFormState = (item?: IDiskpaintingPrice): IFormState =>
  item
    ? {
        name: item.name,
        category: item.category,
        number: item.number != null ? String(item.number) : '',
        free: item.free ?? '',
        ...Object.fromEntries(
          PRICE_FIELDS.map((field) => {
            const value = (item as unknown as Record<string, number | undefined>)[field.key]
            return [field.key, value != null ? String(value) : '']
          })
        )
      }
    : emptyState

const toPayload = (state: IFormState, existingType?: string) => ({
  name: state.name,
  category: state.category,
  type: existingType ?? 'legk',
  number: state.number,
  free: state.free,
  ...Object.fromEntries(PRICE_FIELDS.map((field) => [field.key, state[field.key]]))
})

type IFormErrors = Partial<Record<'name' | 'category', string>>

interface IDiskpaintingpriceFormProps {
  mode: 'create' | 'edit'
  item?: IDiskpaintingPrice
  categoryOptions: { id: string; name: string }[]
  onSaved: () => void
  onCancel: () => void
}

const DiskpaintingpriceForm = ({
  mode,
  item,
  categoryOptions,
  onSaved,
  onCancel
}: IDiskpaintingpriceFormProps) => {
  const dispatch = useDispatch<any>()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const [state, setState] = useState<IFormState>(() => toFormState(item))
  const [errors, setErrors] = useState<IFormErrors>({})

  const removeItem = () => {
    if (!item?.id) return
    dispatch(deleteDiskpaintingprice(item.id))
    notify('Услуга удалена')
    onSaved()
  }

  const submit = () => {
    const nextErrors: IFormErrors = {}
    if (!state.name.trim()) nextErrors.name = 'Введите название'
    if (!state.category) nextErrors.category = 'Выберите категорию'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      notify('Заполните обязательные поля')
      return
    }
    if (mode === 'create') {
      dispatch(createDiskpaintingprice(toPayload(state)))
      notify('Услуга добавлена')
    } else if (item?.id) {
      dispatch(updateDiskpaintingprice(item.id, toPayload(state, item.type)))
      notify('Данные изменены')
    }
    onSaved()
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState((prevState) => ({ ...prevState, [name]: value }))
    if (name === 'name' && value.trim()) {
      setErrors((prevErrors) => {
        if (!prevErrors.name) return prevErrors
        const nextErrors = { ...prevErrors }
        delete nextErrors.name
        return nextErrors
      })
    }
  }

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
                    <SelectItem key={it.id} value={it.name}>
                      {it.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{errors.category}</FieldError>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
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
            <FieldLabel>Цены по диаметрам</FieldLabel>
            <div className="grid gap-4 sm:grid-cols-4">
              {PRICE_FIELDS.map((field) => (
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
            <AlertDialogAction onClick={removeItem}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DiskpaintingpriceForm
