import React from 'react'
import { useSelector } from 'react-redux'
import { Download } from 'lucide-react'
import { Button } from '../ui/button'
import downloadPriceWorkbook from '../../lib/price-excel-download'
import { materialExcelConfig } from '../../lib/price-excel-configs'
import type { IMaterials } from '../../../common/types/generated/Materials'

const MaterialDownloadButton = () => {
  const data = useSelector((s: { materials: { list: IMaterials[] } }) => s.materials.list)

  const download = () => {
    const array: Partial<IMaterials>[] = []

    if (data?.length) {
      ;[...data]
        .sort((a, b) => a.type.localeCompare(b.type))
        .forEach((item) => {
          array.push(item)
        })
    }

    downloadPriceWorkbook(
      array as Record<string, unknown>[],
      materialExcelConfig,
      `crm-прайс-материалы-${new Date().toISOString().slice(0, 10)}.xlsx`
    )
  }

  return (
    <Button type="button" variant="outline" onClick={download}>
      <Download className="mr-2 h-4 w-4" />
      Скачать прайс
    </Button>
  )
}

export default MaterialDownloadButton
