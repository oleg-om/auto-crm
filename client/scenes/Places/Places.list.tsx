import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ArrowDown, ArrowUp, ArrowUpDown, Plus, X } from 'lucide-react'
import PlaceRow from '../../components/places/place'
import PlaceForm from '../../components/places/place.form'
import { deletePlace, getAllPlaces } from '../../redux/reducers/places'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { parseLegacyDate } from '../../lib/legacy-date'
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
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from '../../components/ui/pagination'
import type { IPlace } from '../../../common/types/generated/Place'

const PAGE_SIZE = 20

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

type ISortField = 'name' | 'date'

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

const ALL_SERVICES = 'all'

const SERVICE_OPTIONS: { value: string; label: string; test: (it: IPlace) => boolean }[] = [
  { value: 'razval', label: 'Развал-схождение', test: (it) => it.razval === 'true' },
  { value: 'oil', label: 'Замена масла', test: (it) => it.oil === 'true' },
  { value: 'shinomontazh', label: 'Шиномонтаж', test: (it) => it.shinomontazh === 'true' },
  { value: 'sto', label: 'СТО', test: (it) => it.sto === 'true' },
  { value: 'wash', label: 'Автомойка', test: (it) => Number(it.washboxes) > 0 }
]

const PlaceList = () => {
  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const dispatch = useDispatch<any>()
  const history = useHistory()
  const list = useSelector((s: { places: { allList: IPlace[] } }) => s.places.allList)

  useEffect(() => {
    dispatch(getAllPlaces())
  }, [dispatch])

  const formMatch = useRouteMatch<{ id?: string }>({
    path: ['/place/create', '/place/edit/:id'],
    exact: true
  })
  const isCreateMode = formMatch?.path === '/place/create'
  const editingPlace = formMatch?.params.id
    ? list.find((it) => it.id === formMatch.params.id)
    : undefined
  const closeForm = () => history.push({ pathname: '/place/list', state: { preserveScroll: true } })

  const [isOpen, setIsOpen] = useState(false)
  const [itemId, setItemId] = useState('')
  const [searchName, setSearchName] = useState('')
  const [serviceFilter, setServiceFilter] = useState('')
  const [activityFilter, setActivityFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState<'name' | 'date' | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const toggleSort = (field: 'name' | 'date') => {
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

  const activeService = SERVICE_OPTIONS.find((it) => it.value === serviceFilter)

  const filteredList = list.filter((it) => {
    const matchesName = it.name.toLowerCase().includes(searchName.trim().toLowerCase())
    const matchesService = !activeService || activeService.test(it)
    const matchesActivity =
      activityFilter === 'all' ||
      (activityFilter === 'active' ? it.active !== false : it.active === false)
    return matchesName && matchesService && matchesActivity
  })

  const sortedList = [...filteredList].sort((a, b) => {
    if (!sortField) return 0
    let comparison = 0
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name, 'ru')
    } else {
      const aTime = parseLegacyDate(a.date)?.getTime() ?? 0
      const bTime = parseLegacyDate(b.date)?.getTime() ?? 0
      comparison = aTime - bTime
    }
    return sortDirection === 'asc' ? comparison : -comparison
  })

  const isSearchNameActive = searchName.trim() !== ''
  const isServiceFilterActive = serviceFilter !== ''
  const isActivityFilterActive = activityFilter !== 'all'
  const hasActiveFilters = isSearchNameActive || isServiceFilterActive || isActivityFilterActive
  const resetFilters = () => {
    setSearchName('')
    setServiceFilter('')
    setActivityFilter('all')
  }

  useEffect(() => {
    setPage(1)
  }, [searchName, serviceFilter, activityFilter])

  const totalPages = Math.max(1, Math.ceil(sortedList.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pagedList = sortedList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const openAndDelete = (id: string) => {
    setIsOpen(true)
    setItemId(id)
  }
  const deletePlaceLocal = (id: string) => {
    dispatch(deletePlace(id))
    setIsOpen(false)
    notify('Адрес удален')
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        <Sidebar />
        <div className="container mx-auto min-w-0 px-4">
          <div className="mb-6 flex items-center justify-between border-b py-4">
            <h1 className="text-3xl">Список адресов</h1>
            <Link to={{ pathname: '/place/create', state: { preserveScroll: true } }}>
              <Button type="button">
                <Plus className="mr-2 h-4 w-4" />
                Новый адрес
              </Button>
            </Link>
          </div>
          <Card className="my-3">
            <CardContent className="p-4">
              <div className="-mx-2 md:flex md:justify-between">
                <div className="md:w-1/3 px-2 mb-4 md:mb-0">
                  <Label htmlFor="searchName" className="block mb-2">
                    Название
                  </Label>
                  <div className="relative">
                    <Input
                      id="searchName"
                      value={searchName}
                      placeholder="Введите название адреса"
                      className={cn(
                        'pr-8',
                        isSearchNameActive && 'border-primary ring-1 ring-primary/30'
                      )}
                      onChange={(e) => setSearchName(e.target.value)}
                    />
                    {searchName ? (
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setSearchName('')}
                        aria-label="Очистить"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="md:w-1/3 px-2 mb-4 md:mb-0">
                  <Label htmlFor="serviceFilter" className="block mb-2">
                    Услуга
                  </Label>
                  <Select
                    value={serviceFilter === '' ? ALL_SERVICES : serviceFilter}
                    onValueChange={(value) => setServiceFilter(value === ALL_SERVICES ? '' : value)}
                  >
                    <SelectTrigger
                      id="serviceFilter"
                      className={cn(isServiceFilterActive && 'border-primary text-primary')}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_SERVICES}>Все</SelectItem>
                      {SERVICE_OPTIONS.map((it) => (
                        <SelectItem key={it.value} value={it.value}>
                          {it.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:w-1/3 px-2 mb-4 md:mb-0">
                  <Label htmlFor="activityFilter" className="block mb-2">
                    Активность
                  </Label>
                  <Select
                    value={activityFilter}
                    onValueChange={(value) =>
                      setActivityFilter(value as 'all' | 'active' | 'inactive')
                    }
                  >
                    <SelectTrigger
                      id="activityFilter"
                      className={cn(isActivityFilterActive && 'border-primary text-primary')}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      <SelectItem value="active">Активные</SelectItem>
                      <SelectItem value="inactive">Неактивные</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {hasActiveFilters ? (
                <div className="flex flex-wrap items-center gap-2 -mx-2 px-2 pt-3 mt-3 border-t">
                  <span className="text-sm text-muted-foreground">
                    Найдено: {filteredList.length}
                  </span>
                  {isSearchNameActive ? (
                    <Badge variant="secondary" className="gap-1 pr-1 font-normal">
                      Название: {searchName.trim()}
                      <button
                        type="button"
                        className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
                        onClick={() => setSearchName('')}
                        aria-label="Сбросить фильтр по названию"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ) : null}
                  {isServiceFilterActive ? (
                    <Badge variant="secondary" className="gap-1 pr-1 font-normal">
                      Услуга: {activeService?.label}
                      <button
                        type="button"
                        className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
                        onClick={() => setServiceFilter('')}
                        aria-label="Сбросить фильтр по услуге"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ) : null}
                  {isActivityFilterActive ? (
                    <Badge variant="secondary" className="gap-1 pr-1 font-normal">
                      {activityFilter === 'active' ? 'Только активные' : 'Только неактивные'}
                      <button
                        type="button"
                        className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
                        onClick={() => setActivityFilter('all')}
                        aria-label="Сбросить фильтр по активности"
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
                    field="name"
                    label="Название"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={toggleSort}
                    className="w-[220px]"
                  />
                  <TableHead className="hidden sm:table-cell w-[280px]">Услуги</TableHead>
                  <TableHead className="hidden sm:table-cell w-[120px]">Режим работы</TableHead>
                  <SortableTableHead
                    field="date"
                    label="Дата создания"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={toggleSort}
                    className="hidden sm:table-cell w-[140px]"
                  />
                  <TableHead className="w-[96px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedList.map((it) => (
                  <PlaceRow key={it.id} deletePlace={openAndDelete} {...it} />
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
              <AlertDialogTitle>Удалить адрес?</AlertDialogTitle>
              <AlertDialogDescription>
                Удалив запись вы не сможете ее восстановить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={() => deletePlaceLocal(itemId)}>
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Dialog open={!!formMatch} onOpenChange={(open) => (!open ? closeForm() : undefined)}>
        <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="shrink-0 border-b px-6 py-4">
            <DialogTitle>{isCreateMode ? 'Новый адрес' : 'Редактировать адрес'}</DialogTitle>
          </DialogHeader>
          {isCreateMode ? (
            <PlaceForm key="create" mode="create" onSaved={closeForm} onCancel={closeForm} />
          ) : editingPlace ? (
            <PlaceForm
              key={editingPlace.id}
              mode="edit"
              place={editingPlace}
              onSaved={closeForm}
              onCancel={closeForm}
            />
          ) : formMatch ? (
            <p className="px-6 py-6 text-center text-sm text-muted-foreground">Адрес не найден</p>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PlaceList
