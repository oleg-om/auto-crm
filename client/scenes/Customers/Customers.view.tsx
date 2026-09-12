import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ArrowLeft, Pencil } from 'lucide-react'
import Navbar from '../../components/Navbar'
import { getOrganizations } from '../../redux/reducers/organizations'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../components/ui/table'
import type { ICustomer } from '../../../common/types/generated/Customer'
import type { IOrganization } from '../../../common/types/generated/Organization'

interface IHistoryRow {
  id?: string
  date?: string
  dateStart?: string
  dateFinish?: string
  mark?: string
  model?: string
  regnumber?: string
  status?: string
  [key: string]: unknown
}

interface IHistoryPayload {
  customer: ICustomer
  history: {
    shinomontazh: IHistoryRow[]
    sto: IHistoryRow[]
    wash: IHistoryRow[]
    window: IHistoryRow[]
    cond: IHistoryRow[]
    autoparts: IHistoryRow[]
    tyres: IHistoryRow[]
    tools: IHistoryRow[]
  }
}

function formatWhen(row: IHistoryRow) {
  const d = row.date || row.dateStart || row.dateFinish
  if (!d) return '—'
  try {
    return new Date(d as string).toLocaleString('ru-RU')
  } catch {
    return String(d)
  }
}

function carLine(row: IHistoryRow) {
  const parts = [row.mark, row.model, row.regnumber ? `[${row.regnumber}]` : ''].filter(Boolean)
  return parts.length ? parts.join(' ') : '—'
}

const PAGE_SIZE = 10

const initialVisible = () => ({
  shinomontazh: PAGE_SIZE,
  sto: PAGE_SIZE,
  wash: PAGE_SIZE,
  window: PAGE_SIZE,
  cond: PAGE_SIZE,
  autoparts: PAGE_SIZE,
  tyres: PAGE_SIZE,
  tools: PAGE_SIZE
})

