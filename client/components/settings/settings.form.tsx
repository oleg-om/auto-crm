import React, { useState } from 'react'
import { toast } from 'react-toastify'
import NumberFormat from 'react-number-format'
import 'react-toastify/dist/ReactToastify.css'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { DEFAULT_JOURNAL_WORK_TIME_TOLERANCE_MIN } from '../../lib/journal-settings'
import type { ISettings } from '../../../common/types/generated/Settings'

interface IFormState {
  helpphone: string
  lastKerchshina: string
  journalWorkTimeToleranceMin: string
}

const toFormState = (settings?: ISettings): IFormState => ({
  helpphone: settings?.helpphone ?? '',
  lastKerchshina: settings?.lastKerchshina ?? '',
  journalWorkTimeToleranceMin: String(
    settings?.journalWorkTimeToleranceMin ?? DEFAULT_JOURNAL_WORK_TIME_TOLERANCE_MIN
  )
})

interface ISettingsFormProps {
  settings?: ISettings
  onSave: (data: Partial<ISettings>) => void
}

const SettingsForm = ({ settings, onSave }: ISettingsFormProps) => {
  const [state, setState] = useState<IFormState>(() => toFormState(settings))
  const [toleranceError, setToleranceError] = useState('')

  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState((prev) => ({ ...prev, [name]: value }))
  }

  const submit = () => {
    const tolerance = Number(state.journalWorkTimeToleranceMin)
    if (state.journalWorkTimeToleranceMin === '' || !Number.isInteger(tolerance) || tolerance < 0) {
      setToleranceError('Введите целое число минут, 0 или больше')
      return
    }
    setToleranceError('')
    onSave({ ...state, journalWorkTimeToleranceMin: tolerance })
    notify('Данные изменены')
  }

  return (
    <Card className="my-3 max-w-2xl">
      <CardHeader>
        <CardTitle>Общие настройки</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="helpphone">Телефон поддержки автозапчастей</FieldLabel>
            <NumberFormat
              id="helpphone"
              format="+7 (###) ###-##-##"
              mask="_"
              customInput={Input}
              value={state.helpphone}
              placeholder="Автозапчасти — номер поддержки"
              onValueChange={(values) => setState((prev) => ({ ...prev, helpphone: values.value }))}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="lastKerchshina">
              Начиная с какого номера грузить заказы по шинам?
            </FieldLabel>
            <Input
              id="lastKerchshina"
              name="lastKerchshina"
              type="number"
              value={state.lastKerchshina}
              placeholder="Введите номер"
              onChange={onChange}
            />
          </Field>
          <Field data-invalid={!!toleranceError}>
            <FieldLabel htmlFor="journalWorkTimeToleranceMin">
              Электронный журнал: допуск начала и окончания рабочего дня (мин)
            </FieldLabel>
            <Input
              id="journalWorkTimeToleranceMin"
              name="journalWorkTimeToleranceMin"
              type="number"
              min="0"
              step="1"
              value={state.journalWorkTimeToleranceMin}
              aria-invalid={!!toleranceError}
              onChange={(e) => {
                onChange(e)
                setToleranceError('')
              }}
            />
            <FieldDescription>
              Насколько можно начать позже или закончить раньше нормы должности, прежде чем в
              журнале босса появится «Опоздание» или «Ранний уход»
            </FieldDescription>
            <FieldError>{toleranceError}</FieldError>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button type="submit" onClick={submit}>
          Сохранить
        </Button>
      </CardFooter>
    </Card>
  )
}

export default SettingsForm
