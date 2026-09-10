import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import NumberFormat from 'react-number-format'
import 'react-toastify/dist/ReactToastify.css'
import { cn } from '../../lib/utils'
import discountsFull from '../../lists/discounts.full'
import { createPlace, updatePlace, deletePlace } from '../../redux/reducers/places'
import CollapsibleCard from '../ui/collapsible-card'
import { Label } from '../ui/label'
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
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
        <CollapsibleCard
          title="Основная информация"
          defaultOpen
          contentClassName="grid gap-4 sm:grid-cols-2"
        >
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="name">Название объекта</Label>
            <Input
              id="name"
              name="name"
              value={state.name}
              placeholder="Например: ул. Мирошника 5, Автодом"
              required
              aria-invalid={!!errors.name}
              className={cn(errors.name && 'border-destructive focus-visible:ring-destructive')}
              onChange={onChange}
            />
            {errors.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="workTime">Время работы</Label>
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
          </div>
          <div className="grid gap-2">
            <Label htmlFor="autopartsphone">Автозапчасти — телефон</Label>
            <NumberFormat
              id="autopartsphone"
              format="+7 (###) ###-##-##"
              mask="_"
              customInput={Input}
              value={state.autopartsphone}
              placeholder="Автозапчасти — номер телефона"
              onValueChange={onPhoneChange('autopartsphone')}
            />
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
            Адрес активен
            <span className="text-sm font-normal text-muted-foreground">
              (неактивные не отображаются в остальных частях приложения)
            </span>
          </Label>
        </CollapsibleCard>

        <CollapsibleCard title="Развал-схождение и замена масла" contentClassName="grid gap-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <Label
              htmlFor="razval"
              className="flex items-center gap-2 rounded-md border bg-background p-2 font-normal cursor-pointer hover:bg-accent/50"
            >
              <Checkbox
                id="razval"
                checked={state.razval}
                onCheckedChange={(checked) =>
                  setState((prev) => ({ ...prev, razval: checked === true }))
                }
              />
              Есть развал-схождение
            </Label>
            <Label
              htmlFor="oil"
              className="flex items-center gap-2 rounded-md border bg-background p-2 font-normal cursor-pointer hover:bg-accent/50"
            >
              <Checkbox
                id="oil"
                checked={state.oil}
                onCheckedChange={(checked) =>
                  setState((prev) => ({ ...prev, oil: checked === true }))
                }
              />
              Есть замена масла
            </Label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="razvalquantity">Количество постов развала</Label>
              <Input
                id="razvalquantity"
                name="razvalquantity"
                type="number"
                value={state.razvalquantity}
                placeholder="Введите количество постов"
                onChange={onChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="oilquantity">Количество постов замены масла</Label>
              <Input
                id="oilquantity"
                name="oilquantity"
                type="number"
                value={state.oilquantity}
                placeholder="Введите количество постов"
                onChange={onChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="razvalphone">Развал — телефон</Label>
              <NumberFormat
                id="razvalphone"
                format="+7 (###) ###-##-##"
                mask="_"
                customInput={Input}
                value={state.razvalphone}
                placeholder="Развал — номер телефона"
                onValueChange={onPhoneChange('razvalphone')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="razvalAndOilType">Способ отображения постов</Label>
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
            </div>
          </div>
        </CollapsibleCard>

        <CollapsibleCard title="Шиномонтаж" contentClassName="grid gap-4">
          <Label
            htmlFor="shinomontazh"
            className="flex items-center gap-2 rounded-md border bg-background p-2 font-normal cursor-pointer hover:bg-accent/50"
          >
            <Checkbox
              id="shinomontazh"
              checked={state.shinomontazh}
              onCheckedChange={(checked) =>
                setState((prev) => ({ ...prev, shinomontazh: checked === true }))
              }
            />
            Есть шиномонтаж
          </Label>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="shinomontazhquantity">Количество постов</Label>
              <Input
                id="shinomontazhquantity"
                name="shinomontazhquantity"
                type="number"
                value={state.shinomontazhquantity}
                placeholder="Введите количество постов"
                onChange={onChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shinomontazhphone">Шиномонтаж — телефон</Label>
              <NumberFormat
                id="shinomontazhphone"
                format="+7 (###) ###-##-##"
                mask="_"
                customInput={Input}
                value={state.shinomontazhphone}
                placeholder="Шиномонтаж — номер телефона"
                onValueChange={onPhoneChange('shinomontazhphone')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shinomeaning">Знак процентной ставки</Label>
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
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shinostavka">Процентная ставка</Label>
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
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shinomontazhType">Способ отображения постов</Label>
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
            </div>
          </div>
          <Label
            htmlFor="boostShinomontazhPrices"
            className="flex items-center gap-2 rounded-md border bg-background p-2 font-normal cursor-pointer hover:bg-accent/50"
            title="Повышает цены на шиномонтаж на +1 диаметр (например, цена для 14 диаметра становится ценой для 15)"
          >
            <Checkbox
              id="boostShinomontazhPrices"
              checked={state.boostShinomontazhPrices}
              onCheckedChange={(checked) =>
                setState((prev) => ({ ...prev, boostShinomontazhPrices: checked === true }))
              }
            />
            Повысить цены шиномонтажа
            <span className="text-sm font-normal text-muted-foreground">(+1 диаметр к прайсу)</span>
          </Label>
        </CollapsibleCard>

        <CollapsibleCard title="СТО" contentClassName="grid gap-4">
          <Label
            htmlFor="sto"
            className="flex items-center gap-2 rounded-md border bg-background p-2 font-normal cursor-pointer hover:bg-accent/50"
          >
            <Checkbox
              id="sto"
              checked={state.sto}
              onCheckedChange={(checked) =>
                setState((prev) => ({ ...prev, sto: checked === true }))
              }
            />
            Есть СТО
          </Label>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="stoboxes">Количество постов СТО</Label>
              <Input
                id="stoboxes"
                name="stoboxes"
                type="number"
                value={state.stoboxes}
                placeholder="Введите количество постов"
                onChange={onChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stophone">СТО — телефон</Label>
              <NumberFormat
                id="stophone"
                format="+7 (###) ###-##-##"
                mask="_"
                customInput={Input}
                value={state.stophone}
                placeholder="СТО — номер телефона"
                onValueChange={onPhoneChange('stophone')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stoType">Способ отображения постов</Label>
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
            </div>
          </div>
        </CollapsibleCard>

        <CollapsibleCard title="Автомойка" contentClassName="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="washboxes">Количество постов автомойки</Label>
            <Input
              id="washboxes"
              name="washboxes"
              type="number"
              value={state.washboxes}
              placeholder="Введите количество постов"
              onChange={onChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="washphone">Автомойка — телефон</Label>
            <NumberFormat
              id="washphone"
              format="+7 (###) ###-##-##"
              mask="_"
              customInput={Input}
              value={state.washphone}
              placeholder="Автомойка — номер телефона"
              onValueChange={onPhoneChange('washphone')}
            />
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
