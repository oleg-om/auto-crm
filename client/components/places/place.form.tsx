import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import NumberFormat from 'react-number-format'
import 'react-toastify/dist/ReactToastify.css'
import discountsFull from '../../lists/discounts.full'
import { createPlace, updatePlace, deletePlace } from '../../redux/reducers/places'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
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
import type { IPlace } from '../../../common/types/generated/Place'

const NONE = 'none'

interface IDiscount {
  name: string
  value: string
  meaning: string
}

const discounts = discountsFull as IDiscount[]

interface IFormState {
  name: string
  active: boolean
  razval: boolean
  razvalquantity: string
  oil: boolean
  oilquantity: string
  autopartsphone: string
  razvalphone: string
  shinomontazh: boolean
  shinomontazhquantity: string
  shinomeaning: string
  shinostavka: string
  shinomontazhphone: string
  shinomontazhType: string
  boostShinomontazhPrices: boolean
  sto: boolean
  stoboxes: string
  stophone: string
  stoType: string
  washboxes: string
  washphone: string
  razvalAndOilType: string
  workTime: string
}

const emptyState: IFormState = {
  name: '',
  active: true,
  razval: false,
  razvalquantity: '',
  oil: false,
  oilquantity: '',
  autopartsphone: '',
  razvalphone: '',
  shinomontazh: false,
  shinomontazhquantity: '',
  shinomeaning: '',
  shinostavka: '',
  shinomontazhphone: '',
  shinomontazhType: 'classic',
  boostShinomontazhPrices: false,
  sto: false,
  stoboxes: '',
  stophone: '',
  stoType: 'classic',
  washboxes: '',
  washphone: '',
  razvalAndOilType: 'classic',
  workTime: '10'
}

const toFormState = (place?: IPlace): IFormState =>
  place
    ? {
        name: place.name,
        active: place.active ?? true,
        razval: place.razval === 'true',
        razvalquantity: place.razvalquantity ?? '',
        oil: place.oil === 'true',
        oilquantity: place.oilquantity ?? '',
        autopartsphone: place.autopartsphone ?? '',
        razvalphone: place.razvalphone ?? '',
        shinomontazh: place.shinomontazh === 'true',
        shinomontazhquantity: place.shinomontazhquantity ?? '',
        shinomeaning: place.shinomeaning ?? '',
        shinostavka: place.shinostavka ?? '',
        shinomontazhphone: place.shinomontazhphone ?? '',
        shinomontazhType: place.shinomontazhType ?? 'classic',
        boostShinomontazhPrices: place.boostShinomontazhPrices === true,
        sto: place.sto === 'true',
        stoboxes: place.stoboxes != null ? String(place.stoboxes) : '',
        stophone: place.stophone ?? '',
        stoType: place.stoType ?? 'classic',
        washboxes: place.washboxes != null ? String(place.washboxes) : '',
        washphone: place.washphone ?? '',
        razvalAndOilType: place.razvalAndOilType ?? 'classic',
        workTime: place.workTime != null ? String(place.workTime) : '10'
      }
    : emptyState

const toPayload = (state: IFormState) => ({
  name: state.name,
  active: state.active,
  razval: String(state.razval),
  razvalquantity: state.razvalquantity,
  oil: String(state.oil),
  oilquantity: state.oilquantity,
  autopartsphone: state.autopartsphone,
  razvalphone: state.razvalphone,
  shinomontazh: String(state.shinomontazh),
  shinomontazhquantity: state.shinomontazhquantity,
  shinomeaning: state.shinomeaning,
  shinostavka: state.shinostavka,
  shinomontazhphone: state.shinomontazhphone,
  shinomontazhType: state.shinomontazhType,
  boostShinomontazhPrices: state.boostShinomontazhPrices,
  sto: String(state.sto),
  stoboxes: state.stoboxes,
  stophone: state.stophone,
  stoType: state.stoType,
  washboxes: state.washboxes,
  washphone: state.washphone,
  razvalAndOilType: state.razvalAndOilType,
  workTime: state.workTime
})

type IFormErrors = Partial<Record<'name', string>>

interface IPlaceFormProps {
  mode: 'create' | 'edit'
  place?: IPlace
  onSaved: () => void
  onCancel: () => void
}

