import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import 'react-toastify/dist/ReactToastify.css'
import LoadExample from './load-example'
import stoTypeList from '../../lists/sto-type-list'
import stoPriceFieldList from '../../lists/sto-price-field-list'
import { importStoprice, deleteStopriceDb, getStoprices } from '../../redux/reducers/sto.prices'
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

const PRICE_FIELDS_BY_TYPE = stoPriceFieldList as Record<string, { key: string; label: string }[]>

type ILoadState = '' | 'loading' | 'error' | 'finish'

interface IStopriceImportProps {
  onSaved: () => void
  onCancel: () => void
}

const StopriceImport = ({ onSaved, onCancel }: IStopriceImportProps) => {
  const dispatch = useDispatch<any>()

  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

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
    if (loadingData === undefined) {
      notify('Загрузите файл')
      return
    }
    dispatch(importStoprice(loadingData))
    notify('Услуги добавлены')
    dispatch(getStoprices())
    onSaved()
  }

  const deleteData = () => {
    dispatch(deleteStopriceDb())
    notify('Услуги удалены')
    dispatch(getStoprices())
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
            <FieldLabel htmlFor="stoprice-file">Загрузите файл Xls или Xlsx</FieldLabel>
            <Input
              id="stoprice-file"
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
                {stoTypeList
                  .map((it: { name: string; value: string }) => `${it.value} (${it.name})`)
                  .join(', ')}
              </li>
              <li>
                <b className="text-foreground">category</b> — категория (из справочника СТО)
              </li>
              <li>
                <b className="text-foreground">number</b> — порядковый номер
              </li>
              <li>
                <b className="text-foreground">free</b> — акционная позиция либо нет: yes, no
              </li>
              <li>
                Столбец цены заполняется только для той группы, что соответствует{' '}
                <b className="text-foreground">type</b>, остальные оставляем пустыми:
                <ul className="ml-4 mt-1 list-[circle] space-y-1">
                  {Object.entries(PRICE_FIELDS_BY_TYPE).map(([type, fields]) => (
                    <li key={type}>
                      <b className="text-foreground">{type}</b> —{' '}
                      {fields.map((f) => f.key).join(', ')}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
            <FieldDescription>
              В таблице все указанные значения (кроме name, category) пишем английскими буквами без
              пробелов, маленькими буквами.{' '}
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

export default StopriceImport
