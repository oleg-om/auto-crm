import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import NumberFormat from 'react-number-format'
import 'react-toastify/dist/ReactToastify.css'
import { createCustomer, updateCustomer, deleteCustomer } from '../../redux/reducers/customers'
import { getOrganizations } from '../../redux/reducers/organizations'
import sizeThreeList from '../../lists/shinomontazhdiametr'
import sizeGruz from '../../lists/tyres/sizegruz'
import sizeSelhoz from '../../lists/tyres/sizeselhoz'
import { Field, FieldGroup, FieldLabel, FieldSeparator } from '../ui/field'
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
import type { ICustomer } from '../../../common/types/generated/Customer'
import type { IOrganization } from '../../../common/types/generated/Organization'

const NONE = 'none'

interface ICarOption {
  id_car_mark?: number
  id_car_model?: number
  id_car_generation?: number
  name: string
  name_rus?: string
  year_begin?: string
  year_end?: string
}

interface IFormState {
  name: string
  phone: string
  organizationId: string
  mark: string
  model: string
  gen: string
  mod: string
  regnumber: string
  vinnumber: string
  kuzov: string
  diametr: string
  // Not editable here - carried through unchanged so an edit save doesn't
  // clobber values set elsewhere (e.g. from a wash/tyre order).
  class: string
  category: string
  washClass: string
  washCategory: string
}

const toFormState = (customer?: ICustomer): IFormState => ({
  name: customer?.name ?? '',
  phone: customer?.phone ?? '',
  organizationId: customer?.organizationId ?? '',
  mark: customer?.mark ?? '',
  model: customer?.model ?? '',
  gen: customer?.gen ?? '',
  mod: customer?.mod ?? '',
  regnumber: customer?.regnumber ?? '',
  vinnumber: customer?.vinnumber ?? '',
  kuzov: customer?.kuzov ?? '',
  diametr: customer?.diametr ?? '',
  class: customer?.class ?? '',
  category: customer?.category ?? '',
  washClass: customer?.washClass ?? '',
  washCategory: customer?.washCategory ?? ''
})

interface ICustomerFormProps {
  mode: 'create' | 'edit'
  customer?: ICustomer
  onSaved: () => void
  onCancel: () => void
}

