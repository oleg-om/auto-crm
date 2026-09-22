import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import { fromExcelRows } from '../../lib/price-excel'
import { stoExcelConfig } from '../../lib/price-excel-configs'
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
const TYPE_NAMES = Object.fromEntries(
  (stoTypeList as { name: string; value: string }[]).map((it) => [it.value, it.name])
)

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
        resolve(fromExcelRows(data, stoExcelConfig))
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
                <b className="text-foreground">Название</b> — наименование услуги
              </li>
              <li>
                <b className="text-foreground">Направление</b> — одно из:{' '}
                {stoTypeList.map((it: { name: string; value: string }) => it.name).join(', ')}
              </li>
              <li>
                <b className="text-foreground">Категория</b> — категория из справочника СТО
              </li>
              <li>
                <b className="text-foreground">Порядковый номер</b> — порядковый номер
              </li>
              <li>
                <b className="text-foreground">Акция</b> — акционная позиция либо нет: Да, Нет
              </li>
              <li>
                <b className="text-foreground">Время, мин</b> — минимальное время выполнения услуги
                в минутах (необязательно). Если указано, завершить работу можно не раньше, чем
                пройдёт это время. Для услуг без времени ожидания нет
              </li>
              <li>
                Столбец цены заполняется только для той группы, что соответствует{' '}
                <b className="text-foreground">направлению</b>, остальные оставляем пустыми:
                <ul className="ml-4 mt-1 list-[circle] space-y-1">
                  {Object.entries(PRICE_FIELDS_BY_TYPE).map(([type, fields]) => (
                    <li key={type}>
                      <b className="text-foreground">{TYPE_NAMES[type] ?? type}</b> —{' '}
                      {fields.map((f) => f.label).join(', ')}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
            <FieldDescription>
              Названия столбцов и значения пишем по-русски, как в скачанном прайсе — проще всего
              скачать текущий прайс и отредактировать его. Прежние английские названия столбцов и
              значений (name, type, legk, yes/no) тоже принимаются.
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
