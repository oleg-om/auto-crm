import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ArrowDown, ArrowUp, ArrowUpDown, Plus, X } from 'lucide-react'
import AccountRow from '../../components/accounts/account'
import AccountForm from '../../components/accounts/account.form'
import { deleteAccount } from '../../redux/reducers/accounts'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import 'react-toastify/dist/ReactToastify.css'
import accountRoleList from '../../lists/account-role-list'
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
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from '../../components/ui/pagination'
import type { IUser } from '../../../common/types/generated/User'
import type { IEmployee } from '../../../common/types/generated/Employee'
import type { IPlace } from '../../../common/types/generated/Place'

const PAGE_SIZE = 20
const ALL_ROLES = 'all'

const getPageNumbers = (current: number, total: number): (number | string)[] => {
  const delta = 1
  const middle: number[] = []
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    middle.push(i)
  }
  const withEdges = [1, ...middle, total].filter(
    (v, i, arr) => arr.indexOf(v) === i && v >= 1 && v <= total
  )
  const result: (number | string)[] = []
  let prev = 0
  withEdges.forEach((v) => {
    if (prev && v - prev > 1) result.push(`ellipsis-${v}`)
    result.push(v)
    prev = v
  })
  return result
}

interface ISortableTableHeadProps {
  sortDirection: 'asc' | 'desc' | null
  onSort: () => void
  className?: string
}

const SortableTableHead = ({ sortDirection, onSort, className }: ISortableTableHeadProps) => {
  const Icon =
    sortDirection === 'asc' ? ArrowUp : sortDirection === 'desc' ? ArrowDown : ArrowUpDown
  return (
    <TableHead className={className}>
      <button
        type="button"
        className="flex items-center gap-1 hover:text-foreground"
        onClick={onSort}
      >
        Логин
        <Icon className={cn('h-3.5 w-3.5', sortDirection ? 'opacity-100' : 'opacity-40')} />
      </button>
    </TableHead>
  )
}

