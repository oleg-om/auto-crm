import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ArrowDown, ArrowUp, ArrowUpDown, Plus, X } from 'lucide-react'
import DiskpaintingpriceRow from '../../components/diskpaintingprices/diskpaintingprice'
import DiskpaintingpriceForm from '../../components/diskpaintingprices/diskpaintingprice.form'
import DiskpaintingpriceDownloadButton from '../../components/diskpaintingprices/diskpaintingprice.download-button'
import {
  deleteDiskpaintingprice,
  deleteDiskpaintingpriceDb,
  getDiskpaintingprices
} from '../../redux/reducers/diskpainting.prices'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import OnLoad from '../Categorys/Onload'
import 'react-toastify/dist/ReactToastify.css'
import diskpaintingPriceFieldList from '../../lists/diskpainting-price-field-list'
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
import { Switch } from '../../components/ui/switch'
import PaginationBar from '../../components/shared/pagination-bar'
import { usePagination } from '../../hooks/use-pagination'
import { useShowPrices } from '../../hooks/use-show-prices'
import type { IDiskpaintingPrice } from '../../../common/types/generated/DiskpaintingPrice'

const PRICE_FIELDS = diskpaintingPriceFieldList as { key: string; label: string }[]

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

const DiskpaintingpriceList = () => {
  OnLoad()
  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const dispatch = useDispatch<any>()
  const history = useHistory()
  const list = useSelector(
    (s: { diskpaintingprices: { list: IDiskpaintingPrice[] } }) => s.diskpaintingprices.list
  )
  const categoryOptions = useSelector(
    (s: { categorys: { list: { id: string; name: string; type?: string }[] } }) => s.categorys.list
  ).filter((it) => it.type === 'diskpainting')
  const auth = useSelector((s: { auth: { roles: string[] } }) => s.auth)

  React.useEffect(() => {
    dispatch(getDiskpaintingprices())
  }, [dispatch])

  const formMatch = useRouteMatch<{ id?: string }>({
    path: ['/diskpaintingprice/create', '/diskpaintingprice/edit/:id'],
    exact: true
  })
  const isCreateMode = formMatch?.path === '/diskpaintingprice/create'
  const editingItem = formMatch?.params.id
    ? list.find((it) => it.id === formMatch.params.id)
    : undefined
  const closeForm = () =>
    history.push({ pathname: '/diskpaintingprice/list', state: { preserveScroll: true } })

  const [isOpen, setIsOpen] = useState(false)
  const [itemId, setItemId] = useState('')
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false)
  const [showPrices, setShowPrices] = useShowPrices()
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

  const priceColumnFields = showPrices ? PRICE_FIELDS : null

  const filteredList = list.filter((it) => {
    const haystack = `${it.name} ${it.category}`.toLowerCase()
    return haystack.includes(search.trim().toLowerCase())
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
  const deleteItemLocal = (id: string) => {
    dispatch(deleteDiskpaintingprice(id))
    setIsOpen(false)
    notify('Услуга удалена')
  }
  const deleteAllLocal = () => {
    dispatch(deleteDiskpaintingpriceDb())
    setIsDeleteAllOpen(false)
    notify('Услуги удалены')
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        {!auth.roles.includes('bookkeeper') ? <Sidebar /> : null}
        <div className="container mx-auto min-w-0 px-4">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b py-4">
            <h1 className="text-3xl">Покраска дисков - цены</h1>
            <div className="flex flex-wrap items-center gap-4">
              <label
                htmlFor="showPrices"
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Switch id="showPrices" checked={showPrices} onCheckedChange={setShowPrices} />
                Показывать цены
              </label>
              <div className="flex gap-2">
                <DiskpaintingpriceDownloadButton />
                <Button type="button" variant="outline" onClick={() => setIsDeleteAllOpen(true)}>
                  Удалить все
                </Button>
                <Link
                  to={{ pathname: '/diskpaintingprice/create', state: { preserveScroll: true } }}
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
              <div className="md:w-1/2">
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
              {isSearchActive ? (
                <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t">
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
            <Table
              className="table-fixed"
              style={{ minWidth: priceColumnFields ? 620 + priceColumnFields.length * 64 : 560 }}
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
                    className={cn('w-[180px]', priceColumnFields && 'align-top')}
                    rowSpan={priceColumnFields ? 2 : undefined}
                  >
                    Категория
                  </TableHead>
                  {priceColumnFields ? (
                    <TableHead colSpan={priceColumnFields.length} className="text-center">
                      Цены
                    </TableHead>
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
                  <DiskpaintingpriceRow
                    key={it.id}
                    deleteDiskpaintingprice={openAndDelete}
                    showPrices={showPrices}
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
        <AlertDialog open={isDeleteAllOpen} onOpenChange={setIsDeleteAllOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить все услуги?</AlertDialogTitle>
              <AlertDialogDescription>
                Удалив записи вы не сможете их восстановить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={deleteAllLocal}>Удалить</AlertDialogAction>
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
            <DiskpaintingpriceForm
              key="create"
              mode="create"
              categoryOptions={categoryOptions}
              onSaved={closeForm}
              onCancel={closeForm}
            />
          ) : editingItem ? (
            <DiskpaintingpriceForm
              key={editingItem.id}
              mode="edit"
              item={editingItem}
              categoryOptions={categoryOptions}
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

export default DiskpaintingpriceList
