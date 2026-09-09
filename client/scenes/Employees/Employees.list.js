import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { X } from 'lucide-react'
import EmployeeRow from '../../components/employees/employee'
import { deleteEmployee } from '../../redux/reducers/employees'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Modal from '../../components/Modal.delete'
import 'react-toastify/dist/ReactToastify.css'
import { Card, CardContent } from '../../components/ui/card'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
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

const PAGE_SIZE = 20

const getPageNumbers = (current, total) => {
  const delta = 1
  const middle = []
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    middle.push(i)
  }
  const withEdges = [1, ...middle, total].filter(
    (v, i, arr) => arr.indexOf(v) === i && v >= 1 && v <= total
  )
  const result = []
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
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const dispatch = useDispatch()
  const list = useSelector((s) => s.employees.list)
  const place = useSelector((s) => s.places.list)
  const [isOpen, setIsOpen] = useState(false)
  const [itemId, setItemId] = useState('')
  const [searchName, setSearchName] = useState('')
  const [searchPlace, setSearchPlace] = useState('')
  const [page, setPage] = useState(1)

  const filteredList = list.filter((it) => {
    const fullName = `${it.name} ${it.surname}`.toLowerCase()
    const matchesName = fullName.includes(searchName.trim().toLowerCase())
    const matchesPlace = searchPlace === '' || it.address.includes(searchPlace)
    return matchesName && matchesPlace
  })

  useEffect(() => {
    setPage(1)
  }, [searchName, searchPlace])

  const totalPages = Math.max(1, Math.ceil(filteredList.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pagedList = filteredList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const openAndDelete = (id) => {
    setIsOpen(true)
    setItemId(id)
  }
  const deleteEmployeeLocal = (id) => {
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
                      className="pr-8"
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
                  <Select
                    value={searchPlace === '' ? 'all' : searchPlace}
                    onValueChange={(value) => setSearchPlace(value === 'all' ? '' : value)}
                  >
                    <SelectTrigger id="searchPlace">
                      <SelectValue placeholder="Все" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      {place.map((it) => (
                        <SelectItem key={it.id} value={it.id}>
                          {it.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="overflow-x-auto rounded-lg relative lg:my-3 mt-1 lg:shadow">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow>
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
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={() => deleteEmployeeLocal(itemId)}
        />
      </div>
    </div>
  )
}

export default EmployeeList
