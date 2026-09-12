import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { toast } from 'react-toastify'
import NumberFormat from 'react-number-format'
import { Plus, X } from 'lucide-react'
import CustomerRow from '../../components/customers/customer'
import CustomerForm from '../../components/customers/customer.form'
import { deleteCustomer, getItemsFiltered } from '../../redux/reducers/customers'
import { getOrganizations } from '../../redux/reducers/organizations'
import Navbar from '../../components/Navbar'
import 'react-toastify/dist/ReactToastify.css'
import { Card, CardContent } from '../../components/ui/card'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../../components/ui/alert-dialog'
import { cn } from '../../lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import PaginationBar from '../../components/shared/pagination-bar'
import { DEFAULT_PAGE_SIZE_OPTIONS } from '../../hooks/use-pagination'
import type { ICustomer } from '../../../common/types/generated/Customer'
import type { IOrganization } from '../../../common/types/generated/Organization'

const ALL_ORGANIZATIONS = 'all'

const onChangeUppercaseRussian = (value: string) =>
  value
    .toUpperCase()
    .replace(/\s/g, '')
    .replace(/[^а-яё0-9]/i, '')

// A masked react-number-format value pads untyped digits with "_" (e.g.
// "+7 (978) 5__-__-__"). Only used to clean up the read-only filter chip
// below - the server does the real work of stripping this before searching
// (see stripPhoneMask in server/controller/customer.controller.js).
const displayPhone = (value: string) => value.split('_')[0].trim()

// The list is server-paginated over ~170k rows, so filters/page live in the
// URL (not just component state) - viewing a customer's order history
// navigates to a different route entirely (unlike the create/edit dialog,
// which stays on this same component), unmounting this component and
// discarding its state. Restoring from the URL on remount is what lets the
// browser back button and the view page's "К списку клиентов" link return
// to the same filtered/paginated list instead of a reset one.
const buildListSearch = (params: {
  phone: string
  regnumber: string
  organizationId: string
  page: number
  pageSize: number
}) => {
  const qs = new URLSearchParams()
  if (params.phone.trim()) qs.set('phone', params.phone)
  if (params.regnumber.trim()) qs.set('regnumber', params.regnumber)
  if (params.organizationId) qs.set('organization', params.organizationId)
  if (params.page !== 1) qs.set('page', String(params.page))
  if (params.pageSize !== DEFAULT_PAGE_SIZE_OPTIONS[1]) qs.set('pageSize', String(params.pageSize))
  const str = qs.toString()
  return str ? `?${str}` : ''
}

