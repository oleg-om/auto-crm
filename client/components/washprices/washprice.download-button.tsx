import React from 'react'
import { useSelector } from 'react-redux'
import { Download } from 'lucide-react'
import { Button } from '../ui/button'
import downloadPriceWorkbook from '../../lib/price-excel-download'
import { washExcelConfig } from '../../lib/price-excel-configs'
import type { IWashPrice } from '../../../common/types/generated/WashPrice'

const WashpriceDownloadButton = () => {
  const data = useSelector((s: { washprices: { list: IWashPrice[] } }) => s.washprices.list)

  const download = () => {
    const array: Partial<IWashPrice>[] = []

    if (data?.length) {
      ;[...data]
        .sort((a, b) => {
          const byType = (a.type || '').localeCompare(b.type || '')
          if (byType !== 0) return byType
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
      washExcelConfig,
      `crm-прайс-мойка-${new Date().toISOString().slice(0, 10)}.xlsx`
    )
  }

  return (
    <Button type="button" variant="outline" onClick={download}>
      <Download className="mr-2 h-4 w-4" />
      Скачать прайс
    </Button>
  )
}

export default WashpriceDownloadButton
