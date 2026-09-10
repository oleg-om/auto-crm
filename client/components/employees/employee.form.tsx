import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { cn } from '../../lib/utils'
import roleList from '../../lists/role-list'
import { ROLE_BADGE_COLORS, DEFAULT_ROLE_BADGE_COLOR } from '../../consts/role-badge-colors'
import { getPositions } from '../../redux/reducers/positions'
import { createEmployee, updateEmployee, deleteEmployee } from '../../redux/reducers/employees'
import CollapsibleCard from '../ui/collapsible-card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
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
import type { IEmployee } from '../../../common/types/generated/Employee'
import type { IPlace } from '../../../common/types/generated/Place'
import type { IPosition } from '../../../common/types/generated/Position'

const NO_POSITION = 'none'

interface IFormState {
  name: string
  surname: string
  role: string[]
  address: string[]
  numberId: string
  class: string
  positionId: string
  positionIdAdditional: string
  active: boolean
}

const emptyState: IFormState = {
  name: '',
  surname: '',
  role: [],
  address: [],
  numberId: '',
  class: '',
  positionId: '',
  positionIdAdditional: '',
  active: true
}

const toFormState = (employee?: IEmployee): IFormState =>
  employee
    ? {
        name: employee.name,
        surname: employee.surname ?? '',
        role: employee.role ?? [],
        address: employee.address ?? [],
        numberId: employee.numberId ?? '',
        class: employee.class ?? '',
        positionId: employee.positionId ?? '',
        positionIdAdditional: employee.positionIdAdditional ?? '',
        active: employee.active ?? true
      }
    : emptyState

type IFormErrors = Partial<Record<'name' | 'surname', string>>

interface IEmployeeFormProps {
  mode: 'create' | 'edit'
  employee?: IEmployee
  onSaved: () => void
  onCancel: () => void
}

