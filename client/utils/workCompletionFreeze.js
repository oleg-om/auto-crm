import { toast } from 'react-toastify'

const MS_PER_MINUTE = 60 * 1000

function serviceMinutes(serviceRow, priceList) {
  const price = Array.isArray(priceList)
    ? priceList.find((it) => it.id === serviceRow?.serviceName)
    : null
  const minutes = Number(price?.time)
  return minutes > 0 ? minutes : 0
}

function formatMmSs(remainingMs) {
  const s = Math.max(0, Math.ceil(remainingMs / 1000))
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

/**
 * If the order is being completed too soon after dateStart, shows a warning with a live countdown
 * and returns true (caller should abort the action).
 * Rule: each selected service row waits its `time` (minutes) from the price list; rows whose price
 * has no time add nothing. The waits add up from dateStart.
 */
export default function tryBlockWorkCompletionTooSoon(dateStart, services, priceList) {
  const startMs = new Date(dateStart).getTime()
  if (Number.isNaN(startMs)) return false
  const totalMinutes = (Array.isArray(services) ? services : []).reduce(
    (acc, row) => acc + serviceMinutes(row, priceList),
    0
  )
  if (totalMinutes <= 0) return false
  const allowedAt = startMs + totalMinutes * MS_PER_MINUTE
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
