import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'

function formatWhen(row) {
  const d = row.date || row.dateStart || row.dateFinish
  if (!d) return '—'
  try {
    return new Date(d).toLocaleString('ru-RU')
  } catch {
    return String(d)
  }
}

function carLine(row) {
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
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [payload, setPayload] = useState(null)
  const [visibleBySection, setVisibleBySection] = useState(initialVisible)

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

  const loadingBlock = (
    <div className="flex w-100 justify-center my-3">
      <button
        type="button"
        className="bg-main-500 p-3 text-white rounded flex items-center"
        disabled
      >
        <div className="flex justify-center items-center pr-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-4 border-white" />
        </div>
        Загрузка...
      </button>
    </div>
  )

  const history = payload?.history
  const customer = payload?.customer

  const blocks = history
    ? [
        {
          key: 'shinomontazh',
          title: 'Шиномонтаж',
          rows: history.shinomontazh,
          talon: (r) => r.id_shinomontazhs,
          href: (r) => `/shinomontazh/edit/${r.id_shinomontazhs}`
        },
        {
          key: 'sto',
          title: 'СТО',
          rows: history.sto,
          talon: (r) => r.id_stos,
          href: (r) => `/sto/edit/${r.id_stos}`
        },
        {
          key: 'wash',
          title: 'Автомойка',
          rows: history.wash,
          talon: (r) => r.id_washs,
          href: (r) => `/wash/edit/${r.id_washs}`
        },
        {
          key: 'window',
          title: 'Стекла',
          rows: history.window,
          talon: (r) => r.id_windows,
          href: (r) => `/window/edit/${r.id_windows}`
        },
        {
          key: 'cond',
          title: 'Кондиционеры',
          rows: history.cond,
          talon: (r) => r.id_conds,
          href: (r) => `/cond/edit/${r.id_conds}`
        },
        {
          key: 'autoparts',
          title: 'Автозапчасти',
          rows: history.autoparts,
          talon: (r) => r.id_autoparts,
          href: (r) => `/autoparts/view/${r.id_autoparts}`
        },
        {
          key: 'tyres',
          title: 'Шины',
          rows: history.tyres,
          talon: (r) => r.id_tyres,
          href: (r) => `/tyres/view/${r.id_tyres}`
        },
        {
          key: 'tools',
          title: 'Инструмент',
          rows: history.tools,
          talon: (r) => r.id_tools,
          href: (r) => `/tools/view/${r.id_tools}`
        }
      ]
    : []

  const showMore = (sectionKey) => {
    setVisibleBySection((prev) => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || PAGE_SIZE) + PAGE_SIZE
    }))
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 pb-24">
        <div className="flex flex-wrap items-center justify-between gap-3 py-4 border-b mb-6">
          <h1 className="text-3xl">Клиент: история заказов</h1>
          <Link
            to="/customer/list"
            className="text-main-600 hover:text-main-800 border border-main-500 rounded px-4 py-2 text-sm"
          >
            ← К списку клиентов
          </Link>
        </div>

        {loading ? loadingBlock : null}
        {error ? (
          <div className="bg-red-50 text-red-800 p-4 rounded mb-4">{error}</div>
        ) : null}

        {!loading && customer ? (
          <div className="bg-white shadow rounded-lg px-6 py-5 mb-8">
            <h2 className="text-xl font-semibold mb-3">Карточка клиента</h2>
            <div className="grid md:grid-cols-2 gap-2 text-gray-800">
              <p>
                <span className="text-gray-500">Имя: </span>
                {customer.name || '—'}
              </p>
              <p>
                <span className="text-gray-500">Телефон: </span>
                {customer.phone || '—'}
              </p>
              <p>
                <span className="text-gray-500">Авто: </span>
                {[customer.mark, customer.model, customer.mod].filter(Boolean).join(' ') || '—'}
              </p>
              <p>
                <span className="text-gray-500">Госномер: </span>
                {customer.regnumber || '—'}
              </p>
              <p>
                <span className="text-gray-500">VIN: </span>
                {customer.vinnumber || '—'}
              </p>
              <p className="md:col-span-2">
                <Link
                  to={`/customer/edit/${customer.id}`}
                  className="inline-block mt-2 px-4 py-2 text-sm border border-main-500 text-main-600 rounded hover:bg-main-50"
                >
                  Редактировать клиента
                </Link>
              </p>
            </div>
          </div>
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
                  <h2 className="text-xl font-semibold mb-3 border-b pb-2">{section.title}</h2>
                  {total > 0 ? (
                    <>
                      <div className="overflow-x-auto rounded-lg shadow">
                        <table className="border-collapse w-full text-sm">
                          <thead>
                            <tr>
                              <th className="p-2 text-left bg-gray-100 border border-gray-200">
                                Дата
                              </th>
                              <th className="p-2 text-left bg-gray-100 border border-gray-200">№</th>
                              <th className="p-2 text-left bg-gray-100 border border-gray-200">Авто</th>
                              <th className="p-2 text-left bg-gray-100 border border-gray-200">
                                Статус
                              </th>
                              <th className="p-2 text-left bg-gray-100 border border-gray-200">
                                Действие
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {displayedRows.map((row) => (
                              <tr key={row.id} className="bg-white hover:bg-gray-50">
                                <td className="p-2 border border-gray-200 whitespace-nowrap">
                                  {formatWhen(row)}
                                </td>
                                <td className="p-2 border border-gray-200">
                                  {section.talon(row) != null ? section.talon(row) : '—'}
                                </td>
                                <td className="p-2 border border-gray-200">{carLine(row)}</td>
                                <td className="p-2 border border-gray-200">{row.status || '—'}</td>
                                <td className="p-2 border border-gray-200 whitespace-nowrap">
                                  <Link
                                    to={section.href(row)}
                                    className="text-main-600 hover:underline"
                                  >
                                    Открыть
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {hasMore ? (
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => showMore(section.key)}
                            className="px-4 py-2 text-sm border border-main-500 text-main-600 rounded hover:bg-main-50"
                          >
                            Показать ещё
                          </button>
                          <span className="text-sm text-gray-500">
                            Показано {displayedRows.length} из {total}
                          </span>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <p className="text-gray-500">Нет записей в этом разделе.</p>
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
