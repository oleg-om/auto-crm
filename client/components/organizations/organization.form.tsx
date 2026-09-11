import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import NumberFormat from 'react-number-format'
import 'react-toastify/dist/ReactToastify.css'
import {
  createOrganization,
  updateOrganization,
  deleteOrganization
} from '../../redux/reducers/organizations'
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
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
import type { IOrganization } from '../../../common/types/generated/Organization'

interface IFormState {
  name: string
  phone: string
}

const toFormState = (organization?: IOrganization): IFormState => ({
  name: organization?.name ?? '',
  phone: organization?.phone ?? ''
})

const toPayload = (state: IFormState) => ({
  name: state.name,
  phone: state.phone
})

type IFormErrors = Partial<Record<'name', string>>

interface IOrganizationFormProps {
  mode: 'create' | 'edit'
  organization?: IOrganization
  onSaved: () => void
  onCancel: () => void
}

const OrganizationForm = ({ mode, organization, onSaved, onCancel }: IOrganizationFormProps) => {
  const dispatch = useDispatch<any>()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const [state, setState] = useState<IFormState>(() => toFormState(organization))
  const [errors, setErrors] = useState<IFormErrors>({})

  const removeOrganization = () => {
    if (!organization?.id) return
    dispatch(deleteOrganization(organization.id))
    notify('Организация удалена')
    onSaved()
  }

  const submit = () => {
    const nextErrors: IFormErrors = {}
    if (!state.name.trim()) nextErrors.name = 'Введите название'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      notify('Заполните обязательные поля')
      return
    }
    if (mode === 'create') {
      dispatch(createOrganization(toPayload(state)))
      notify('Запись добавлена')
    } else if (organization?.id) {
      dispatch(updateOrganization(organization.id, toPayload(state)))
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
            <AlertDialogTitle>Удалить организацию?</AlertDialogTitle>
            <AlertDialogDescription>
              Удалив запись вы не сможете ее восстановить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={removeOrganization}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default OrganizationForm
