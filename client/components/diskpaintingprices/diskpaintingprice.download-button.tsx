import React from 'react'
import { useSelector } from 'react-redux'
import { Download } from 'lucide-react'
import { Button } from '../ui/button'
import downloadPriceWorkbook from '../../lib/price-excel-download'
import { diskpaintingExcelConfig } from '../../lib/price-excel-configs'
import type { IDiskpaintingPrice } from '../../../common/types/generated/DiskpaintingPrice'

const DiskpaintingpriceDownloadButton = () => {
  const data = useSelector(
    (s: { diskpaintingprices: { list: IDiskpaintingPrice[] } }) => s.diskpaintingprices.list
  )

  const download = () => {
    const array: Partial<IDiskpaintingPrice>[] = []

    if (data?.length) {
      ;[...data]
        .sort((a, b) => {
          const byCat = (a.category || '').localeCompare(b.category || '')
          if (byCat !== 0) return byCat
          return (a.name || '').localeCompare(b.name || '')
        })
        .forEach((item) => {
          array.push(item)
        })
    }

    downloadPriceWorkbook(
      array as Record<string, unknown>[],
      diskpaintingExcelConfig,
      `crm-прайс-покраска-дисков-${new Date().toISOString().slice(0, 10)}.xlsx`
    )
  }

  return (
    <Button type="button" variant="outline" onClick={download}>
      <Download className="mr-2 h-4 w-4" />
      Скачать прайс
    </Button>
  )
}

export default DiskpaintingpriceDownloadButton
