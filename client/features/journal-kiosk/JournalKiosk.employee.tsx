import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ArrowLeft, Briefcase, Coffee, Play, Square, Utensils } from 'lucide-react'
import { getEmployees } from '../../redux/reducers/employees'
import { getPositions } from '../../redux/reducers/positions'
import { getEmployeePositionIds } from '../../lib/employee-positions'
import standardDutiesList from '../../lists/standard-duties-list'
import { Button } from '../../components/ui/button'
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
import 'react-toastify/dist/ReactToastify.css'
import type { IEmployee } from '../../../common/types/generated/Employee'
import type { IPosition } from '../../../common/types/generated/Position'
import type { IJournalEntry } from '../../../common/types/generated/JournalEntry'
import type { IWorkDayStart } from '../../../common/types/generated/WorkDayStart'

// Simplified, tablet-sized "clock in/out" screen for one employee, opened by tapping their
// number on JournalKiosk.grid.tsx. Unlike the full journal (client/components/journal/
// EmployeeJournal.js) there is no duty picker, no quantities/checklists/comments - just the day
// itself plus the two standard breaks ("Отдых" covers перекур/чай-кофе/перекус too, see the
// button label; "Обед" is kept separate since it's tracked on its own everywhere else in the
// app). Both reuse the exact same duties/journalEntry API the full journal writes to, so a shift
// clocked in here shows up there (and in reports) exactly like one clocked in from the full
// journal.
const REST_DUTY_NAME = 'Отдых'
const LUNCH_DUTY_NAME = 'Обед'

// Same "today" as the full journal (a UTC-based YYYY-MM-DD string) rather than a
// locale/moment-formatted local date - the journalEntry/workDayStart `date` field is a bucket key
// the two screens must agree on, so this intentionally matches EmployeeJournal.js's computation
// instead of picking a fresh one.
const today = () => new Date().toISOString().split('T')[0]

type IDuty = NonNullable<IPosition['duties']>[number] & { dutyPositionId: string }