const PlaceForm = ({ mode, place, onSaved, onCancel }: IPlaceFormProps) => {
  const dispatch = useDispatch<any>()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const [state, setState] = useState<IFormState>(() => toFormState(place))
  const [errors, setErrors] = useState<IFormErrors>({})

  const removePlace = () => {
    if (!place?.id) return
    dispatch(deletePlace(place.id))
    notify('Адрес удален')
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
      dispatch(createPlace(toPayload(state)))
      notify('Запись добавлена')
    } else if (place?.id) {
      dispatch(updatePlace(place.id, toPayload(state)))
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

  const onPhoneChange = (name: keyof IFormState) => (values: { value: string }) => {
    setState((prevState) => ({ ...prevState, [name]: values.value }))
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-4">
        <Accordion type="multiple" defaultValue={['basic']} className="w-full">
          <AccordionItem value="basic">
            <AccordionTrigger>Основная информация</AccordionTrigger>
            <AccordionContent>
              <FieldGroup>
                <Field data-invalid={!!errors.name}>
                  <FieldLabel htmlFor="name">Название объекта</FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    value={state.name}
                    placeholder="Например: ул. Мирошника 5, Автодом"
                    required
                    aria-invalid={!!errors.name}
                    onChange={onChange}
                  />
                  <FieldError>{errors.name}</FieldError>
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="workTime">Время работы</FieldLabel>
                    <Select
                      value={state.workTime}
                      onValueChange={(value) => setState((prev) => ({ ...prev, workTime: value }))}
                    >
                      <SelectTrigger id="workTime">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 часов</SelectItem>
                        <SelectItem value="24">24 часа</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="autopartsphone">Автозапчасти — телефон</FieldLabel>
                    <NumberFormat
                      id="autopartsphone"
                      format="+7 (###) ###-##-##"
                      mask="_"
                      customInput={Input}
                      value={state.autopartsphone}
                      placeholder="Автозапчасти — номер телефона"
                      onValueChange={onPhoneChange('autopartsphone')}
                    />
                  </Field>
                </div>
                <Field orientation="horizontal">
                  <Checkbox
                    id="active"
                    checked={state.active}
                    onCheckedChange={(checked) =>
                      setState((prev) => ({ ...prev, active: checked === true }))
                    }
                  />
                  <FieldContent>
                    <FieldLabel htmlFor="active">Адрес активен</FieldLabel>
                    <FieldDescription>
                      Неактивные не отображаются в остальных частях приложения
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="razval-oil">
            <AccordionTrigger>Развал-схождение и замена масла</AccordionTrigger>
            <AccordionContent>
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field orientation="horizontal">
                    <Checkbox
                      id="razval"
                      checked={state.razval}
                      onCheckedChange={(checked) =>
                        setState((prev) => ({ ...prev, razval: checked === true }))
                      }
                    />
                    <FieldContent>
                      <FieldLabel htmlFor="razval">Есть развал-схождение</FieldLabel>
                    </FieldContent>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox
                      id="oil"
                      checked={state.oil}
                      onCheckedChange={(checked) =>
                        setState((prev) => ({ ...prev, oil: checked === true }))
                      }
                    />
                    <FieldContent>
                      <FieldLabel htmlFor="oil">Есть замена масла</FieldLabel>
                    </FieldContent>
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="razvalquantity">Количество постов развала</FieldLabel>
                    <Input
                      id="razvalquantity"
                      name="razvalquantity"
                      type="number"
                      value={state.razvalquantity}
                      placeholder="Введите количество постов"
                      onChange={onChange}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="oilquantity">Количество постов замены масла</FieldLabel>
                    <Input
                      id="oilquantity"
                      name="oilquantity"
                      type="number"
                      value={state.oilquantity}
                      placeholder="Введите количество постов"
                      onChange={onChange}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="razvalphone">Развал — телефон</FieldLabel>
                    <NumberFormat
                      id="razvalphone"
                      format="+7 (###) ###-##-##"
                      mask="_"
                      customInput={Input}
                      value={state.razvalphone}
                      placeholder="Развал — номер телефона"
                      onValueChange={onPhoneChange('razvalphone')}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="razvalAndOilType">Способ отображения постов</FieldLabel>
                    <Select
                      value={state.razvalAndOilType}
                      onValueChange={(value) =>
                        setState((prev) => ({ ...prev, razvalAndOilType: value }))
                      }
                    >
                      <SelectTrigger id="razvalAndOilType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="classic">Классический (одна ячейка)</SelectItem>
                        <SelectItem value="column">Отдельные колонки</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="shinomontazh">
            <AccordionTrigger>Шиномонтаж</AccordionTrigger>
            <AccordionContent>
              <FieldGroup>
                <Field orientation="horizontal">
                  <Checkbox
                    id="shinomontazh"
                    checked={state.shinomontazh}
                    onCheckedChange={(checked) =>
                      setState((prev) => ({ ...prev, shinomontazh: checked === true }))
                    }
                  />
                  <FieldContent>
                    <FieldLabel htmlFor="shinomontazh">Есть шиномонтаж</FieldLabel>
                  </FieldContent>
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="shinomontazhquantity">Количество постов</FieldLabel>
                    <Input
                      id="shinomontazhquantity"
                      name="shinomontazhquantity"
                      type="number"
                      value={state.shinomontazhquantity}
                      placeholder="Введите количество постов"
                      onChange={onChange}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="shinomontazhphone">Шиномонтаж — телефон</FieldLabel>
                    <NumberFormat
                      id="shinomontazhphone"
                      format="+7 (###) ###-##-##"
                      mask="_"
                      customInput={Input}
                      value={state.shinomontazhphone}
                      placeholder="Шиномонтаж — номер телефона"
                      onValueChange={onPhoneChange('shinomontazhphone')}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="shinomeaning">Знак процентной ставки</FieldLabel>
                    <Select
                      value={state.shinomeaning === '' ? NONE : state.shinomeaning}
                      onValueChange={(value) =>
                        setState((prev) => ({ ...prev, shinomeaning: value === NONE ? '' : value }))
                      }
                    >
                      <SelectTrigger id="shinomeaning">
                        <SelectValue placeholder="Нет" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NONE}>Нет</SelectItem>
                        <SelectItem value="positive">+</SelectItem>
                        <SelectItem value="negative">-</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="shinostavka">Процентная ставка</FieldLabel>
                    <Select
                      value={state.shinostavka === '' ? NONE : state.shinostavka}
                      onValueChange={(value) =>
                        setState((prev) => ({ ...prev, shinostavka: value === NONE ? '' : value }))
                      }
                    >
                      <SelectTrigger id="shinostavka">
                        <SelectValue placeholder="Выберите процент" />
                      </SelectTrigger>
                      <SelectContent>
                        {discounts.map((it) => (
                          <SelectItem key={it.name} value={it.value === '' ? NONE : it.value}>
                            {it.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="shinomontazhType">Способ отображения постов</FieldLabel>
                    <Select
                      value={state.shinomontazhType}
                      onValueChange={(value) =>
                        setState((prev) => ({ ...prev, shinomontazhType: value }))
                      }
                    >
                      <SelectTrigger id="shinomontazhType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="classic">Классический (одна ячейка)</SelectItem>
                        <SelectItem value="column">Отдельные колонки</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <Field orientation="horizontal">
                  <Checkbox
                    id="boostShinomontazhPrices"
                    checked={state.boostShinomontazhPrices}
                    onCheckedChange={(checked) =>
                      setState((prev) => ({ ...prev, boostShinomontazhPrices: checked === true }))
                    }
                  />
                  <FieldContent>
                    <FieldLabel htmlFor="boostShinomontazhPrices">
                      Повысить цены шиномонтажа
                    </FieldLabel>
                    <FieldDescription>
                      Повышает цены на шиномонтаж на +1 диаметр (например, цена для 14 диаметра
                      становится ценой для 15)
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sto">
            <AccordionTrigger>СТО</AccordionTrigger>
            <AccordionContent>
              <FieldGroup>
                <Field orientation="horizontal">
                  <Checkbox
                    id="sto"
                    checked={state.sto}
                    onCheckedChange={(checked) =>
                      setState((prev) => ({ ...prev, sto: checked === true }))
                    }
                  />
                  <FieldContent>
                    <FieldLabel htmlFor="sto">Есть СТО</FieldLabel>
                  </FieldContent>
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="stoboxes">Количество постов СТО</FieldLabel>
                    <Input
                      id="stoboxes"
                      name="stoboxes"
                      type="number"
                      value={state.stoboxes}
                      placeholder="Введите количество постов"
                      onChange={onChange}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="stophone">СТО — телефон</FieldLabel>
                    <NumberFormat
                      id="stophone"
                      format="+7 (###) ###-##-##"
                      mask="_"
                      customInput={Input}
                      value={state.stophone}
                      placeholder="СТО — номер телефона"
                      onValueChange={onPhoneChange('stophone')}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="stoType">Способ отображения постов</FieldLabel>
                    <Select
                      value={state.stoType}
                      onValueChange={(value) => setState((prev) => ({ ...prev, stoType: value }))}
                    >
                      <SelectTrigger id="stoType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="classic">Классический (одна ячейка)</SelectItem>
                        <SelectItem value="column">Отдельные колонки</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="wash" className="border-b-0">
            <AccordionTrigger>Автомойка</AccordionTrigger>
            <AccordionContent>
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="washboxes">Количество постов автомойки</FieldLabel>
                    <Input
                      id="washboxes"
                      name="washboxes"
                      type="number"
                      value={state.washboxes}
                      placeholder="Введите количество постов"
                      onChange={onChange}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="washphone">Автомойка — телефон</FieldLabel>
                    <NumberFormat
                      id="washphone"
                      format="+7 (###) ###-##-##"
                      mask="_"
                      customInput={Input}
                      value={state.washphone}
                      placeholder="Автомойка — номер телефона"
                      onValueChange={onPhoneChange('washphone')}
                    />
                  </Field>
                </div>
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
            <AlertDialogTitle>Удалить адрес?</AlertDialogTitle>
            <AlertDialogDescription>
              Удалив запись вы не сможете ее восстановить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={removePlace}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default PlaceForm
