import React, { useState } from 'react'
import { toast } from 'react-toastify'
import NumberFormat from 'react-number-format'
import 'react-toastify/dist/ReactToastify.css'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Field, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import type { ISettings } from '../../../common/types/generated/Settings'

interface IFormState {
  helpphone: string
  lastKerchshina: string
}

const toFormState = (settings?: ISettings): IFormState => ({
  helpphone: settings?.helpphone ?? '',
  lastKerchshina: settings?.lastKerchshina ?? ''
})

interface ISettingsFormProps {
  settings?: ISettings
  onSave: (data: IFormState) => void
}

const SettingsForm = ({ settings, onSave }: ISettingsFormProps) => {
  const [state, setState] = useState<IFormState>(() => toFormState(settings))

  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState((prev) => ({ ...prev, [name]: value }))
  }

  const submit = () => {
    onSave(state)
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
