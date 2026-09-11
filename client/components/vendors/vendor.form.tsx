import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import NumberFormat from 'react-number-format'
import 'react-toastify/dist/ReactToastify.css'
import vendorList from '../../lists/vendor-list'
import { createVendor, updateVendor, deleteVendor } from '../../redux/reducers/vendors'
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
import type { IVendor } from '../../../common/types/generated/Vendor'

const NONE = 'none'

interface IFormState {
  name: string
  phone: string
  type: string
}

const toFormState = (vendor?: IVendor): IFormState => ({
  name: vendor?.name ?? '',
  phone: vendor?.phone ?? '',
  type: vendor?.type ?? ''
})

const toPayload = (state: IFormState) => ({
  name: state.name,
  phone: state.phone,
  type: state.type
})

type IFormErrors = Partial<Record<'name' | 'type', string>>

interface IVendorFormProps {
  mode: 'create' | 'edit'
  vendor?: IVendor
  onSaved: () => void
  onCancel: () => void
}

const VendorForm = ({ mode, vendor, onSaved, onCancel }: IVendorFormProps) => {
  const dispatch = useDispatch<any>()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const [state, setState] = useState<IFormState>(() => toFormState(vendor))
  const [errors, setErrors] = useState<IFormErrors>({})

  const removeVendor = () => {
    if (!vendor?.id) return
    dispatch(deleteVendor(vendor.id))
    notify('Поставщик удален')
    onSaved()
  }

  const submit = () => {
    const nextErrors: IFormErrors = {}
    if (!state.name.trim()) nextErrors.name = 'Введите название'
    if (!state.type) nextErrors.type = 'Выберите категорию'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      notify('Заполните обязательные поля')
      return
    }
    if (mode === 'create') {
      dispatch(createVendor(toPayload(state)))
      notify('Запись добавлена')
    } else if (vendor?.id) {
      dispatch(updateVendor(vendor.id, toPayload(state)))
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

  const onPhoneChange = (values: { formattedValue: string }) => {
    setState((prevState) => ({ ...prevState, phone: values.formattedValue }))
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
                placeholder="Введите название организации"
                required
                aria-invalid={!!errors.name}
                onChange={onChange}
              />
              <FieldError>{errors.name}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">Телефон</FieldLabel>
              <NumberFormat
                id="phone"
                format="+7 (###) ###-##-##"
                mask="_"
                customInput={Input}
                value={state.phone}
                placeholder="Введите телефон"
                onValueChange={onPhoneChange}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!errors.type}>
              <FieldLabel htmlFor="type">Категория</FieldLabel>
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
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {vendorList.map((it: { name: string; value: string }) => (
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
            <AlertDialogTitle>Удалить поставщика?</AlertDialogTitle>
            <AlertDialogDescription>
              Удалив запись вы не сможете ее восстановить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={removeVendor}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default VendorForm