const JournalKioskEmployee = () => {
  const { employeeId } = useParams<{ employeeId: string }>()
  const dispatch = useDispatch<any>()
  const history = useHistory()
  const auth = useSelector((s: { auth: { place: string } }) => s.auth)
  // `?? []` - same defensive fallback as JournalKiosk.grid.tsx, see the comment there.
  const employees = useSelector((s: { employees: { list: IEmployee[] } }) => s.employees.list) ?? []
  const positions = useSelector((s: { positions: { list: IPosition[] } }) => s.positions.list) ?? []

  toast.configure()
  const notify = (arg: string) => toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })

  useEffect(() => {
    dispatch(getEmployees())
    dispatch(getPositions())
  }, [dispatch])

  const employee = employees.find((it) => it.id === employeeId)
  const positionIds = useMemo(() => getEmployeePositionIds(employee), [employee])
  const employeePositions = positions.filter((it) => positionIds.includes(it.id as string))
  const employeePositionNames = employeePositions.map((it) => it.name).join(', ')
  const duties: IDuty[] = employeePositions.flatMap(
    (pos) =>
      (pos.duties || []).map((duty) => ({ ...duty, dutyPositionId: pos.id as string })) as IDuty[]
  )
  const findDuty = (name: string) =>
    duties.find((it) => it.name.toLowerCase() === name.toLowerCase())

  const [workDayData, setWorkDayData] = useState<IWorkDayStart | null>(null)
  const [entries, setEntries] = useState<Record<string, IJournalEntry>>({})
  const [loading, setLoading] = useState(true)
  const [isEndDayConfirmOpen, setIsEndDayConfirmOpen] = useState(false)
  const workDayStarted = !!workDayData
  const workDayEnded = !!workDayData?.endTime

  const loadWorkDayStart = async () => {
    const response = await fetch(`/api/v1/workDayStart/employee/${employeeId}/date/${today()}`)
    const { data } = await response.json()
    setWorkDayData(data)
  }

  const loadEntries = async () => {
    const response = await fetch(`/api/v1/journalEntry/employee/${employeeId}/date/${today()}`)
    const { data } = await response.json()
    const map: Record<string, IJournalEntry> = {}
    ;(data as IJournalEntry[]).forEach((entry) => {
      if (entry.id) map[entry.id] = entry
    })
    setEntries(map)
  }

  useEffect(() => {
    if (!employeeId) return
    setLoading(true)
    Promise.all([loadWorkDayStart(), loadEntries()]).finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId])

  const dutyNameByEntry = (entry: IJournalEntry) =>
    duties.find((it) => String(it._id) === String(entry.dutyId))?.name

  const activeEntryFor = (dutyName: string) =>
    Object.values(entries).find(
      (entry) => !entry.endTime && dutyNameByEntry(entry)?.toLowerCase() === dutyName.toLowerCase()
    )

  const restEntry = activeEntryFor(REST_DUTY_NAME)
  const lunchEntry = activeEntryFor(LUNCH_DUTY_NAME)
  // Only one lunch per work day (the server enforces this too - see journalEntry.controller.js).
  const lunchTakenToday =
    !lunchEntry &&
    Object.values(entries).some(
      (entry) => dutyNameByEntry(entry)?.toLowerCase() === LUNCH_DUTY_NAME.toLowerCase()
    )

  // Kiosk flow: after any successful action go straight back to the number grid (the tablet is
  // shared - the next person shouldn't land on this employee's screen) and confirm who is now in
  // which state. Statuses are phrased as states ("на обеде"), not past-tense verbs, so they don't
  // need the employee's grammatical gender.
  const finishAndLeave = (status: string) => {
    const fullName = [employee?.name, employee?.surname].filter(Boolean).join(' ')
    toast.success(`${fullName}: ${status}`, { position: toast.POSITION.BOTTOM_RIGHT })
    history.goBack()
  }

  const handleStartWorkDay = async () => {
    const response = await fetch('/api/v1/workDayStart/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, date: today() })
    })
    const { data } = await response.json()
    if (!data) {
      notify('Не удалось начать рабочий день')
      return
    }
    setWorkDayData(data)
    finishAndLeave('на работе')
  }

  const handleEndWorkDay = async () => {
    const response = await fetch('/api/v1/workDayStart/end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, date: today() })
    })
    const { data } = await response.json()
    if (!data) {
      notify('Не удалось завершить рабочий день')
      return
    }
    setWorkDayData(data)
    finishAndLeave('рабочий день завершён')
  }

  // Starts a break/lunch: reuses the duty already on the employee's position if one with this
  // name exists (created earlier from here or from "Добавить другое" in the full journal),
  // otherwise creates it - same flow as EmployeeJournal.js's handleAddStandardDuty.
  const startDuty = async (name: string) => {
    if (positionIds.length === 0) {
      notify('Сотруднику не назначена должность. Обратитесь к администратору.')
      return
    }
    const existing = findDuty(name)
    let dutyId = existing?._id
    const positionIdForEntry = existing?.dutyPositionId || positionIds[0]

    if (!dutyId) {
      const standard = standardDutiesList.find((it) => it.name.toLowerCase() === name.toLowerCase())
      const response = await fetch(`/api/v1/position/${positionIds[0]}/duty`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          isQuantitative: standard?.isQuantitative || false,
          completionTimeMinutes: standard?.completionTimeMinutes ?? null
        })
      })
      const addDutyData = await response.json()
      if (addDutyData.status !== 'ok') {
        notify('Ошибка при создании обязанности')
        return
      }
      const newDuty = addDutyData.data.duties.find((it: { name: string }) => it.name === name)
      if (!newDuty) {
        notify('Ошибка при создании обязанности')
        return
      }
      dutyId = newDuty._id
      // positionIdForEntry is already positionIds[0] here (the `existing` branch above didn't
      // match, so its fallback already applied).
      dispatch(getPositions())
    }

    const response = await fetch('/api/v1/journalEntry/upsert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeId,
        positionId: positionIdForEntry,
        dutyId,
        date: today(),
        startTime: new Date().toISOString(),
        value: null,
        comment: null
      })
    })
    const { data, message } = await response.json()
    if (!data?.id) {
      notify(message || 'Не удалось сохранить')
      return
    }
    setEntries((prev) => ({ ...prev, [data.id]: data }))
    finishAndLeave(name === LUNCH_DUTY_NAME ? 'на обеде' : 'на перерыве')
  }

  const finishDuty = async (entry: IJournalEntry) => {
    const response = await fetch('/api/v1/journalEntry/upsert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entryId: entry.id,
        employeeId,
        positionId: entry.positionId,
        dutyId: entry.dutyId,
        date: today(),
        value: entry.value,
        comment: entry.comment,
        startTime: entry.startTime,
        endTime: new Date().toISOString()
      })
    })
    const { data } = await response.json()
    if (!data?.id) {
      notify('Не удалось сохранить')
      return
    }
    setEntries((prev) => ({ ...prev, [data.id]: data }))
    const isLunch = dutyNameByEntry(entry)?.toLowerCase() === LUNCH_DUTY_NAME.toLowerCase()
    finishAndLeave(isLunch ? 'обед завершён' : 'перерыв завершён')
  }

  const goBack = () => history.goBack()

  if (!employee) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-lg text-muted-foreground">Сотрудник не найден</p>
        <Button type="button" onClick={goBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к списку
        </Button>
      </div>
    )
  }

  if (auth.place && !(employee.address || []).includes(auth.place)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-lg text-muted-foreground">Этот сотрудник закреплён за другой точкой</p>
        <Button type="button" onClick={goBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к списку
        </Button>
      </div>
    )
  }

  const bigButtonClass = 'h-16 w-full gap-3 whitespace-normal text-lg sm:h-20 sm:text-xl'
  const bigIconClass = 'h-6 w-6 shrink-0 sm:h-7 sm:w-7'
  // `secondary` is the same tone as the page's bg-muted/30, so idle break buttons are drawn as
  // white bordered cards instead to stand out from the background. An active break's "Завершить"
  // is primary (same as "Начать рабочий день" - back to work), keeping destructive red for
  // "Завершить рабочий день" alone.
  const breakButtonClass = (isActive: boolean) =>
    cn(bigButtonClass, !isActive && 'border-2 shadow-sm')

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="flex items-center gap-3 border-b bg-background px-4 py-4 sm:px-6">
        <Button type="button" variant="outline" size="icon" onClick={goBack} aria-label="Назад">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">
            {employee.name} {employee.surname}
          </h1>
          <p className="text-sm text-muted-foreground">
            {employeePositionNames || 'Должность не назначена'}
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-4 px-4 py-8 sm:px-6">
        {loading ? (
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-4 border-primary" />
        ) : !workDayStarted ? (
          <Button type="button" className={bigButtonClass} onClick={handleStartWorkDay}>
            <Play className={bigIconClass} />
            Начать рабочий день
          </Button>
        ) : workDayEnded ? (
          <p className="text-center text-lg text-muted-foreground">Рабочий день завершён</p>
        ) : (
          <>
            {positionIds.length === 0 ? (
              <p className="text-center text-sm text-amber-700">
                Сотруднику не назначена должность - недоступны Отдых и Обед. Обратитесь к
                администратору.
              </p>
            ) : null}
            <Button
              type="button"
              variant={restEntry ? 'default' : 'outline'}
              className={breakButtonClass(!!restEntry)}
              disabled={positionIds.length === 0 || !!lunchEntry}
              onClick={() => (restEntry ? finishDuty(restEntry) : startDuty(REST_DUTY_NAME))}
            >
              {restEntry ? (
                <Briefcase className={bigIconClass} />
              ) : (
                <Coffee className={bigIconClass} />
              )}
              {restEntry ? 'Завершить перерыв' : 'Отдых / перекур / чай-кофе / перекус'}
            </Button>
            <Button
              type="button"
              variant={lunchEntry ? 'default' : 'outline'}
              className={breakButtonClass(!!lunchEntry)}
              disabled={positionIds.length === 0 || !!restEntry || lunchTakenToday}
              onClick={() => (lunchEntry ? finishDuty(lunchEntry) : startDuty(LUNCH_DUTY_NAME))}
            >
              {lunchEntry ? (
                <Briefcase className={bigIconClass} />
              ) : (
                <Utensils className={bigIconClass} />
              )}
              {lunchEntry ? 'Завершить обед' : lunchTakenToday ? 'Обед уже был сегодня' : 'Обед'}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className={bigButtonClass}
              disabled={!!restEntry || !!lunchEntry}
              onClick={() => setIsEndDayConfirmOpen(true)}
            >
              <Square className={bigIconClass} />
              Завершить рабочий день
            </Button>
          </>
        )}
        {/* Same goBack() as the header's arrow - duplicated down here so the next person at the
            tablet doesn't have to reach for the small top-corner button. */}
        <Button
          type="button"
          variant="ghost"
          className="mt-4 h-14 w-full gap-2 text-base text-muted-foreground"
          onClick={goBack}
        >
          <ArrowLeft className="h-5 w-5" />
          Вернуться на главный экран
        </Button>
      </main>
      {/* Ending the day can't be undone from the kiosk, so ask first - with tablet-sized buttons. */}
      <AlertDialog open={isEndDayConfirmOpen} onOpenChange={setIsEndDayConfirmOpen}>
        <AlertDialogContent className="max-w-[calc(100%-2rem)] gap-6 rounded-lg sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl sm:text-2xl">
              Вы уверены, что хотите завершить рабочий день?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              {employee.name} {employee.surname}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="grid gap-3 sm:grid-cols-2 sm:space-x-0">
            <AlertDialogCancel className="mt-0 h-16 text-lg">Отмена</AlertDialogCancel>
            <AlertDialogAction className="h-16 gap-3 text-lg" onClick={handleEndWorkDay}>
              <Square className={bigIconClass} />
              Завершить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default JournalKioskEmployee
