import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { changePassword } from '../redux/reducers/auth'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { Button } from './ui/button'
import 'react-toastify/dist/ReactToastify.css'

interface IAccountSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const emptyFields = { currentPassword: '', newPassword: '', confirmPassword: '' }

const AccountSettingsDialog = ({ open, onOpenChange }: IAccountSettingsDialogProps) => {
  const dispatch = useDispatch<any>()
  const login = useSelector((s: { auth: { user: { login?: string } } }) => s.auth.user.login)

  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const [fields, setFields] = useState(emptyFields)
  const [error, setError] = useState('')

  const closeAndReset = () => {
    setFields(emptyFields)
    setError('')
    onOpenChange(false)
  }

  const submit = () => {
    if (!fields.currentPassword || !fields.newPassword || !fields.confirmPassword) {
      setError('Заполните все поля')
      return
    }
    if (fields.newPassword !== fields.confirmPassword) {
      setError('Новые пароли не совпадают')
      return
    }
    dispatch(changePassword(fields.currentPassword, fields.newPassword)).then(
      (data: { status: string; message?: string }) => {
        if (data.status === 'ok') {
          notify('Пароль изменен')
          closeAndReset()
        } else {
          setError(data.message || 'Не удалось изменить пароль')
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (!next ? closeAndReset() : undefined)}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Настройки аккаунта</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="accountLogin">Логин</FieldLabel>
            <Input id="accountLogin" value={login ?? ''} readOnly disabled />
          </Field>
          <Field data-invalid={!!error}>
            <FieldLabel htmlFor="currentPassword">Текущий пароль</FieldLabel>
            <Input
              id="currentPassword"
              type="password"
              value={fields.currentPassword}
              aria-invalid={!!error}
              onChange={(e) => {
                setFields((prev) => ({ ...prev, currentPassword: e.target.value }))
                setError('')
              }}
            />
          </Field>
          <Field data-invalid={!!error}>
            <FieldLabel htmlFor="newPassword">Новый пароль</FieldLabel>
            <Input
              id="newPassword"
              type="password"
              value={fields.newPassword}
              aria-invalid={!!error}
              onChange={(e) => {
                setFields((prev) => ({ ...prev, newPassword: e.target.value }))
                setError('')
              }}
            />
          </Field>
          <Field data-invalid={!!error}>
            <FieldLabel htmlFor="confirmPassword">Повторите новый пароль</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              value={fields.confirmPassword}
              aria-invalid={!!error}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  submit()
                }
              }}
              onChange={(e) => {
                setFields((prev) => ({ ...prev, confirmPassword: e.target.value }))
                setError('')
              }}
            />
            <FieldError>{error}</FieldError>
          </Field>
        </FieldGroup>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={closeAndReset}>
            Отмена
          </Button>
          <Button type="button" onClick={submit}>
            Сохранить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AccountSettingsDialog
