import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Plus, Trash2 } from 'lucide-react'
import Navbar from '../Navbar'
import Sidebar from '../Sidebar'
import { getPositions, createPosition, deletePosition } from '../../redux/reducers/positions'
import PositionTab from './PositionTab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../ui/alert-dialog'
import 'react-toastify/dist/ReactToastify.css'
import type { IPosition } from '../../../common/types/generated/Position'

const ElectronicJournal = () => {
  toast.configure()
  const notify = (arg: string) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const dispatch = useDispatch<any>()
  const positions = useSelector((s: { positions: { list: IPosition[] } }) => s.positions.list)
  const [activePositionId, setActivePositionId] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [newPositionName, setNewPositionName] = useState('')
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    dispatch(getPositions())
  }, [dispatch])

  useEffect(() => {
    if (positions.length > 0 && !activePositionId) {
      setActivePositionId(positions[0].id as string)
    }
  }, [positions, activePositionId])

  const activePosition = positions.find((p) => p.id === activePositionId)
  const canDeleteActivePosition = !!activePosition && (activePosition.duties?.length ?? 0) === 0

  const handleCreatePosition = () => {
    if (!newPositionName.trim()) {
      setNameError('Введите название должности')
      return
    }
    dispatch(createPosition(newPositionName.trim())).then(
      ({ data: position }: { data: IPosition }) => {
        setNewPositionName('')
        setNameError('')
        setIsCreateOpen(false)
        setActivePositionId(position.id as string)
        notify('Должность добавлена')
      }
    )
  }

  const deletePositionLocal = () => {
    if (!activePosition?.id) return
    dispatch(deletePosition(activePosition.id)).then((result: { status: string }) => {
      if (result?.status === 'ok') {
        setIsDeleteOpen(false)
        notify('Должность удалена')
        const remaining = positions.filter((p) => p.id !== activePosition.id)
        setActivePositionId(remaining.length > 0 ? (remaining[0].id as string) : null)
      }
    })
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        <Sidebar />
        <div className="container mx-auto min-w-0 px-4">
          <div className="mb-6 flex items-center justify-between border-b py-4">
            <h1 className="text-3xl">Электронный журнал</h1>
          </div>

          {positions.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Добавьте первую должность
              <div className="mt-4">
                <Button type="button" onClick={() => setIsCreateOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить должность
                </Button>
              </div>
            </div>
          ) : (
            <Tabs value={activePositionId ?? undefined} onValueChange={setActivePositionId}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
                  {positions.map((position) => (
                    <TabsTrigger
                      key={position.id}
                      value={position.id as string}
                      className="gap-1.5 border data-[state=active]:border-primary"
                    >
                      {position.name}
                      {position.duties && position.duties.length > 0 ? (
                        <Badge variant="secondary" className="px-1.5 text-[10px]">
                          {position.duties.length}
                        </Badge>
                      ) : null}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-1.5 h-4 w-4" />
                    Добавить должность
                  </Button>
                  {activePosition ? (
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={!canDeleteActivePosition}
                      title={
                        canDeleteActivePosition
                          ? undefined
                          : 'Нельзя удалить должность с обязанностями'
                      }
                      onClick={() => setIsDeleteOpen(true)}
                    >
                      <Trash2 className="mr-1.5 h-4 w-4" />
                      Удалить должность
                    </Button>
                  ) : null}
                </div>
              </div>

              {positions.map((position) => (
                <TabsContent key={position.id} value={position.id as string} className="mt-0">
                  <PositionTab position={position} />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Новая должность</DialogTitle>
          </DialogHeader>
          <Field data-invalid={!!nameError}>
            <FieldLabel htmlFor="newPositionName">Название</FieldLabel>
            <Input
              id="newPositionName"
              value={newPositionName}
              placeholder="Введите название должности"
              autoFocus
              aria-invalid={!!nameError}
              onChange={(e) => {
                setNewPositionName(e.target.value)
                if (e.target.value.trim()) setNameError('')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleCreatePosition()
                }
              }}
            />
            <FieldError>{nameError}</FieldError>
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Отмена
            </Button>
            <Button type="button" onClick={handleCreatePosition}>
              Создать
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить должность?</AlertDialogTitle>
            <AlertDialogDescription>
              Удалив запись вы не сможете ее восстановить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={deletePositionLocal}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ElectronicJournal
