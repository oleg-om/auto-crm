import { toast } from 'react-toastify'

const MINUTES_PER_SERVICE = 2
const MS_PER_SERVICE = MINUTES_PER_SERVICE * 60 * 1000

function formatMmSs(remainingMs) {
  const s = Math.max(0, Math.ceil(remainingMs / 1000))
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

/**
 * If the order is being completed too soon after dateStart, shows a warning with a live countdown
 * and returns true (caller should abort the action).
 * Rule: each selected service row ⇒ MINUTES_PER_SERVICE minutes from dateStart.
 */
export default function tryBlockWorkCompletionTooSoon(dateStart, services) {
  const startMs = new Date(dateStart).getTime()
  if (Number.isNaN(startMs)) return false
  const n = Array.isArray(services) ? services.length : 0
  const allowedAt = startMs + n * MS_PER_SERVICE
  if (Date.now() >= allowedAt) return false

  const prefix = 'Время работы не соответствует действительности. Ожидайте '
  let intervalId = null
  const id = toast.info(`${prefix}${formatMmSs(allowedAt - Date.now())}`, {
    position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: false,
    closeOnClick: true,
    onClose: () => {
      if (intervalId) clearInterval(intervalId)
    }
  })
  intervalId = setInterval(() => {
    const rem = allowedAt - Date.now()
    if (rem <= 0) {
      clearInterval(intervalId)
      toast.dismiss(id)
      return
    }
    toast.update(id, {
      render: `${prefix}${formatMmSs(rem)}`,
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: false,
      closeOnClick: true
    })
  }, 1000)

  return true
}
