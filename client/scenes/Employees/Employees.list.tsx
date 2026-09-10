import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import EmployeeRow from '../../components/employees/employee'
import EmployeeForm from '../../components/employees/employee.form'
import { deleteEmployee } from '../../redux/reducers/employees'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../../components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover'
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
import type { IEmployee } from '../../../common/types/generated/Employee'
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

const EmployeeList = () => {
  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  // No app-wide typed store yet (see client/redux/reducers/index.js) - typed
  // just for the slices this page reads, per the IEmployee/IPlace contracts.
  const dispatch = useDispatch<any>()
  const history = useHistory()
  const list = useSelector((s: { employees: { list: IEmployee[] } }) => s.employees.list)
  const place = useSelector((s: { places: { list: IPlace[] } }) => s.places.list)
  const formMatch = useRouteMatch<{ id?: string }>({
    path: ['/employee/create', '/employee/edit/:id'],
    exact: true
  })
  const isCreateMode = formMatch?.path === '/employee/create'
  const editingEmployee = formMatch?.params.id
    ? list.find((it) => it.id === formMatch.params.id)
    : undefined
  const closeForm = () => history.push('/employee/list')
  const [isOpen, setIsOpen] = useState(false)
  const [itemId, setItemId] = useState('')
  const [searchName, setSearchName] = useState('')
  const [searchPlace, setSearchPlace] = useState('')
  const [isPlacePickerOpen, setIsPlacePickerOpen] = useState(false)
  const [page, setPage] = useState(1)

  const filteredList = list.filter((it) => {
    const fullName = `${it.name} ${it.surname}`.toLowerCase()
    const matchesName = fullName.includes(searchName.trim().toLowerCase())
    const matchesPlace = searchPlace === '' || it.address.includes(searchPlace)
    return matchesName && matchesPlace
  })

  const isSearchNameActive = searchName.trim() !== ''
  const isSearchPlaceActive = searchPlace !== ''
  const hasActiveFilters = isSearchNameActive || isSearchPlaceActive
  const resetFilters = () => {
    setSearchName('')
    setSearchPlace('')
  }

  useEffect(() => {
    setPage(1)
  }, [searchName, searchPlace])

  const totalPages = Math.max(1, Math.ceil(filteredList.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pagedList = filteredList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const openAndDelete = (id: string) => {
    setIsOpen(true)
    setItemId(id)
  }
  const deleteEmployeeLocal = (id: string) => {
    dispatch(deleteEmployee(id))
    setIsOpen(false)
    notify('Сотрудник удален')
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        <Sidebar />
        <div className="container mx-auto px-4">
          <h1 className="text-3xl py-4 border-b mb-6">Список сотрудников</h1>
          <Card className="my-3">
            <CardContent className="p-4">
              <div className="-mx-2 md:flex md:justify-between">
                <div className="md:w-1/2 px-2 mb-4 md:mb-0">
                  <Label htmlFor="searchName" className="block mb-2">
                    Имя или фамилия
                  </Label>
                  <div className="relative">
                    <Input
                      id="searchName"
                      value={searchName}
                      placeholder="Введите имя или фамилию"
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
                <div className="md:w-1/2 px-2 mb-4 md:mb-0">
                  <Label htmlFor="searchPlace" className="block mb-2">
                    Точка
                  </Label>
                  <Popover open={isPlacePickerOpen} onOpenChange={setIsPlacePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        id="searchPlace"
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={isPlacePickerOpen}
                        className={cn(
                          'w-full justify-between font-normal',
                          isSearchPlaceActive && 'border-primary text-primary'
                        )}
                      >
                        {searchPlace === ''
                          ? 'Все'
                          : place.find((it) => it.id === searchPlace)?.name ?? 'Все'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command>
                        <CommandInput placeholder="Поиск точки..." />
                        <CommandList>
                          <CommandEmpty>Ничего не найдено</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value="Все"
                              onSelect={() => {
                                setSearchPlace('')
                                setIsPlacePickerOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  searchPlace === '' ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              Все
                            </CommandItem>
                            {place.map((it) => (
                              <CommandItem
                                key={it.id}
                                value={it.name}
                                onSelect={() => {
                                  setSearchPlace(it.id)
                                  setIsPlacePickerOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    searchPlace === it.id ? 'opacity-100' : 'opacity-0'
                                  )}
                                />
                                {it.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              {hasActiveFilters ? (
                <div className="flex flex-wrap items-center gap-2 -mx-2 px-2 pt-3 mt-3 border-t">
                  <span className="text-sm text-muted-foreground">
                    Найдено: {filteredList.length}
                  </span>
                  {isSearchNameActive ? (
                    <Badge variant="secondary" className="gap-1 pr-1 font-normal">
                      Имя: {searchName.trim()}
                      <button
                        type="button"
                        className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
                        onClick={() => setSearchName('')}
                        aria-label="Сбросить фильтр по имени"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ) : null}
                  {isSearchPlaceActive ? (
                    <Badge variant="secondary" className="gap-1 pr-1 font-normal">
                      Точка: {place.find((it) => it.id === searchPlace)?.name}
                      <button
                        type="button"
                        className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
                        onClick={() => setSearchPlace('')}
                        aria-label="Сбросить фильтр по точке"
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
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Имя</TableHead>
                  <TableHead>Точка</TableHead>
                  <TableHead>Должность</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedList.map((it) => (
                  <EmployeeRow key={it.id} place={place} deleteEmployee={openAndDelete} {...it} />
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
          <Link to="/employee/create">
            <Button
              type="button"
              className="fixed bottom-0 h-32 w-32 left-0 p-6 shadow rounded-full my-3 mx-3"
            >
              Новый
              <br />
              сотрудник
            </Button>
          </Link>
        </div>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить сотрудника?</AlertDialogTitle>
              <AlertDialogDescription>
                Удалив запись вы не сможете ее восстановить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteEmployeeLocal(itemId)}>
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
              {isCreateMode ? 'Новый сотрудник' : 'Редактировать сотрудника'}
            </DialogTitle>
          </DialogHeader>
          {isCreateMode ? (
            <EmployeeForm key="create" mode="create" onSaved={closeForm} onCancel={closeForm} />
          ) : editingEmployee ? (
            <EmployeeForm
              key={editingEmployee.id}
              mode="edit"
              employee={editingEmployee}
              onSaved={closeForm}
              onCancel={closeForm}
            />
          ) : formMatch ? (
            <p className="px-6 py-6 text-center text-sm text-muted-foreground">
              Сотрудник не найден
            </p>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EmployeeList
