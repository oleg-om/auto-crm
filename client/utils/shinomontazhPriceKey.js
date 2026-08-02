import sizeGruz from '../lists/tyres/sizegruz'
import sizeSelhoz from '../lists/tyres/sizeselhoz'

export const helpToGetDiametr = (item) => {
  if (!item) {
    return ''
  }
  if (item === 'R16С (скорая)') {
    return '16Camb'
  }
  if (item === '22.5 (спец шина)') {
    return '23'
  }
  return item.replace(/[^C\d]/g, '')
}

export const getShinomontazhPriceKey = (diametr) => 'R'.concat(helpToGetDiametr(diametr))

export const isMusorkiKarDiametr = (diametr) =>
  sizeGruz.includes(diametr) || sizeSelhoz.includes(diametr)

export const normalizeShinomontazhFree = (free) => (free === 'yes' ? 'yes' : 'no')

export const isShinomontazhPromo = (free) => free === 'yes'

export const hasShinomontazhPrice = (price) => price != null && price !== ''

export const getShinomontazhPriceFromItem = (item, diametr) => {
  if (!item || !diametr) {
    return undefined
  }
  const rawPrice = item[getShinomontazhPriceKey(diametr)]
  if (rawPrice == null || rawPrice === '') {
    return undefined
  }
  return rawPrice
}