const AccountList = () => {
  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const dispatch = useDispatch<any>()
  const history = useHistory()
  const list = useSelector((s: { accounts: { list: IUser[] } }) => s.accounts.list)
  const employees = useSelector((s: { employees: { list: IEmployee[] } }) => s.employees.list)
  const places = useSelector((s: { places: { list: IPlace[] } }) => s.places.list)

  const formMatch = useRouteMatch<{ id?: string }>({
    path: ['/account/create', '/account/edit/:id'],
    exact: true
  })
  const isCreateMode = formMatch?.path === '/account/create'
  const editingAccount = formMatch?.params.id
    ? list.find((it) => it._id === formMatch.params.id)
    : undefined
  const closeForm = () =>
    history.push({ pathname: '/account/list', state: { preserveScroll: true } })

  const [isOpen, setIsOpen] = useState(false)
  const [itemId, setItemId] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null)

  const toggleSort = () => {
    if (sortDirection === null) {
      setSortDirection('asc')
    } else if (sortDirection === 'asc') {
      setSortDirection('desc')
    } else {
      setSortDirection(null)
    }
  }

  const activeRole = accountRoleList.find(
    (it: { name: string; value: string; color: string }) => it.value === roleFilter
  )

  const filteredList = list.filter((it) => {
    const employee = employees.find((e) => e.id === it.userName)
    const employeeName = employee ? `${employee.name} ${employee.surname ?? ''}`.trim() : ''
    const haystack = `${it.login} ${employeeName}`.toLowerCase()
    const matchesSearch = haystack.includes(search.trim().toLowerCase())
    const matchesRole = !activeRole || (it.role ?? []).includes(activeRole.value)
    return matchesSearch && matchesRole
  })

  const sortedList = [...filteredList].sort((a, b) => {
    if (!sortDirection) return 0
    const comparison = a.login.localeCompare(b.login, 'ru')
    return sortDirection === 'asc' ? comparison : -comparison
  })

  const isSearchActive = search.trim() !== ''
  const isRoleFilterActive = roleFilter !== ''
  const hasActiveFilters = isSearchActive || isRoleFilterActive
  const resetFilters = () => {
    setSearch('')
    setRoleFilter('')
  }

  useEffect(() => {
    setPage(1)
  }, [search, roleFilter])

  const totalPages = Math.max(1, Math.ceil(sortedList.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pagedList = sortedList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const openAndDelete = (id: string) => {
    setIsOpen(true)
    setItemId(id)
  }
  const deleteAccountLocal = (id: string) => {
    dispatch(deleteAccount(id))
    setIsOpen(false)
    notify('Аккаунт удален')
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        <Sidebar />
        <div className="container mx-auto min-w-0 px-4">
          <div className="mb-6 flex items-center justify-between border-b py-4">
            <h1 className="text-3xl">Список аккаунтов</h1>
            <Link to={{ pathname: '/account/create', state: { preserveScroll: true } }}>
              <Button type="button">
                <Plus className="mr-2 h-4 w-4" />
                Новый аккаунт
              </Button>
            </Link>
          </div>
          <Card className="my-3">
            <CardContent className="p-4">
              <div className="-mx-2 md:flex md:justify-between">
                <div className="md:w-1/2 px-2 mb-4 md:mb-0">
                  <Label htmlFor="search" className="block mb-2">
                    Логин или сотрудник
                  </Label>
                  <div className="relative">
                    <Input
                      id="search"
                      value={search}
                      placeholder="Введите логин или имя сотрудника"
                      className={cn(
                        'pr-8',
                        isSearchActive && 'border-primary ring-1 ring-primary/30'
                      )}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    {search ? (
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setSearch('')}
                        aria-label="Очистить"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="md:w-1/2 px-2 mb-4 md:mb-0">
                  <Label htmlFor="roleFilter" className="block mb-2">
                    Доступ
                  </Label>
                  <Select
                    value={roleFilter === '' ? ALL_ROLES : roleFilter}
                    onValueChange={(value) => setRoleFilter(value === ALL_ROLES ? '' : value)}
                  >
                    <SelectTrigger
                      id="roleFilter"
                      className={cn(isRoleFilterActive && 'border-primary text-primary')}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_ROLES}>Все</SelectItem>
                      {accountRoleList.map((it: { name: string; value: string; color: string }) => (
                        <SelectItem key={it.value} value={it.value}>
                          {it.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {hasActiveFilters ? (
                <div className="flex flex-wrap items-center gap-2 -mx-2 px-2 pt-3 mt-3 border-t">
                  <span className="text-sm text-muted-foreground">
                    Найдено: {filteredList.length}
                  </span>
                  {isSearchActive ? (
                    <Badge variant="secondary" className="gap-1 pr-1 font-normal">
                      Поиск: {search.trim()}
                      <button
                        type="button"
                        className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
                        onClick={() => setSearch('')}
                        aria-label="Сбросить поиск"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ) : null}
                  {isRoleFilterActive ? (
                    <Badge variant="secondary" className="gap-1 pr-1 font-normal">
                      Доступ: {activeRole?.name}
                      <button
                        type="button"
                        className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
                        onClick={() => setRoleFilter('')}
                        aria-label="Сбросить фильтр по доступу"
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
            <Table className="sm:min-w-[768px] table-fixed">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <SortableTableHead
                    sortDirection={sortDirection}
                    onSort={toggleSort}
                    className="w-[180px]"
                  />
                  <TableHead className="hidden sm:table-cell w-[200px]">Сотрудник</TableHead>
                  <TableHead className="hidden sm:table-cell w-[180px]">Точка</TableHead>
                  <TableHead className="hidden sm:table-cell w-[280px]">Доступы</TableHead>
                  <TableHead className="w-[96px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedList.map((it) => (
                  <AccountRow
                    key={it._id}
                    employees={employees}
                    places={places}
                    deleteAccount={openAndDelete}
                    {...it}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 ? (
            <Pagination className="my-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    disabled={currentPage === 1}
                    onClick={() => setPage(Math.max(1, currentPage - 1))}
                  />
                </PaginationItem>
                {getPageNumbers(currentPage, totalPages).map((it) =>
                  typeof it === 'number' ? (
                    <PaginationItem key={it}>
                      <PaginationButton isActive={it === currentPage} onClick={() => setPage(it)}>
                        {it}
                      </PaginationButton>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={it}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    disabled={currentPage === totalPages}
                    onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </div>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить аккаунт?</AlertDialogTitle>
              <AlertDialogDescription>
                Удалив запись вы не сможете ее восстановить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteAccountLocal(itemId)}>
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Dialog open={!!formMatch} onOpenChange={(open) => (!open ? closeForm() : undefined)}>
        <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="shrink-0 border-b px-6 py-4">
            <DialogTitle>{isCreateMode ? 'Новый аккаунт' : 'Редактировать аккаунт'}</DialogTitle>
          </DialogHeader>
          {isCreateMode ? (
            <AccountForm key="create" mode="create" onSaved={closeForm} onCancel={closeForm} />
          ) : editingAccount ? (
            <AccountForm
              key={editingAccount._id}
              mode="edit"
              account={editingAccount}
              onSaved={closeForm}
              onCancel={closeForm}
            />
          ) : formMatch ? (
            <p className="px-6 py-6 text-center text-sm text-muted-foreground">Аккаунт не найден</p>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AccountList
