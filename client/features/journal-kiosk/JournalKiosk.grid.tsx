import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { getEmployees } from '../../redux/reducers/employees'
import { getPlaces } from '../../redux/reducers/places'
import { signOut } from '../../redux/reducers/auth'
import { Button } from '../../components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select'
import type { IEmployee } from '../../../common/types/generated/Employee'
import type { IPlace } from '../../../common/types/generated/Place'

// Kiosk grid for the "Электронный журнал (упрощенный)" account kind (see
// client/lists/account-kind-list.js) - this is the account's home screen instead of the
// Dashboard (see the "/" route in client/config/root.js). A shared tablet stays logged into one
// such account; tapping a number opens that employee's simplified journal
// (JournalKiosk.employee.tsx).
//
// Filtering: an account tied to one "Место работы" only ever shows that point's employees (per
// the requirement that the account's place must match the employee's place) - no selector, no
// way to see another point's numbers. Only an untied ("Общий") account gets a place selector, and
// that choice is kept in the URL (?place=<id>) the same way list screens keep their filters there
// (see the navigation rule in CLAUDE.md), so switching back and forth from an employee screen
// keeps the chosen point instead of resetting it.
const JournalKioskGrid = () => {
  const dispatch = useDispatch<any>()
  const history = useHistory()
  const location = useLocation()
  const auth = useSelector((s: { auth: { place: string } }) => s.auth)
  const employees = useSelector((s: { employees: { list: IEmployee[] } }) => s.employees.list)
  const places = useSelector((s: { places: { list: IPlace[] } }) => s.places.list)

  useEffect(() => {
    dispatch(getEmployees())
    dispatch(getPlaces())
  }, [dispatch])

  const accountPlaceId = auth.place || ''
  const [selectedPlaceId, setSelectedPlaceId] = useState(
    () => new URLSearchParams(location.search).get('place') || ''
  )
  // Keeps the address bar in sync only when the account itself picks the point (no place of its
  // own) - an account already tied to one point never needs this, its filter can't change.
  useEffect(() => {
    if (accountPlaceId) return
    history.replace({
      pathname: '/journal-kiosk',
      search: selectedPlaceId ? `?place=${selectedPlaceId}` : ''
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountPlaceId, selectedPlaceId])

  const effectivePlaceId = accountPlaceId || selectedPlaceId
  const effectivePlace = places.find((it) => it.id === effectivePlaceId)

  const numbered = employees
    .filter(
      (it) =>
        it.journalNumber != null &&
        effectivePlaceId !== '' &&
        (it.address || []).includes(effectivePlaceId)
    )
    .sort((a, b) => (a.journalNumber as number) - (b.journalNumber as number))

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="flex flex-col gap-3 border-b bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Электронный журнал</h1>
          {accountPlaceId ? (
            <p className="text-sm text-muted-foreground">{effectivePlace?.name || '—'}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          {!accountPlaceId ? (
            <Select value={selectedPlaceId} onValueChange={setSelectedPlaceId}>
              <SelectTrigger className="h-11 w-full min-w-[220px] sm:w-auto">
                <SelectValue placeholder="Выберите точку" />
              </SelectTrigger>
              <SelectContent>
                {places.map((it) => (
                  <SelectItem key={it.id} value={it.id as string}>
                    {it.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
          <Button type="button" variant="outline" onClick={() => dispatch(signOut())}>
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </Button>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 sm:px-6">
        {effectivePlaceId === '' ? (
          <p className="py-12 text-center text-muted-foreground">Выберите точку</p>
        ) : numbered.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            На этой точке нет сотрудников с номером для электронного журнала. Обратитесь к
            администратору.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
            {numbered.map((employee) => (
              <button
                key={employee.id}
                type="button"
                onClick={() => history.push(`/journal-kiosk/${employee.id}`)}
                className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:border-primary hover:bg-primary/5 active:bg-primary/10"
              >
                <span className="text-4xl font-bold sm:text-5xl">{employee.journalNumber}</span>
                <span className="text-center text-sm text-muted-foreground">
                  {employee.name} {employee.surname}
                </span>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default JournalKioskGrid
