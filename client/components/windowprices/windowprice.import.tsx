import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import LoadExample from './load-example'
import windowTypeList from '../../lists/window-type-list'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '../ui/field'
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

type ILoadState = '' | 'loading' | 'error' | 'finish'

interface IWindowpriceImportProps {
  onImport: (data: Record<string, unknown>[]) => void
  onDeleteAll: () => void
  onCancel: () => void
}

const WindowpriceImport = ({ onImport, onDeleteAll, onCancel }: IWindowpriceImportProps) => {
  const [load, setLoad] = useState<ILoadState>('')
  const [loadingData, setLoadingData] = useState<Record<string, unknown>[] | undefined>(undefined)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const readExcel = (file: File) => {
    const promise = new Promise<Record<string, unknown>[]>((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsArrayBuffer(file)

      fileReader.onload = (e) => {
        setLoad('loading')
        const bufferArray = e.target?.result
        const wb = XLSX.read(bufferArray, { type: 'buffer' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws)
        resolve(data)
      }
      fileReader.onerror = (error) => {
        reject(error)
        setLoad('error')
      }
    })

    promise.then((d) => {
      setLoadingData(d)
      setLoad('finish')
    })
  }

  const sendData = () => {
    if (loadingData === undefined) return
    onImport(loadingData)
  }

  const deleteData = () => {
    onDeleteAll()
    setIsDeleteOpen(false)
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-4">
        <FieldGroup>
          <Field orientation="horizontal">
            <div className="flex-1">
              <FieldLabel htmlFor="delete-all">Перед загрузкой удалите все услуги</FieldLabel>
              <FieldDescription>
                Импорт добавляет записи, а не заменяет их — если файл содержит обновлённый прайс
                целиком, старые услуги нужно удалить заранее
              </FieldDescription>
            </div>
            <Button
              id="delete-all"
              type="button"
              variant="destructive"
              onClick={() => setIsDeleteOpen(true)}
            >
              Удалить все услуги
            </Button>
          </Field>

          <Field>
            <FieldLabel htmlFor="windowprice-file">Загрузите файл Xls или Xlsx</FieldLabel>
            <Input
              id="windowprice-file"
              type="file"
              accept=".xls,.xlsx"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) readExcel(file)
              }}
            />
            {load === 'loading' ? (
              <FieldDescription>Загрузка...</FieldDescription>
            ) : load === 'error' ? (
              <p className="text-sm text-destructive">Ошибка</p>
            ) : load === 'finish' ? (
              <FieldDescription>
                Файл загружен, обнаружено {loadingData?.length ?? 0} услуг
              </FieldDescription>
            ) : null}
          </Field>

          <Field>
            <FieldLabel>Как должна выглядеть загружаемая таблица</FieldLabel>
            <LoadExample />
          </Field>

          <Field>
            <FieldLabel>Прочтите перед загрузкой прайса</FieldLabel>
            <FieldDescription>Сформируйте таблицу:</FieldDescription>
            <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
              <li>
                <b className="text-foreground">name</b> — наименование услуги
              </li>
              <li>
                <b className="text-foreground">type</b> — направление, один из:{' '}
                {windowTypeList
                  .map((it: { name: string; value: string }) => `${it.value} (${it.name})`)
                  .join(', ')}
              </li>
              <li>
                <b className="text-foreground">category</b> — категория из справочника «Категории»
              </li>
              <li>
                <b className="text-foreground">number</b> — порядковый номер
              </li>
              <li>
                <b className="text-foreground">free</b> — акционная позиция либо нет: yes, no
              </li>
              <li>
                <b className="text-foreground">price</b> — цена услуги
              </li>
            </ul>
            <FieldDescription>
              В таблице все указанные значения (кроме name) пишем английскими буквами без пробелов,
              маленькими буквами.{' '}
              <a
                href="https://cloud.mail.ru/public/e9BR/CmE1RYZe6"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Пример
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </div>

      <div className="flex shrink-0 justify-between border-t px-6 py-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" onClick={sendData}>
          Загрузить
        </Button>
      </div>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить все услуги?</AlertDialogTitle>
            <AlertDialogDescription>
              Удалив записи вы не сможете их восстановить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={deleteData}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default WindowpriceImport
