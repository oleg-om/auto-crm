import React from 'react'
import { useSelector } from 'react-redux'
import { Download } from 'lucide-react'
import { Button } from '../ui/button'
import downloadPriceWorkbook from '../../lib/price-excel-download'
import { windowExcelConfig } from '../../lib/price-excel-configs'
import type { IWindowPrice } from '../../../common/types/generated/WindowPrice'

interface IWindowpriceDownloadButtonProps {
  domain: 'window' | 'cond'
}

const FILE_PREFIX: Record<'window' | 'cond', string> = {
  window: 'стекла',
  cond: 'кондиционеры'
}

const WindowpriceDownloadButton = ({ domain }: IWindowpriceDownloadButtonProps) => {
  const data = useSelector(
    (s: { windowprices: { list: IWindowPrice[] }; condprices: { list: IWindowPrice[] } }) =>
      domain === 'cond' ? s.condprices.list : s.windowprices.list
  )

  const download = () => {
    const array: Partial<IWindowPrice>[] = []

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
      windowExcelConfig,
      `crm-прайс-${FILE_PREFIX[domain]}-${new Date().toISOString().slice(0, 10)}.xlsx`
    )
  }

  return (
    <Button type="button" variant="outline" onClick={download}>
      <Download className="mr-2 h-4 w-4" />
      Скачать прайс
    </Button>
  )
}

export default WindowpriceDownloadButton
