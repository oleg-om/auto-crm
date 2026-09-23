import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateLogin, updatePassword, signIn } from '../../redux/reducers/auth'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'

interface IAuthState {
  login: string
  password: string
  status?: string
  message?: string
}

const ERROR_MESSAGES: Record<string, string> = {
  'auth error Error: No Login': 'Такого пользователя не существует',
  'auth error Error: No Password': 'Введите пароль',
  'auth error Error: No User': 'Ошибка',
  'auth error Error: Password Incorrect': 'Неправильный пароль'
}

const LoginForm = () => {
  const dispatch = useDispatch()
  const { login, password, message, status } = useSelector((s: { auth: IAuthState }) => s.auth)
  const error = status === 'error' ? ERROR_MESSAGES[message ?? ''] ?? 'Ошибка' : ''

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(signIn())
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted px-4 py-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Вход в систему</CardTitle>
          <CardDescription>Введите логин и пароль, чтобы продолжить</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} noValidate>
            <FieldGroup className="gap-5">
              <Field data-invalid={!!error || undefined}>
                <FieldLabel htmlFor="login">Логин</FieldLabel>
                <Input
                  id="login"
                  name="login"
                  autoComplete="username"
                  autoFocus
                  value={login}
                  aria-invalid={!!error || undefined}
                  onChange={(e) => dispatch(updateLogin(e.target.value))}
                />
              </Field>
              <Field data-invalid={!!error || undefined}>
                <FieldLabel htmlFor="password">Пароль</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  aria-invalid={!!error || undefined}
                  onChange={(e) => dispatch(updatePassword(e.target.value))}
                />
                {error && <FieldError>{error}</FieldError>}
              </Field>
              <Button type="submit" className="w-full">
                Войти
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginForm
