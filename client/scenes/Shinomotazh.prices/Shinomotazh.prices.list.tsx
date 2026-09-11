import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ArrowDown, ArrowUp, ArrowUpDown, Plus, X } from 'lucide-react'
import ShinomontazhpriceRow from '../../components/shinomontazhprices/shinomontazhprice'
import ShinomontazhpriceForm from '../../components/shinomontazhprices/shinomontazhprice.form'
import ShinomontazhpriceImport from '../../components/shinomontazhprices/shinomontazhprice.import'
import ShinomontazhpriceDownloadButton from '../../components/shinomontazhprices/shinomontazhprice.download-button'
import { deleteShinomontazhprice } from '../../redux/reducers/shinomotazh.prices'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import 'react-toastify/dist/ReactToastify.css'
import shinomontazhTypeList from '../../lists/shinomontazhtype-list'
import shinomontazhPriceFieldList from '../../lists/shinomontazh-price-field-list'
import { Card, CardContent } from '../../components/ui/card'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
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
import { Switch } from '../../components/ui/switch'
import PaginationBar from '../../components/shared/pagination-bar'
import { usePagination } from '../../hooks/use-pagination'
import { useShowPrices } from '../../hooks/use-show-prices'
import type { IShinomontazhPrice } from '../../../common/types/generated/ShinomontazhPrice'

const ALL_TYPES = 'all'

const PRICE_FIELDS_BY_TYPE = shinomontazhPriceFieldList as Record<
  string,
  { key: string; label: string }[]
>

type ISortField = 'name' | 'number'

interface ISortableTableHeadProps {
  field: ISortField
  label: string
  sortField: ISortField | null
  sortDirection: 'asc' | 'desc'
  onSort: (field: ISortField) => void
  className?: string
  rowSpan?: number
}

const SortableTableHead = ({
  field,
  label,
  sortField,
  sortDirection,
  onSort,
  className,
  rowSpan
}: ISortableTableHeadProps) => {
  const isActive = sortField === field
  const Icon = isActive ? (sortDirection === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown
  return (
    <TableHead className={className} rowSpan={rowSpan}>
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

const ShinomontazhpriceList = () => {
  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const dispatch = useDispatch<any>()
  const history = useHistory()
  const list = useSelector(
    (s: { shinomontazhprices: { list: IShinomontazhPrice[] } }) => s.shinomontazhprices.list
  )
  const auth = useSelector((s: { auth: { roles: string[] } }) => s.auth)

  const formMatch = useRouteMatch<{ id?: string }>({
    path: ['/shinomontazhprice/create', '/shinomontazhprice/edit/:id'],
    exact: true
  })
  const isCreateMode = formMatch?.path === '/shinomontazhprice/create'
  const editingItem = formMatch?.params.id
    ? list.find((it) => it.id === formMatch.params.id)
    : undefined
  const closeForm = () =>
    history.push({ pathname: '/shinomontazhprice/list', state: { preserveScroll: true } })

  const [createTab, setCreateTab] = useState<'single' | 'import'>('single')
  const [isOpen, setIsOpen] = useState(false)
  const [itemId, setItemId] = useState('')
  const [showPrices, setShowPrices] = useShowPrices()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
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

  const activeType = shinomontazhTypeList.find(
    (it: { name: string; value: string }) => it.value === typeFilter
  )

  // Prices break out into their own columns only once a single Направление is selected -
  // otherwise different rows would need different column sets (e.g. R23 means "R23" for
  // Легковые but "R22,5 (спец шина)" for Грузовой), so mixed-type views fall back to the
  // compact stacked-in-one-cell display (PriceFieldsCell) instead.
  const priceColumnFields =
    showPrices && activeType ? PRICE_FIELDS_BY_TYPE[activeType.value] ?? [] : null

  const filteredList = list.filter((it) => {
    const haystack = `${it.name} ${it.category}`.toLowerCase()
    const matchesSearch = haystack.includes(search.trim().toLowerCase())
    const matchesType = !activeType || it.type === activeType.value
    return matchesSearch && matchesType
  })

  const sortedList = [...filteredList].sort((a, b) => {
    if (!sortField) return 0
    let comparison = 0
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name, 'ru')
    } else {
      comparison = (a.number ?? 0) - (b.number ?? 0)
    }
    return sortDirection === 'asc' ? comparison : -comparison
  })

  const isSearchActive = search.trim() !== ''
  const isTypeFilterActive = typeFilter !== ''
  const hasActiveFilters = isSearchActive || isTypeFilterActive
  const resetFilters = () => {
    setSearch('')
    setTypeFilter('')
  }

  const { page, pageSize, setPage, setPageSize, totalPages, pageStart, pageEnd } = usePagination(
    sortedList.length
  )

  React.useEffect(() => {
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, typeFilter])

  const pagedList = sortedList.slice(pageStart, pageEnd)

  const openAndDelete = (id: string) => {
    setIsOpen(true)
    setItemId(id)
  }
  const deleteItemLocal = (id: string) => {
    dispatch(deleteShinomontazhprice(id))
    setIsOpen(false)
    notify('Услуга удалена')
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        {!auth.roles.includes('bookkeeper') ? <Sidebar /> : null}
        <div className="container mx-auto min-w-0 px-4">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b py-4">
            <h1 className="text-3xl">Шиномонтаж - цены</h1>
            <div className="flex flex-wrap items-center gap-4">
              <label
                htmlFor="showPrices"
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Switch id="showPrices" checked={showPrices} onCheckedChange={setShowPrices} />
                Показывать цены
              </label>
              <div className="flex gap-2">
                <ShinomontazhpriceDownloadButton />
                <Link
                  to={{ pathname: '/shinomontazhprice/create', state: { preserveScroll: true } }}
                >
                  <Button type="button">
                    <Plus className="mr-2 h-4 w-4" />
                    Новая услуга
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <Card className="my-3">
            <CardContent className="p-4">
              <div className="-mx-2 md:flex md:justify-between">
                <div className="md:w-1/2 px-2 mb-4 md:mb-0">
                  <Label htmlFor="search" className="block mb-2">
                    Название или категория
                  </Label>
                  <div className="relative">
                    <Input
                      id="search"
                      value={search}
                      placeholder="Введите название или категорию"
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
                  <Label htmlFor="typeFilter" className="block mb-2">
                    Направление
                  </Label>
                  <Select
                    value={typeFilter === '' ? ALL_TYPES : typeFilter}
                    onValueChange={(value) => setTypeFilter(value === ALL_TYPES ? '' : value)}
                  >
                    <SelectTrigger
                      id="typeFilter"
                      className={cn(isTypeFilterActive && 'border-primary text-primary')}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_TYPES}>Все</SelectItem>
                      {shinomontazhTypeList.map((it: { name: string; value: string }) => (
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
                  {isTypeFilterActive ? (
                    <Badge variant="secondary" className="gap-1 pr-1 font-normal">
                      Направление: {activeType?.name}
                      <button
                        type="button"
                        className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
                        onClick={() => setTypeFilter('')}
                        aria-label="Сбросить фильтр по направлению"
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
            <Table
              className="table-fixed"
              style={{
                minWidth: priceColumnFields
                  ? 780 + priceColumnFields.length * 64
                  : showPrices
                  ? 960
                  : 720
              }}
            >
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <SortableTableHead
                    field="name"
                    label="Название"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={toggleSort}
                    className={cn('w-[240px]', priceColumnFields && 'align-top')}
                    rowSpan={priceColumnFields ? 2 : undefined}
                  />
                  <TableHead
                    className={cn('w-[160px]', priceColumnFields && 'align-top')}
                    rowSpan={priceColumnFields ? 2 : undefined}
                  >
                    Направление
                  </TableHead>
                  <TableHead
                    className={cn('w-[180px]', priceColumnFields && 'align-top')}
                    rowSpan={priceColumnFields ? 2 : undefined}
                  >
                    Категория
                  </TableHead>
                  {priceColumnFields ? (
                    <TableHead colSpan={priceColumnFields.length} className="text-center align-top">
                      Цены
                    </TableHead>
                  ) : showPrices ? (
                    <TableHead className="w-[240px]">Цены</TableHead>
                  ) : null}
                  <SortableTableHead
                    field="number"
                    label="Номер"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={toggleSort}
                    className={cn('w-[100px]', priceColumnFields && 'align-top')}
                    rowSpan={priceColumnFields ? 2 : undefined}
                  />
                  <TableHead
                    className={cn('w-[100px]', priceColumnFields && 'align-top')}
                    rowSpan={priceColumnFields ? 2 : undefined}
                  >
                    Акция
                  </TableHead>
                  <TableHead
                    className={cn('w-[96px]', priceColumnFields && 'align-top')}
                    rowSpan={priceColumnFields ? 2 : undefined}
                  >
                    Действия
                  </TableHead>
                </TableRow>
                {priceColumnFields ? (
                  <TableRow className="hover:bg-transparent">
                    {priceColumnFields.map((field) => (
                      <TableHead
                        key={field.key}
                        className="w-[64px] break-words text-center text-xs"
                      >
                        {field.label}
                      </TableHead>
                    ))}
                  </TableRow>
                ) : null}
              </TableHeader>
              <TableBody>
                {pagedList.map((it) => (
                  <ShinomontazhpriceRow
                    key={it.id}
                    deleteShinomontazhprice={openAndDelete}
                    showPrices={showPrices}
                    priceColumns={priceColumnFields}
                    {...it}
                  />
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
              <AlertDialogTitle>Удалить услугу?</AlertDialogTitle>
              <AlertDialogDescription>
                Удалив запись вы не сможете ее восстановить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteItemLocal(itemId)}>Удалить</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Dialog open={!!formMatch} onOpenChange={(open) => (!open ? closeForm() : undefined)}>
        <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="shrink-0 border-b px-6 py-4">
            <DialogTitle>{isCreateMode ? 'Новая услуга' : 'Редактировать услугу'}</DialogTitle>
          </DialogHeader>
          {isCreateMode ? (
            <Tabs
              value={createTab}
              onValueChange={(value) => setCreateTab(value as 'single' | 'import')}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <TabsList className="mx-6 mt-4 w-fit shrink-0">
                <TabsTrigger value="single">Одна услуга</TabsTrigger>
                <TabsTrigger value="import">Импорт из Excel</TabsTrigger>
              </TabsList>
              <TabsContent value="single" className="flex flex-1 flex-col overflow-hidden">
                <ShinomontazhpriceForm
                  key="create"
                  mode="create"
                  onSaved={closeForm}
                  onCancel={closeForm}
                />
              </TabsContent>
              <TabsContent value="import" className="flex flex-1 flex-col overflow-hidden">
                <ShinomontazhpriceImport onSaved={closeForm} onCancel={closeForm} />
              </TabsContent>
            </Tabs>
          ) : editingItem ? (
            <ShinomontazhpriceForm
              key={editingItem.id}
              mode="edit"
              item={editingItem}
              onSaved={closeForm}
              onCancel={closeForm}
            />
          ) : formMatch ? (
            <p className="px-6 py-6 text-center text-sm text-muted-foreground">Услуга не найдена</p>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ShinomontazhpriceList
