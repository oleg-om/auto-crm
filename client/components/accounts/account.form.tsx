import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import accountRoleList from '../../lists/account-role-list'
import { createAccount, updateAccount, deleteAccount } from '../../redux/reducers/accounts'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle
} from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import BadgeList from '../ui/badge-list'
import { Checkbox } from '../ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import Combobox, { type IComboboxOption } from '../ui/combobox'
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
import type { IUser } from '../../../common/types/generated/User'
import type { IEmployee } from '../../../common/types/generated/Employee'
import type { IPlace } from '../../../common/types/generated/Place'

const NONE = 'none'
const POSTS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

const ROLE_NAMES: Record<string, string> = Object.fromEntries(
  accountRoleList.map((it: { name: string; value: string; color: string }) => [it.value, it.name])
)

const ROLE_COLORS: Record<string, string> = Object.fromEntries(
  accountRoleList.map((it: { name: string; value: string; color: string }) => [it.value, it.color])
)

interface IFormState {
  login: string
  password: string
  role: string[]
  userName: string
  place: string
  requestPasswordForReport: boolean
  post: string
}

const emptyState: IFormState = {
  login: '',
  password: '',
  role: [],
  userName: '',
  place: '',
  requestPasswordForReport: false,
  post: ''
}

const toFormState = (account?: IUser): IFormState =>
  account
    ? {
        login: account.login,
        password: '',
        role: account.role ?? [],
        userName: account.userName ?? '',
        place: account.place ?? '',
        requestPasswordForReport: account.requestPasswordForReport ?? false,
        post: account.post != null ? String(account.post) : ''
      }
    : emptyState

const toPayload = (state: IFormState, mode: 'create' | 'edit') => {
  const base = {
    login: state.login,
    role: state.role,
    userName: state.userName,
    place: state.place,
    requestPasswordForReport: state.requestPasswordForReport,
    post: state.post === '' ? null : Number(state.post)
  }
  // Omit the key entirely when left blank on edit - the server does
  // `Object.assign(account, body)` before `.save()`, so an included empty
  // string would overwrite (and re-hash into) an empty password.
  if (mode === 'create' || state.password.trim() !== '') {
    return { ...base, password: state.password }
  }
  return base
}

type IFormErrors = Partial<Record<'login' | 'password' | 'role', string>>

interface IAccountFormProps {
  mode: 'create' | 'edit'
  account?: IUser
  onSaved: () => void
  onCancel: () => void
}