const CustomerForm = ({ mode, customer, onSaved, onCancel }: ICustomerFormProps) => {
  const dispatch = useDispatch<any>()
  const organizations = useSelector(
    (s: { organizations: { list: IOrganization[] } }) => s.organizations.list
  )
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  useEffect(() => {
    dispatch(getOrganizations())
  }, [dispatch])

  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const [state, setState] = useState<IFormState>(() => toFormState(customer))

  const [options, setOptions] = useState<{
    mark: ICarOption[]
    model: ICarOption[]
    gen: ICarOption[]
    mod: ICarOption[]
  }>({ mark: [], model: [], gen: [], mod: [] })
  const [stateId, setStateId] = useState({ mark: '', model: '', gen: '', mod: '' })

  useEffect(() => {
    fetch('/api/v1/carmark')
      .then((res) => res.json())
      .then((it) => setOptions((prev) => ({ ...prev, mark: it.data })))
  }, [])

  useEffect(() => {
    if (stateId.mark !== '') {
      fetch(`/api/v1/carmodel/${stateId.mark}`)
        .then((res) => res.json())
        .then((it) => setOptions((prev) => ({ ...prev, model: it.data })))
    }
  }, [stateId.mark])

  useEffect(() => {
    if (stateId.model !== '') {
      fetch(`/api/v1/cargen/${stateId.model}`)
        .then((res) => res.json())
        .then((it) => setOptions((prev) => ({ ...prev, gen: it.data })))
    }
  }, [stateId.model])

  useEffect(() => {
    if (stateId.model !== '') {
      fetch(`/api/v1/carmod/${stateId.model}`)
        .then((res) => res.json())
        .then((it) => setOptions((prev) => ({ ...prev, mod: it.data })))
    }
  }, [stateId.model])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState((prev) => ({ ...prev, [name]: value }))
  }

  const onPhoneChange = (values: { formattedValue: string }) => {
    setState((prev) => ({ ...prev, phone: values.formattedValue }))
  }

  const onChangeMark = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const findCar = options.mark.find((it) => value === it.name)
    setState((prev) => ({ ...prev, mark: value, model: '', gen: '', mod: '' }))
    setStateId((prev) => ({
      ...prev,
      mark: findCar ? String(findCar.id_car_mark) : '',
      model: '',
      gen: '',
      mod: ''
    }))
  }

  const onChangeModel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const finModel = options.model.find((it) => value === it.name)
    setState((prev) => ({ ...prev, model: value, gen: '', mod: '' }))
    setStateId((prev) => ({
      ...prev,
      model: finModel ? String(finModel.id_car_model) : '',
      gen: '',
      mod: ''
    }))
  }

  const onChangeGen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const findGen = options.gen.find((it) =>
      value === it.year_begin && it.year_end
        ? `${it.name} (${it.year_begin}-${it.year_end})`
        : it.name
    )
    setState((prev) => ({ ...prev, gen: value, mod: '' }))
    setStateId((prev) => ({
      ...prev,
      gen: findGen ? String(findGen.id_car_generation) : '',
      mod: ''
    }))
  }

  const onChangeMod = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, mod: e.target.value }))
  }

  const onChangeUppercase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState((prev) => ({ ...prev, [name]: value.toUpperCase() }))
  }

  const onChangeUppercaseRussian = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState((prev) => ({
      ...prev,
      [name]: value
        .toUpperCase()
        .replace(/\s/g, '')
        .replace(/[^а-яё0-9]/i, '')
    }))
  }

  const removeCustomer = () => {
    if (!customer?.id) return
    dispatch(deleteCustomer(customer.id))
    notify('Клиент удален')
    onSaved()
  }

  const submitCreate = () => {
    if (!state.mod) notify('Заполните поле Объем двигателя')
    if (!state.regnumber) notify('Заполните поле гос.номер')
    if (!state.vinnumber) notify('Заполните поле VIN номер')
    if (!state.mark) notify('Укажите марку авто')
    if (!state.model) notify('Укажите модель авто')
    if (!state.gen) notify('Укажите год авто')
    if (!state.name) notify('Заполните поле Имя клиента')
    if (!state.phone) notify('Заполните поле Телефон')
    else if (
      state.name &&
      state.phone &&
      state.mark &&
      state.model &&
      state.gen &&
      state.mod &&
      state.vinnumber &&
      state.regnumber
    ) {
      dispatch(
        createCustomer({
          name: state.name,
          phone: state.phone,
          mark: state.mark,
          model: state.model,
          gen: state.gen,
          mod: state.mod,
          regnumber: state.regnumber,
          vinnumber: state.vinnumber,
          organizationId: state.organizationId || null
        })
      )
      notify('Авто клиента добавлено')
      onSaved()
    }
  }

  const submitEdit = () => {
    if (!state.regnumber && !state.phone) {
      notify('Заполните поле гос.номер либо Телефон')
    } else if (customer?.id && (state.phone || state.regnumber)) {
      dispatch(
        updateCustomer(customer.id, {
          ...state,
          organizationId: state.organizationId || null
        })
      )
      notify('Данные изменены')
      onSaved()
    }
  }

  const submit = () => (mode === 'create' ? submitCreate() : submitEdit())

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-4">
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="name">Имя</FieldLabel>
              <Input
                id="name"
                name="name"
                value={state.name}
                placeholder="Введите имя"
                onChange={onChange}
              />
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

          <Field>
            <FieldLabel htmlFor="organizationId">Организация</FieldLabel>
            <Select
              value={state.organizationId === '' ? NONE : state.organizationId}
              onValueChange={(value) =>
                setState((prev) => ({ ...prev, organizationId: value === NONE ? '' : value }))
              }
            >
              <SelectTrigger id="organizationId">
                <SelectValue placeholder="Выберите организацию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Без организации</SelectItem>
                {(organizations || []).map((org) => (
                  <SelectItem key={org.id} value={org.id as string}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <FieldSeparator>Автомобиль</FieldSeparator>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field>
              <FieldLabel htmlFor="mark">Марка авто</FieldLabel>
              <Input
                id="mark"
                value={state.mark}
                list="mark_list"
                placeholder="Введите бренд"
                autoComplete="off"
                onChange={onChangeMark}
              />
              <datalist id="mark_list">
                {options.mark.map((it) => (
                  <option value={it.name} label={it.name_rus} key={it.id_car_mark} />
                ))}
              </datalist>
            </Field>
            <Field>
              <FieldLabel htmlFor="model">Модель авто</FieldLabel>
              <Input
                id="model"
                value={state.model}
                list="model_list"
                placeholder={state.mark.length < 2 ? 'Сначала выберите марку' : 'Выберите модель'}
                disabled={state.mark.length < 2}
                autoComplete="off"
                onChange={onChangeModel}
              />
              {stateId.mark ? (
                <datalist id="model_list">
                  {options.model.map((it) => (
                    <option key={it.name} value={it.name} label={it.name_rus} />
                  ))}
                </datalist>
              ) : null}
            </Field>
            <Field>
              <FieldLabel htmlFor="gen">Год авто</FieldLabel>
              <Input
                id="gen"
                value={state.gen}
                list="gen_list"
                placeholder={
                  state.model.length < 1 ? 'Сначала выберите модель' : 'Выберите или введите год'
                }
                disabled={state.model.length < 1}
                autoComplete="off"
                onChange={onChangeGen}
              />
              <datalist id="gen_list">
                {options.gen.map((it) => (
                  <option
                    key={it.name}
                    value={
                      it.year_begin && it.year_end
                        ? `${it.name} (${it.year_begin}-${it.year_end})`
                        : it.name
                    }
                    label={it.name_rus}
                  />
                ))}
              </datalist>
            </Field>
            <Field>
              <FieldLabel htmlFor="mod">Объем двигателя</FieldLabel>
              <Input
                id="mod"
                value={state.mod}
                list="mod_list"
                placeholder={
                  state.gen.length < 2 ? 'Сначала выберите год' : 'Выберите или введите объем'
                }
                disabled={state.gen.length < 2}
                autoComplete="off"
                onChange={onChangeMod}
              />
              {stateId.gen ? (
                <datalist id="mod_list">
                  {options.mod
                    .reduce((acc: ICarOption[], current) => {
                      if (!acc.find((item) => item.name === current.name)) {
                        return acc.concat([current])
                      }
                      return acc
                    }, [])
                    .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
                    .map((it) => (
                      <option key={it.name} value={it.name} />
                    ))}
                </datalist>
              ) : null}
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="regnumber">Гос. номер</FieldLabel>
              <Input
                id="regnumber"
                name="regnumber"
                value={state.regnumber}
                placeholder="Введите гос. номер русскими буквами"
                autoComplete="off"
                onChange={onChangeUppercaseRussian}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="vinnumber">VIN номер</FieldLabel>
              <Input
                id="vinnumber"
                name="vinnumber"
                value={state.vinnumber}
                placeholder="Введите VIN"
                autoComplete="off"
                onChange={onChangeUppercase}
              />
            </Field>
          </div>

          {mode === 'edit' ? (
            <>
              <FieldSeparator>Шиномонтаж</FieldSeparator>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="kuzov">Кузов</FieldLabel>
                  <Select
                    value={state.kuzov === '' ? NONE : state.kuzov}
                    onValueChange={(value) =>
                      setState((prev) => ({
                        ...prev,
                        kuzov: value === NONE ? '' : value,
                        diametr: ''
                      }))
                    }
                  >
                    <SelectTrigger id="kuzov">
                      <SelectValue placeholder="Выберите кузов" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>Не выбрано</SelectItem>
                      <SelectItem value="sedan">Седан</SelectItem>
                      <SelectItem value="sedan-shtamp">Седан (штампованные диски)</SelectItem>
                      <SelectItem value="crossover">Кроссовер</SelectItem>
                      <SelectItem value="runflat">RUN FLAT</SelectItem>
                      <SelectItem value="gruz">Грузовой</SelectItem>
                      <SelectItem value="selhoz">Сельхоз</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="diametr">Диаметр</FieldLabel>
                  <Select
                    value={state.diametr === '' ? NONE : state.diametr}
                    disabled={!state.kuzov}
                    onValueChange={(value) =>
                      setState((prev) => ({ ...prev, diametr: value === NONE ? '' : value }))
                    }
                  >
                    <SelectTrigger id="diametr">
                      <SelectValue
                        placeholder={state.kuzov ? 'Выберите диаметр' : 'Сначала выберите кузов'}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>Не выбрано</SelectItem>
                      {(state.kuzov === 'sedan' ||
                      state.kuzov === 'sedan-shtamp' ||
                      state.kuzov === 'crossover' ||
                      state.kuzov === 'runflat'
                        ? sizeThreeList
                        : state.kuzov === 'gruz'
                        ? sizeGruz
                        : state.kuzov === 'selhoz'
                        ? sizeSelhoz
                        : []
                      ).map((it: string) => (
                        <SelectItem key={it} value={it}>
                          {it}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </>
          ) : null}
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
            <AlertDialogTitle>Удалить клиента?</AlertDialogTitle>
            <AlertDialogDescription>
              Удалив запись вы не сможете ее восстановить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={removeCustomer}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default CustomerForm