const CustomerView = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<any>()
  const organizations = useSelector(
    (s: { organizations: { list: IOrganization[] } }) => s.organizations.list
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [payload, setPayload] = useState<IHistoryPayload | null>(null)
  const [visibleBySection, setVisibleBySection] = useState<Record<string, number>>(initialVisible)

  useEffect(() => {
    dispatch(getOrganizations())
  }, [dispatch])

  useEffect(() => {
    setVisibleBySection(initialVisible())
  }, [id])

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`/api/v1/customer/${id}/history`)
      .then((r) => {
        if (!r.ok) throw new Error('Не удалось загрузить данные')
        return r.json()
      })
      .then((json) => {
        if (json.status !== 'ok' || !json.data) throw new Error('Неверный ответ сервера')
        setPayload(json.data)
      })
      .catch((e) => setError(e.message || 'Ошибка загрузки'))
      .finally(() => setLoading(false))
  }, [id])

  const history = payload?.history
  const customer = payload?.customer

  const blocks = history
    ? [
        {
          key: 'shinomontazh',
          title: 'Шиномонтаж',
          rows: history.shinomontazh,
          talon: (r: IHistoryRow) => r.id_shinomontazhs,
          href: (r: IHistoryRow) => `/shinomontazh/edit/${r.id_shinomontazhs}`
        },
        {
          key: 'sto',
          title: 'СТО',
          rows: history.sto,
          talon: (r: IHistoryRow) => r.id_stos,
          href: (r: IHistoryRow) => `/sto/edit/${r.id_stos}`
        },
        {
          key: 'wash',
          title: 'Автомойка',
          rows: history.wash,
          talon: (r: IHistoryRow) => r.id_washs,
          href: (r: IHistoryRow) => `/wash/edit/${r.id_washs}`
        },
        {
          key: 'window',
          title: 'Стекла',
          rows: history.window,
          talon: (r: IHistoryRow) => r.id_windows,
          href: (r: IHistoryRow) => `/window/edit/${r.id_windows}`
        },
        {
          key: 'cond',
          title: 'Кондиционеры',
          rows: history.cond,
          talon: (r: IHistoryRow) => r.id_conds,
          href: (r: IHistoryRow) => `/cond/edit/${r.id_conds}`
        },
        {
          key: 'autoparts',
          title: 'Автозапчасти',
          rows: history.autoparts,
          talon: (r: IHistoryRow) => r.id_autoparts,
          href: (r: IHistoryRow) => `/autoparts/view/${r.id_autoparts}`
        },
        {
          key: 'tyres',
          title: 'Шины',
          rows: history.tyres,
          talon: (r: IHistoryRow) => r.id_tyres,
          href: (r: IHistoryRow) => `/tyres/view/${r.id_tyres}`
        },
        {
          key: 'tools',
          title: 'Инструмент',
          rows: history.tools,
          talon: (r: IHistoryRow) => r.id_tools,
          href: (r: IHistoryRow) => `/tools/view/${r.id_tools}`
        }
      ]
    : []

  const showMore = (sectionKey: string) => {
    setVisibleBySection((prev) => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || PAGE_SIZE) + PAGE_SIZE
    }))
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 pb-24">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b py-4">
          <h1 className="text-3xl">Клиент: история заказов</h1>
          <Button asChild variant="outline">
            <Link to="/customer/list">
              <ArrowLeft className="mr-2 h-4 w-4" />К списку клиентов
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-12">
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary" />
            <span className="text-sm text-muted-foreground">Загрузка...</span>
          </div>
        ) : null}
        {error ? (
          <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-destructive">{error}</div>
        ) : null}

        {!loading && customer ? (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="mb-3 text-xl font-semibold">Карточка клиента</h2>
              <div className="grid gap-2 text-gray-800 md:grid-cols-2">
                <p>
                  <span className="text-muted-foreground">Имя: </span>
                  {customer.name || '—'}
                </p>
                <p>
                  <span className="text-muted-foreground">Телефон: </span>
                  {customer.phone || '—'}
                </p>
                <p>
                  <span className="text-muted-foreground">Авто: </span>
                  {[customer.mark, customer.model, customer.mod].filter(Boolean).join(' ') || '—'}
                </p>
                <p>
                  <span className="text-muted-foreground">Госномер: </span>
                  {customer.regnumber || '—'}
                </p>
                <p>
                  <span className="text-muted-foreground">VIN: </span>
                  {customer.vinnumber || '—'}
                </p>
                <p>
                  <span className="text-muted-foreground">Организация: </span>
                  {customer.organizationId
                    ? organizations.find((org) => org.id === customer.organizationId)?.name || '—'
                    : '—'}
                </p>
                <p className="md:col-span-2">
                  <Button asChild variant="outline" size="sm" className="mt-2">
                    <Link
                      to={{
                        pathname: `/customer/edit/${customer.id}`,
                        state: { preserveScroll: true }
                      }}
                    >
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Редактировать клиента
                    </Link>
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {!loading && !error && history
          ? blocks.map((section) => {
              const rows = section.rows || []
              const total = rows.length
              const visibleLimit = visibleBySection[section.key] ?? PAGE_SIZE
              const displayedRows = rows.slice(0, visibleLimit)
              const hasMore = total > visibleLimit

              return (
                <div key={section.key} className="mb-10">
                  <h2 className="mb-3 border-b pb-2 text-xl font-semibold">{section.title}</h2>
                  {total > 0 ? (
                    <>
                      <div className="overflow-x-auto rounded-lg lg:shadow">
                        <Table className="min-w-[560px] table-fixed">
                          <TableHeader>
                            <TableRow className="hover:bg-transparent">
                              <TableHead className="w-[160px]">Дата</TableHead>
                              <TableHead className="w-[100px]">№</TableHead>
                              <TableHead>Авто</TableHead>
                              <TableHead className="w-[140px]">Статус</TableHead>
                              <TableHead className="w-[100px]">Действие</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {displayedRows.map((row) => (
                              <TableRow key={row.id} className="bg-white">
                                <TableCell className="whitespace-nowrap">
                                  {formatWhen(row)}
                                </TableCell>
                                <TableCell>
                                  {section.talon(row) != null ? String(section.talon(row)) : '—'}
                                </TableCell>
                                <TableCell className="truncate">{carLine(row)}</TableCell>
                                <TableCell>{row.status || '—'}</TableCell>
                                <TableCell className="whitespace-nowrap">
                                  <Link
                                    to={section.href(row)}
                                    className="text-primary hover:underline"
                                  >
                                    Открыть
                                  </Link>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      {hasMore ? (
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => showMore(section.key)}
                          >
                            Показать ещё
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            Показано {displayedRows.length} из {total}
                          </span>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <p className="text-muted-foreground">Нет записей в этом разделе.</p>
                  )}
                </div>
              )
            })
          : null}
      </div>
    </div>
  )
}

export default CustomerView