const AccountForm = ({ mode, account, onSaved, onCancel }: IAccountFormProps) => {
  const employees = useSelector((s: { employees: { list: IEmployee[] } }) => s.employees.list)
  const places = useSelector((s: { places: { list: IPlace[] } }) => s.places.list)
  const dispatch = useDispatch<any>()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const [state, setState] = useState<IFormState>(() => toFormState(account))
  const [errors, setErrors] = useState<IFormErrors>({})

  const employeeOptions: IComboboxOption[] = [
    { value: NONE, label: 'Общий аккаунт' },
    ...employees.map((it) => ({
      value: it.id as string,
      label: `${it.name} ${it.surname ?? ''}`.trim()
    }))
  ]
  const placeOptions: IComboboxOption[] = [
    { value: NONE, label: 'Общий аккаунт' },
    ...places.map((it) => ({ value: it.id as string, label: it.name }))
  ]

  const removeAccount = () => {
    if (!account?._id) return
    dispatch(deleteAccount(account._id))
    notify('Аккаунт удален')
    onSaved()
  }

  const submit = () => {
    const nextErrors: IFormErrors = {}
    if (!state.login.trim()) nextErrors.login = 'Введите логин'
    if (mode === 'create' && !state.password.trim()) nextErrors.password = 'Введите пароль'
    if (state.role.length === 0) nextErrors.role = 'Выберите хотя бы один доступ'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      notify('Заполните обязательные поля')
      return
    }
    if (mode === 'create') {
      dispatch(createAccount(toPayload(state, mode)))
      notify('Аккаунт добавлен')
    } else if (account?._id) {
      dispatch(updateAccount(account._id, toPayload(state, mode)))
      notify('Данные изменены')
    }
    onSaved()
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState((prevState) => ({ ...prevState, [name]: value }))
    if (name === 'login' || name === 'password') {
      setErrors((prevErrors) => {
        if (!prevErrors[name]) return prevErrors
        const nextErrors = { ...prevErrors }
        delete nextErrors[name]
        return nextErrors
      })
    }
  }

  const toggleRole = (role: string, checked: boolean) => {
    setState((prevState) => ({
      ...prevState,
      role: checked ? [...prevState.role, role] : prevState.role.filter((it) => it !== role)
    }))
    setErrors((prevErrors) => {
      if (!prevErrors.role) return prevErrors
      const nextErrors = { ...prevErrors }
      delete nextErrors.role
      return nextErrors
    })
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-4">
        <Accordion type="multiple" defaultValue={['basic']} className="w-full">
          <AccordionItem value="basic">
            <AccordionTrigger>Основная информация</AccordionTrigger>
            <AccordionContent>
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field data-invalid={!!errors.login}>
                    <FieldLabel htmlFor="login">Логин</FieldLabel>
                    <Input
                      id="login"
                      name="login"
                      value={state.login}
                      placeholder="Введите логин"
                      required
                      aria-invalid={!!errors.login}
                      onChange={onChange}
                    />
                    <FieldError>{errors.login}</FieldError>
                  </Field>
                  <Field data-invalid={!!errors.password}>
                    <FieldLabel htmlFor="password">
                      {mode === 'edit' ? 'Новый пароль' : 'Пароль'}
                    </FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={state.password}
                      placeholder={
                        mode === 'edit' ? 'Оставьте пустым, чтобы не менять' : 'Введите пароль'
                      }
                      required={mode === 'create'}
                      aria-invalid={!!errors.password}
                      onChange={onChange}
                    />
                    {errors.password ? (
                      <FieldError>{errors.password}</FieldError>
                    ) : mode === 'edit' ? (
                      <FieldDescription>
                        Оставьте поле пустым, чтобы не менять пароль
                      </FieldDescription>
                    ) : null}
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="userName">Сотрудник</FieldLabel>
                    <Combobox
                      id="userName"
                      value={state.userName === '' ? NONE : state.userName}
                      onChange={(value) =>
                        setState((prev) => ({ ...prev, userName: value === NONE ? '' : value }))
                      }
                      options={employeeOptions}
                      placeholder="Общий аккаунт"
                      searchPlaceholder="Поиск сотрудника..."
                    />
                    <FieldDescription>
                      Оставьте «Общий аккаунт», если им пользуется больше одного человека
                    </FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="place">Место работы</FieldLabel>
                    <Combobox
                      id="place"
                      value={state.place === '' ? NONE : state.place}
                      onChange={(value) =>
                        setState((prev) => ({ ...prev, place: value === NONE ? '' : value }))
                      }
                      options={placeOptions}
                      placeholder="Общий аккаунт"
                      searchPlaceholder="Поиск точки..."
                    />
                  </Field>
                </div>
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="roles">
            <AccordionTrigger>Доступы</AccordionTrigger>
            <AccordionContent>
              <FieldGroup>
                <FieldDescription>
                  Какие разделы приложения доступны этому аккаунту
                </FieldDescription>
                <div className="min-h-8">
                  <BadgeList
                    values={state.role}
                    labels={ROLE_NAMES}
                    colors={ROLE_COLORS}
                    limit={Infinity}
                    emptyText="Доступы не выбраны"
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {accountRoleList.map((it: { name: string; value: string; color: string }) => (
                    <FieldLabel key={it.value} htmlFor={`role-${it.value}`}>
                      <Field orientation="horizontal">
                        <Checkbox
                          id={`role-${it.value}`}
                          checked={state.role.includes(it.value)}
                          onCheckedChange={(checked) => toggleRole(it.value, checked === true)}
                        />
                        <FieldContent>
                          <FieldTitle>{it.name}</FieldTitle>
                        </FieldContent>
                      </Field>
                    </FieldLabel>
                  ))}
                </div>
                <FieldError>{errors.role}</FieldError>
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="extra" className="border-b-0">
            <AccordionTrigger>Дополнительно</AccordionTrigger>
            <AccordionContent>
              <FieldGroup>
                <FieldLabel htmlFor="requestPasswordForReport">
                  <Field orientation="horizontal">
                    <Checkbox
                      id="requestPasswordForReport"
                      checked={state.requestPasswordForReport}
                      onCheckedChange={(checked) =>
                        setState((prev) => ({
                          ...prev,
                          requestPasswordForReport: checked === true
                        }))
                      }
                    />
                    <FieldContent>
                      <FieldTitle>Запрашивать пароль на странице «Отчёт»</FieldTitle>
                    </FieldContent>
                  </Field>
                </FieldLabel>
                <Field>
                  <FieldLabel htmlFor="post">
                    Пост № (для печати талонов на одной точке на разных ПК)
                  </FieldLabel>
                  <Select
                    value={state.post === '' ? NONE : state.post}
                    onValueChange={(value) =>
                      setState((prev) => ({ ...prev, post: value === NONE ? '' : value }))
                    }
                  >
                    <SelectTrigger id="post">
                      <SelectValue placeholder="Не выбран" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>Не выбран</SelectItem>
                      {POSTS.map((it) => (
                        <SelectItem key={it} value={it}>
                          № {it}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
            <AlertDialogTitle>Удалить аккаунт?</AlertDialogTitle>
            <AlertDialogDescription>
              Удалив запись вы не сможете ее восстановить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={removeAccount}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AccountForm
