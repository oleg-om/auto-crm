import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import materialList from '../../lists/material-list'
import { createMaterial, updateMaterial, deleteMaterial } from '../../redux/reducers/materials'
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
import type { IMaterials } from '../../../common/types/generated/Materials'

const NONE = 'none'

interface IFormState {
  name: string
  artikul: string
  price: string
  quantity: string
  type: string
  category: string
  free: string
  plus: string
}

const emptyState: IFormState = {
  name: '',
  artikul: '',
  price: '',
  quantity: '',
  type: '',
  category: '',
  free: '',
  plus: ''
}

const toFormState = (material?: IMaterials): IFormState =>
  material
    ? {
        name: material.name,
        artikul: material.artikul ?? '',
        price: material.price != null ? String(material.price) : '',
        quantity: material.quantity != null ? String(material.quantity) : '',
        type: material.type,
        category: material.category,
        free: material.free ?? '',
        plus: material.plus ?? ''
      }
    : emptyState

const toPayload = (state: IFormState) => ({
  name: state.name,
  artikul: state.artikul,
  price: state.price,
  quantity: state.quantity,
  type: state.type,
  category: state.category,
  free: state.free,
  plus: state.plus
})

type IFormErrors = Partial<Record<'name' | 'price' | 'quantity' | 'type' | 'category', string>>

interface IMaterialFormProps {
  mode: 'create' | 'edit'
  material?: IMaterials
  categories: string[]
  onSaved: () => void
  onCancel: () => void
}

const MaterialForm = ({ mode, material, categories, onSaved, onCancel }: IMaterialFormProps) => {
  const dispatch = useDispatch<any>()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const [state, setState] = useState<IFormState>(() => toFormState(material))
  const [errors, setErrors] = useState<IFormErrors>({})

  const removeMaterial = () => {
    if (!material?.id) return
    dispatch(deleteMaterial(material.id))
    notify('Материал удален')
    onSaved()
  }

  const submit = () => {
    const nextErrors: IFormErrors = {}
    if (!state.name.trim()) nextErrors.name = 'Введите название'
    if (!state.price.trim()) nextErrors.price = 'Введите цену'
    if (!state.quantity.trim()) nextErrors.quantity = 'Введите количество'
    if (!state.type) nextErrors.type = 'Выберите направление'
    if (!state.category.trim()) nextErrors.category = 'Введите категорию'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      notify('Заполните обязательные поля')
      return
    }
    if (mode === 'create') {
      dispatch(createMaterial(toPayload(state)))
      notify('Материал добавлен')
    } else if (material?.id) {
      dispatch(updateMaterial(material.id, toPayload(state)))
      notify('Данные изменены')
    }
    onSaved()
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState((prevState) => ({ ...prevState, [name]: value }))
    if (name === 'name' || name === 'price' || name === 'quantity' || name === 'category') {
      setErrors((prevErrors) => {
        if (!prevErrors[name]) return prevErrors
        const nextErrors = { ...prevErrors }
        delete nextErrors[name]
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
              <FieldLabel htmlFor="name">Название</FieldLabel>
              <Input
                id="name"
                name="name"
                value={state.name}
                placeholder="Отображаемое название"
                required
                aria-invalid={!!errors.name}
                onChange={onChange}
              />
              <FieldError>{errors.name}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="artikul">Артикул</FieldLabel>
              <Input
                id="artikul"
                name="artikul"
                value={state.artikul}
                placeholder="Введите артикул"
                onChange={onChange}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!errors.price}>
              <FieldLabel htmlFor="price">Цена</FieldLabel>
              <Input
                id="price"
                name="price"
                type="number"
                value={state.price}
                placeholder="Введите цену"
                aria-invalid={!!errors.price}
                onChange={onChange}
              />
              <FieldError>{errors.price}</FieldError>
            </Field>
            <Field data-invalid={!!errors.quantity}>
              <FieldLabel htmlFor="quantity">Количество</FieldLabel>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={state.quantity}
                placeholder="Введите количество"
                aria-invalid={!!errors.quantity}
                onChange={onChange}
              />
              <FieldError>{errors.quantity}</FieldError>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
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
                  {materialList.map((it: { name: string; value: string }) => (
                    <SelectItem key={it.value} value={it.value}>
                      {it.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{errors.type}</FieldError>
            </Field>
            <Field data-invalid={!!errors.category}>
              <FieldLabel htmlFor="category">Категория</FieldLabel>
              <Input
                id="category"
                name="category"
                list="material-category-list"
                value={state.category}
                placeholder="Введите категорию"
                aria-invalid={!!errors.category}
                onChange={onChange}
              />
              <datalist id="material-category-list">
                {categories.map((it) => (
                  <option key={it} value={it}>
                    {it}
                  </option>
                ))}
              </datalist>
              <FieldError>{errors.category}</FieldError>
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
              <FieldLabel htmlFor="plus">Доп.управление</FieldLabel>
              <Select
                value={state.plus === '' ? NONE : state.plus}
                onValueChange={(value) =>
                  setState((prev) => ({ ...prev, plus: value === NONE ? '' : value }))
                }
              >
                <SelectTrigger id="plus">
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
            <AlertDialogTitle>Удалить материал?</AlertDialogTitle>
            <AlertDialogDescription>
              Удалив запись вы не сможете ее восстановить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={removeMaterial}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default MaterialForm
