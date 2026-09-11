import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import categoryList from '../../lists/category-list'
import { createCategory, updateCategory, deleteCategory } from '../../redux/reducers/categorys'
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
import type { ICategory } from '../../../common/types/generated/Category'

const NONE = 'none'

interface IFormState {
  name: string
  type: string
}

const toFormState = (category?: ICategory): IFormState => ({
  name: category?.name ?? '',
  type: category?.type ?? ''
})

const toPayload = (state: IFormState) => ({
  name: state.name,
  type: state.type
})

type IFormErrors = Partial<Record<'name' | 'type', string>>

interface ICategoryFormProps {
  mode: 'create' | 'edit'
  category?: ICategory
  onSaved: () => void
  onCancel: () => void
}

const CategoryForm = ({ mode, category, onSaved, onCancel }: ICategoryFormProps) => {
  const dispatch = useDispatch<any>()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const [state, setState] = useState<IFormState>(() => toFormState(category))
  const [errors, setErrors] = useState<IFormErrors>({})

  const removeCategory = () => {
    if (!category?.id) return
    dispatch(deleteCategory(category.id))
    notify('Категория удалена')
    onSaved()
  }

  const submit = () => {
    const nextErrors: IFormErrors = {}
    if (!state.name.trim()) nextErrors.name = 'Введите название'
    if (!state.type) nextErrors.type = 'Выберите подкатегорию'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      notify('Заполните обязательные поля')
      return
    }
    if (mode === 'create') {
      dispatch(createCategory(toPayload(state)))
      notify('Запись добавлена')
    } else if (category?.id) {
      dispatch(updateCategory(category.id, toPayload(state)))
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
              <FieldLabel htmlFor="name">Название</FieldLabel>
              <Input
                id="name"
                name="name"
                value={state.name}
                placeholder="Введите название категории"
                required
                aria-invalid={!!errors.name}
                onChange={onChange}
              />
              <FieldError>{errors.name}</FieldError>
            </Field>
            <Field data-invalid={!!errors.type}>
              <FieldLabel htmlFor="type">Подкатегория</FieldLabel>
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
                  <SelectValue placeholder="Выберите подкатегорию" />
                </SelectTrigger>
                <SelectContent>
                  {categoryList.map((it: { name: string; value: string }) => (
                    <SelectItem key={it.value} value={it.value}>
                      {it.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{errors.type}</FieldError>
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
            {mode === 'create' ? 'Создать' : 'Сохранить'}
          </Button>
        </div>
      </div>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить категорию?</AlertDialogTitle>
            <AlertDialogDescription>
              Удалив запись вы не сможете ее восстановить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={removeCategory}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default CategoryForm