const CustomerList = () => {
  const dispatch = useDispatch<any>()
  const history = useHistory()
  const location = useLocation()
  const initialParams = useRef(new URLSearchParams(location.search)).current
  const list = useSelector(
    (s: { customers: { list: Array<ICustomer & { createdAt?: string }> } }) => s.customers.list
  )
  const total = useSelector((s: { customers: { total?: number } }) => s.customers.total)
  const isLoaded = useSelector((s: { customers: { isLoaded?: boolean } }) => s.customers.isLoaded)
  const organizations = useSelector(
    (s: { organizations: { list: IOrganization[] } }) => s.organizations.list
  )

  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  useEffect(() => {
    dispatch(getOrganizations())
  }, [dispatch])

  // Needed above the URL-sync effect below, which must not touch the address
  // bar while a create/edit dialog is open on top of this same component
  // (those routes render this component too - see the comment on
  // buildListSearch) - otherwise it would immediately replace e.g.
  // "/customer/create" with "/customer/list", closing the dialog it just opened.
  const formMatch = useRouteMatch<{ id?: string }>({
    path: ['/customer/create', '/customer/edit/:id'],
    exact: true
  })

  const [phone, setPhone] = useState(() => initialParams.get('phone') || '')
  const [regnumber, setRegnumber] = useState(() => initialParams.get('regnumber') || '')
  const [organizationId, setOrganizationId] = useState(
    () => initialParams.get('organization') || ''
  )

  // Debounced so typing doesn't fire a request against ~170k rows per
  // keystroke. Seeded from the same restored values (not '') so a restored
  // filter fetches the right data immediately instead of the unfiltered
  // list flashing first for the length of one debounce window.
  const [debouncedPhone, setDebouncedPhone] = useState(() => initialParams.get('phone') || '')
  const [debouncedRegnumber, setDebouncedRegnumber] = useState(
    () => initialParams.get('regnumber') || ''
  )
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedPhone(phone), 400)
    return () => clearTimeout(timeout)
  }, [phone])
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedRegnumber(regnumber), 400)
    return () => clearTimeout(timeout)
  }, [regnumber])

  // Not client-side pagination (usePagination assumes the whole list is
  // already loaded) - customers are paginated server-side over ~170k rows,
  // so page/pageSize are just plain UI state and totalPages/total come back
  // from the API response instead of being derived locally.
  const [page, setPage] = useState(() => Number(initialParams.get('page')) || 1)
  const [pageSize, setPageSize] = useState(
    () => Number(initialParams.get('pageSize')) || DEFAULT_PAGE_SIZE_OPTIONS[1]
  )
  const totalPages = useSelector(
    (s: { customers: { numberOfPages?: number } }) => s.customers.numberOfPages ?? 1
  )
  const onPageSizeChange = (size: number) => {
    setPageSize(size)
    setPage(1)
  }

  // Skipped on mount - otherwise a page restored from the URL (e.g. page=3)
  // would get immediately reset to 1 by this same effect right after mount.
  const isFirstFilterRun = useRef(true)
  useEffect(() => {
    if (isFirstFilterRun.current) {
      isFirstFilterRun.current = false
      return
    }
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPhone, debouncedRegnumber, organizationId])

  // Keeps the address bar in sync so the browser back button (or the view
  // page's "К списку клиентов" link, which just calls history.goBack())
  // returns to this exact filtered/paginated state after this component has
  // unmounted and remounted - see buildListSearch's comment above. Skipped
  // while a create/edit dialog is open (see the comment on formMatch).
  useEffect(() => {
    if (formMatch) return
    history.replace({
      pathname: '/customer/list',
      search: buildListSearch({
        phone: debouncedPhone,
        regnumber: debouncedRegnumber,
        organizationId,
        page,
        pageSize
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formMatch, debouncedPhone, debouncedRegnumber, organizationId, page, pageSize])

  useEffect(() => {
    dispatch(
      getItemsFiltered({
        page,
        limit: pageSize,
        phone: debouncedPhone.trim() ? debouncedPhone : undefined,
        reg: debouncedRegnumber.trim() ? debouncedRegnumber : undefined,
        organization: organizationId || undefined
      })
    )
  }, [dispatch, page, pageSize, debouncedPhone, debouncedRegnumber, organizationId])

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [itemId, setItemId] = useState('')

  const isCreateMode = formMatch?.path === '/customer/create'
  const editingId = isCreateMode ? undefined : formMatch?.params.id
  // The list only ever holds the current page's slice (customers are
  // paginated server-side - ~170k rows) so an edit needs its own fetch by id
  // rather than looking the customer up in `list`.
  const [editingCustomer, setEditingCustomer] = useState<ICustomer | undefined>(undefined)
  const [isEditingLoading, setIsEditingLoading] = useState(false)
  useEffect(() => {
    if (!editingId) {
      setEditingCustomer(undefined)
      return
    }
    setIsEditingLoading(true)
    fetch(`/api/v1/customer/${editingId}`)
      .then((r) => r.json())
      .then(({ data }) => setEditingCustomer(data))
      .finally(() => setIsEditingLoading(false))
  }, [editingId])
  // Not a bare '/customer/list' push - the create/edit routes have no query
  // string of their own (this component stays mounted for them, so its
  // filter/page state is unaffected, but the address bar would otherwise
  // lose it), so this rebuilds it from the current in-memory state.
  const closeForm = () =>
    history.push({
      pathname: '/customer/list',
      search: buildListSearch({ phone, regnumber, organizationId, page, pageSize })
    })

  const openAndDelete = (id: string) => {
    setIsDeleteOpen(true)
    setItemId(id)
  }
  const deleteCustomerLocal = (id: string) => {
    dispatch(deleteCustomer(id))
    setIsDeleteOpen(false)
    notify('Клиент удален')
  }

  const isPhoneActive = phone.trim() !== ''
  const isRegnumberActive = regnumber.trim() !== ''
  const isOrganizationActive = organizationId !== ''
  const hasActiveFilters = isPhoneActive || isRegnumberActive || isOrganizationActive
  const resetFilters = () => {
    setPhone('')
    setRegnumber('')
    setOrganizationId('')
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto min-w-0 px-4">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b py-4">
          <h1 className="text-3xl">Список клиентов</h1>
          <Link to={{ pathname: '/customer/create', state: { preserveScroll: true } }}>
            <Button type="button">
              <Plus className="mr-2 h-4 w-4" />
              Новый клиент
            </Button>
          </Link>
        </div>

        <Card className="my-3">
          <CardContent className="p-4">
            <div className="-mx-2 md:flex md:justify-between">
              <div className="mb-4 px-2 md:mb-0 md:w-1/3">
                <Label htmlFor="phone" className="mb-2 block">
                  Телефон
                </Label>
                <div className="relative">
                  <NumberFormat
                    id="phone"
                    format="+7 (###) ###-##-##"
                    mask="_"
                    customInput={Input}
                    value={phone}
                    placeholder="Введите телефон"
                    className={cn('pr-8', isPhoneActive && 'border-primary ring-1 ring-primary/30')}
                    onValueChange={(values) => setPhone(values.formattedValue)}
                  />
                  {phone ? (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground hover:text-foreground"
                      onClick={() => setPhone('')}
                      aria-label="Очистить"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="mb-4 px-2 md:mb-0 md:w-1/3">
                <Label htmlFor="regnumber" className="mb-2 block">
                  Гос. номер
                </Label>
                <div className="relative">
                  <Input
                    id="regnumber"
                    value={regnumber}
                    placeholder="Введите гос. номер"
                    className={cn(
                      'pr-8',
                      isRegnumberActive && 'border-primary ring-1 ring-primary/30'
                    )}
                    onChange={(e) => setRegnumber(onChangeUppercaseRussian(e.target.value))}
                  />
                  {regnumber ? (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground hover:text-foreground"
                      onClick={() => setRegnumber('')}
                      aria-label="Очистить"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="mb-4 px-2 md:mb-0 md:w-1/3">
                <Label htmlFor="organizationId" className="mb-2 block">
                  Организация
                </Label>
                <Select
                  value={organizationId === '' ? ALL_ORGANIZATIONS : organizationId}
                  onValueChange={(value) =>
                    setOrganizationId(value === ALL_ORGANIZATIONS ? '' : value)
                  }
                >
                  <SelectTrigger
                    id="organizationId"
                    className={cn(isOrganizationActive && 'border-primary text-primary')}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_ORGANIZATIONS}>Все</SelectItem>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id as string}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {hasActiveFilters ? (
              <div className="-mx-2 mt-3 flex flex-wrap items-center gap-2 border-t px-2 pt-3">
                <span className="text-sm text-muted-foreground">Найдено: {total ?? 0}</span>
                {isPhoneActive ? (
                  <Badge variant="secondary" className="gap-1 pr-1 font-normal">
                    Телефон: {displayPhone(phone)}
                    <button
                      type="button"
                      className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
                      onClick={() => setPhone('')}
                      aria-label="Сбросить фильтр по телефону"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ) : null}
                {isRegnumberActive ? (
                  <Badge variant="secondary" className="gap-1 pr-1 font-normal">
                    Гос. номер: {regnumber}
                    <button
                      type="button"
                      className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
                      onClick={() => setRegnumber('')}
                      aria-label="Сбросить фильтр по гос. номеру"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ) : null}
                {isOrganizationActive ? (
                  <Badge variant="secondary" className="gap-1 pr-1 font-normal">
                    Организация: {organizations.find((org) => org.id === organizationId)?.name}
                    <button
                      type="button"
                      className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
                      onClick={() => setOrganizationId('')}
                      aria-label="Сбросить фильтр по организации"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ) : null}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-muted-foreground"
                  onClick={resetFilters}
                >
                  Сбросить всё
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="overflow-x-auto rounded-lg relative lg:my-3 mt-1 lg:shadow">
          <Table className="min-w-[760px] table-fixed">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[220px]">Имя</TableHead>
                <TableHead className="w-[180px]">Телефон</TableHead>
                <TableHead>Авто</TableHead>
                <TableHead className="hidden w-[130px] sm:table-cell">Дата создания</TableHead>
                <TableHead className="w-[120px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list && list.length > 0
                ? list.map((it) => (
                    <CustomerRow key={it.id} deleteCustomer={openAndDelete} {...it} />
                  ))
                : null}
            </TableBody>
          </Table>
          {!isLoaded ? (
            <div className="flex w-full items-center justify-center gap-3 bg-white py-6">
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary" />
              <span className="text-sm text-muted-foreground">Загрузка...</span>
            </div>
          ) : null}
          {isLoaded && list && list.length === 0 ? (
            <div className="flex w-full justify-center bg-white py-4">
              <span className="text-sm font-medium text-muted-foreground">
                {hasActiveFilters ? 'Записей не найдено' : 'Клиентов пока нет'}
              </span>
            </div>
          ) : null}
        </div>

        <PaginationBar
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
          totalItems={total ?? 0}
        />
      </div>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить клиента?</AlertDialogTitle>
            <AlertDialogDescription>
              Удалив запись вы не сможете ее восстановить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteCustomerLocal(itemId)}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!formMatch} onOpenChange={(open) => (!open ? closeForm() : undefined)}>
        <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="shrink-0 border-b px-6 py-4">
            <DialogTitle>{isCreateMode ? 'Новый клиент' : 'Редактировать клиента'}</DialogTitle>
          </DialogHeader>
          {isCreateMode ? (
            <CustomerForm key="create" mode="create" onSaved={closeForm} onCancel={closeForm} />
          ) : editingCustomer ? (
            <CustomerForm
              key={editingCustomer.id}
              mode="edit"
              customer={editingCustomer}
              onSaved={closeForm}
              onCancel={closeForm}
            />
          ) : isEditingLoading ? (
            <div className="flex items-center justify-center gap-3 px-6 py-12">
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary" />
              <span className="text-sm text-muted-foreground">Загрузка...</span>
            </div>
          ) : formMatch ? (
            <p className="px-6 py-6 text-center text-sm text-muted-foreground">Клиент не найден</p>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CustomerList
