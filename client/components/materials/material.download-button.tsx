import React from 'react'
import { useSelector } from 'react-redux'
import * as XLSX from 'xlsx'
import { Download } from 'lucide-react'
import { Button } from '../ui/button'
import { deleteKeys } from '../../scenes/Shinomotazh.prices/Shinomontazh.prices.donwload'
import type { IMaterials } from '../../../common/types/generated/Materials'

const MaterialDownloadButton = () => {
  const data = useSelector((s: { materials: { list: IMaterials[] } }) => s.materials.list)

  const download = () => {
    const array: Partial<IMaterials>[] = []

    if (data?.length) {
      ;[...data]
        .sort((a, b) => a.type.localeCompare(b.type))
        .forEach((item) => {
          array.push(deleteKeys({ ...item }, ['id', '_id', '__v', 'date']))
        })
    }

    const worksheet = XLSX.utils.json_to_sheet(array)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Прайс')

    XLSX.writeFile(workbook, `crm-прайс-материалы-${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  return (
    <Button type="button" variant="outline" onClick={download}>
      <Download className="mr-2 h-4 w-4" />
      Скачать прайс
    </Button>
  )
}

export default MaterialDownloadButton