const EmployeeForm = ({ mode, employee, onSaved, onCancel }: IEmployeeFormProps) => {
  const places = useSelector((s: { places: { list: IPlace[] } }) => s.places.list)
  const positions = useSelector((s: { positions: { list: IPosition[] } }) => s.positions.list)
  const dispatch = useDispatch<any>()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const positionOptions: IComboboxOption[] = [
    { value: NO_POSITION, label: 'Не выбрано' },
    ...positions.map((it) => ({ value: it.id as string, label: it.name }))
  ]

  useEffect(() => {
    dispatch(getPositions())
  }, [dispatch])

  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const [state, setState] = useState<IFormState>(() => toFormState(employee))
  const [errors, setErrors] = useState<IFormErrors>({})

  const removeEmployee = () => {
    if (!employee?.id) return
    dispatch(deleteEmployee(employee.id))
    notify('Сотрудник удален')
    onSaved()
  }

  const submit = () => {
    const nextErrors: IFormErrors = {}
    if (!state.name.trim()) nextErrors.name = 'Введите имя'
    if (!state.surname.trim()) nextErrors.surname = 'Введите фамилию'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      notify('Заполните обязательные поля')
      return
    }
    if (mode === 'create') {
      dispatch(createEmployee(state))
      notify('Запись добавлена')
    } else if (employee?.id) {
      dispatch(updateEmployee(employee.id, state))
      notify('Данные изменены')
    }
    onSaved()
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState((prevState) => ({ ...prevState, [name]: value }))
    if (name === 'name' || name === 'surname') {
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
  }

  const togglePlace = (placeId: string, checked: boolean) => {
    setState((prevState) => ({
      ...prevState,
      address: checked
        ? [...prevState.address, placeId]
        : prevState.address.filter((it) => it !== placeId)
    }))
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
        <CollapsibleCard
          title="Основная информация"
          defaultOpen
          contentClassName="grid gap-4 sm:grid-cols-2"
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              name="name"
              value={state.name}
              placeholder="Введите имя"
              required
              aria-invalid={!!errors.name}
              className={cn(errors.name && 'border-destructive focus-visible:ring-destructive')}
              onChange={onChange}
            />
            {errors.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="surname">Фамилия</Label>
            <Input
              id="surname"
              name="surname"
              value={state.surname}
              placeholder="Введите фамилию"
              required
              aria-invalid={!!errors.surname}
              className={cn(errors.surname && 'border-destructive focus-visible:ring-destructive')}
              onChange={onChange}
            />
            {errors.surname ? <p className="text-sm text-destructive">{errors.surname}</p> : null}
          </div>
          <Label
            htmlFor="active"
            className="flex items-center gap-2 rounded-md border bg-background p-2 font-normal cursor-pointer hover:bg-accent/50 sm:col-span-2"
          >
            <Checkbox
              id="active"
              checked={state.active}
              onCheckedChange={(checked) =>
                setState((prev) => ({ ...prev, active: checked === true }))
              }
            />
            Сотрудник активен
            <span className="text-sm font-normal text-muted-foreground">
              (неактивные не отображаются в остальных частях приложения)
            </span>
          </Label>
        </CollapsibleCard>

        <CollapsibleCard
          title="Должности"
          description="Сотрудник может занимать сразу несколько должностей"
          contentClassName="flex flex-col gap-4"
        >
          <div className="flex flex-wrap gap-1.5 min-h-8">
            {state.role.length > 0 ? (
              state.role.map((it) => (
                <Badge key={it} className={ROLE_BADGE_COLORS[it] ?? DEFAULT_ROLE_BADGE_COLOR}>
                  {it}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">Должности не выбраны</span>
            )}
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {roleList.map((it: string) => (
              <Label
                key={it}
                htmlFor={`role-${it}`}
                className="flex items-center gap-2 rounded-md border bg-background p-2 font-normal cursor-pointer hover:bg-accent/50"
              >
                <Checkbox
                  id={`role-${it}`}
                  checked={state.role.includes(it)}
                  onCheckedChange={(checked) => toggleRole(it, checked === true)}
                />
                {it}
              </Label>
            ))}
          </div>
        </CollapsibleCard>

        <CollapsibleCard
          title="Должность для электронного журнала"
          contentClassName="grid gap-4 sm:grid-cols-2"
        >
          <div className="grid gap-2">
            <Label htmlFor="positionId">Основная должность</Label>
            <Combobox
              id="positionId"
              value={state.positionId === '' ? NO_POSITION : state.positionId}
              onChange={(value) =>
                setState((prev) => ({
                  ...prev,
                  positionId: value === NO_POSITION ? '' : value
                }))
              }
              options={positionOptions}
              placeholder="Не выбрано"
              searchPlaceholder="Поиск должности..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="positionIdAdditional">Дополнительная должность</Label>
            <Combobox
              id="positionIdAdditional"
              value={state.positionIdAdditional === '' ? NO_POSITION : state.positionIdAdditional}
              onChange={(value) =>
                setState((prev) => ({
                  ...prev,
                  positionIdAdditional: value === NO_POSITION ? '' : value
                }))
              }
              options={positionOptions}
              placeholder="Не выбрано"
              searchPlaceholder="Поиск должности..."
            />
          </div>
        </CollapsibleCard>

        <CollapsibleCard title="Точки работы">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((it) => (
              <Label
                key={it.id}
                htmlFor={`place-${it.id}`}
                className="flex items-center gap-2 rounded-md border bg-background p-2 font-normal cursor-pointer hover:bg-accent/50"
              >
                <Checkbox
                  id={`place-${it.id}`}
                  checked={state.address.includes(it.id as string)}
                  onCheckedChange={(checked) => togglePlace(it.id as string, checked === true)}
                />
                {it.name}
              </Label>
            ))}
          </div>
        </CollapsibleCard>

        <CollapsibleCard title="Шиномонтаж" contentClassName="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="numberId">Номер сотрудника</Label>
            <Input
              id="numberId"
              name="numberId"
              type="number"
              value={state.numberId}
              placeholder="Введите номер"
              onChange={onChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="class">Класс</Label>
            <Select
              value={state.class === '' ? NO_POSITION : state.class}
              onValueChange={(value) =>
                setState((prev) => ({ ...prev, class: value === NO_POSITION ? '' : value }))
              }
            >
              <SelectTrigger id="class">
                <SelectValue placeholder="Выберите класс" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_POSITION}>Не выбрано</SelectItem>
                <SelectItem value="1">1 (старший)</SelectItem>
                <SelectItem value="2">2 (средний)</SelectItem>
                <SelectItem value="3">3 (студент)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CollapsibleCard>
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
            <AlertDialogTitle>Удалить сотрудника?</AlertDialogTitle>
            <AlertDialogDescription>
              Удалив запись вы не сможете ее восстановить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={removeEmployee}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default EmployeeForm
