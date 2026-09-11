import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ArrowDown, ArrowUp, ArrowUpDown, Plus, X } from 'lucide-react'
import OrganizationRow from '../../components/organizations/organization'
import OrganizationForm from '../../components/organizations/organization.form'
import { deleteOrganization, getOrganizations } from '../../redux/reducers/organizations'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import 'react-toastify/dist/ReactToastify.css'
import PaginationBar from '../../components/shared/pagination-bar'
import { usePagination } from '../../hooks/use-pagination'
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
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import type { IOrganization } from '../../../common/types/generated/Organization'

const isBossOrAdmin = (roles: string[]) => roles.includes('boss') || roles.includes('admin')

type ISortField = 'name'

interface ISortableTableHeadProps {
  field: ISortField
  label: string
  sortField: ISortField | null
  sortDirection: 'asc' | 'desc'
  onSort: (field: ISortField) => void
  className?: string
}

const SortableTableHead = ({
  field,
  label,
  sortField,
  sortDirection,
  onSort,
  className
}: ISortableTableHeadProps) => {
  const isActive = sortField === field
  const Icon = isActive ? (sortDirection === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown
  return (
    <TableHead className={className}>
      <button
        type="button"
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => onSort(field)}
      >
        {label}
        <Icon className={cn('h-3.5 w-3.5', isActive ? 'opacity-100' : 'opacity-40')} />
      </button>
    </TableHead>
  )
}

const OrganizationList = () => {
  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const dispatch = useDispatch<any>()
  const history = useHistory()
  const list = useSelector(
    (s: { organizations: { list: IOrganization[] } }) => s.organizations.list
  )
  const auth = useSelector((s: { auth: { roles: string[] } }) => s.auth)

  React.useEffect(() => {
    dispatch(getOrganizations())
  }, [dispatch])

  const formMatch = useRouteMatch<{ id?: string }>({
    path: ['/organization/create', '/organization/edit/:id'],
    exact: true
  })
  const isCreateMode = formMatch?.path === '/organization/create'
  const editingOrganization = formMatch?.params.id
    ? list.find((it) => it.id === formMatch.params.id)
    : undefined
  const closeForm = () =>
    history.push({ pathname: '/organization/list', state: { preserveScroll: true } })

  const [isOpen, setIsOpen] = useState(false)
  const [itemId, setItemId] = useState('')
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<ISortField | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const toggleSort = (field: ISortField) => {
    if (sortField !== field) {
      setSortField(field)
      setSortDirection('asc')
      return
    }
    if (sortDirection === 'asc') {
      setSortDirection('desc')
      return
    }
    setSortField(null)
  }

  const filteredList = list.filter((it) =>
    it.name.toLowerCase().includes(search.trim().toLowerCase())
  )

  const sortedList = [...filteredList].sort((a, b) => {
    if (!sortField) return 0
    const comparison = a.name.localeCompare(b.name, 'ru')
    return sortDirection === 'asc' ? comparison : -comparison
  })

  const isSearchActive = search.trim() !== ''

  const { page, pageSize, setPage, setPageSize, totalPages, pageStart, pageEnd } = usePagination(
    sortedList.length
  )

  React.useEffect(() => {
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const pagedList = sortedList.slice(pageStart, pageEnd)

  const openAndDelete = (id: string) => {
    setIsOpen(true)
    setItemId(id)
  }
  const deleteOrganizationLocal = (id: string) => {
    dispatch(deleteOrganization(id))
    setIsOpen(false)
    notify('Организация удалена')
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        {isBossOrAdmin(auth.roles) ? <Sidebar /> : null}
        <div className="container mx-auto min-w-0 px-4">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b py-4">
            <h1 className="text-3xl">Список организаций</h1>
            <Link to={{ pathname: '/organization/create', state: { preserveScroll: true } }}>
              <Button type="button">
                <Plus className="mr-2 h-4 w-4" />
                Новая организация
              </Button>
            </Link>
          </div>
          <Card className="my-3">
            <CardContent className="p-4">
              <div className="-mx-2 md:flex md:justify-between">
                <div className="md:w-1/2 px-2 mb-4 md:mb-0">
                  <Label htmlFor="search" className="block mb-2">
                    Название
                  </Label>
                  <div className="relative">
                    <Input
                      id="search"
                      value={search}
                      placeholder="Введите название"
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
              </div>
              {isSearchActive ? (
                <div className="flex flex-wrap items-center gap-2 -mx-2 px-2 pt-3 mt-3 border-t">
                  <span className="text-sm text-muted-foreground">
                    Найдено: {filteredList.length}
                  </span>
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
                </div>
              ) : null}
            </CardContent>
          </Card>
          <div className="overflow-x-auto rounded-lg relative lg:my-3 mt-1 lg:shadow">
            <Table className="min-w-[420px] table-fixed">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <SortableTableHead
                    field="name"
                    label="Название"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={toggleSort}
                    className="w-[240px]"
                  />
                  <TableHead className="w-[180px]">Телефон</TableHead>
                  <TableHead className="w-[96px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedList.map((it) => (
                  <OrganizationRow key={it.id} deleteOrganization={openAndDelete} {...it} />
                ))}
              </TableBody>
            </Table>
          </div>
          <PaginationBar
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            totalItems={sortedList.length}
          />
        </div>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить организацию?</AlertDialogTitle>
              <AlertDialogDescription>
                Удалив запись вы не сможете ее восстановить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteOrganizationLocal(itemId)}>
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Dialog open={!!formMatch} onOpenChange={(open) => (!open ? closeForm() : undefined)}>
        <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="shrink-0 border-b px-6 py-4">
            <DialogTitle>
              {isCreateMode ? 'Новая организация' : 'Редактировать организацию'}
            </DialogTitle>
          </DialogHeader>
          {isCreateMode ? (
            <OrganizationForm key="create" mode="create" onSaved={closeForm} onCancel={closeForm} />
          ) : editingOrganization ? (
            <OrganizationForm
              key={editingOrganization.id}
              mode="edit"
              organization={editingOrganization}
              onSaved={closeForm}
              onCancel={closeForm}
            />
          ) : formMatch ? (
            <p className="px-6 py-6 text-center text-sm text-muted-foreground">
              Организация не найдена
            </p>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OrganizationList
