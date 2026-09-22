// `xlsx-js-style` is a drop-in fork of `xlsx` (SheetJS) that also writes cell styles, which plain
// `xlsx` silently drops. It's used only here (export); imports keep reading with plain `xlsx`.
import * as XLSX from 'xlsx-js-style'
import { IPriceExcelConfig, excelHeaders, toExcelRows } from './price-excel'

const MIN_COL_WIDTH = 10
const MAX_COL_WIDTH = 45

const HEADER_STYLE = {
  font: { bold: true, color: { rgb: 'FF000000' } },
  fill: { fgColor: { rgb: 'FFD9D9D9' } },
  alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  border: {
    top: { style: 'thin', color: { rgb: 'FF9CA3AF' } },
    bottom: { style: 'thin', color: { rgb: 'FF9CA3AF' } },
    left: { style: 'thin', color: { rgb: 'FF9CA3AF' } },
    right: { style: 'thin', color: { rgb: 'FF9CA3AF' } }
  }
}

/** Builds and saves a price workbook: styled header row, sized columns, autofilter. */
const downloadPriceWorkbook = (
  items: Record<string, unknown>[],
  config: IPriceExcelConfig,
  fileName: string
) => {
  const headers = excelHeaders(config)
  const rows = toExcelRows(items, config)
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers })

  headers.forEach((header, index) => {
    const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: index })]
    if (cell) cell.s = HEADER_STYLE
  })

  worksheet['!cols'] = headers.map((header) => {
    const longest = rows.reduce((max, row) => Math.max(max, String(row[header] ?? '').length), 0)
    // header wraps, so it only needs to fit its longest word-ish part, not the whole text
    const headerWidth = Math.min(header.length, 20)
    return { wch: Math.min(MAX_COL_WIDTH, Math.max(MIN_COL_WIDTH, headerWidth + 2, longest + 2)) }
  })
  worksheet['!rows'] = [{ hpt: 32 }]
  if (rows.length) {
    worksheet['!autofilter'] = {
      ref: XLSX.utils.encode_range({
        s: { r: 0, c: 0 },
        e: { r: rows.length, c: headers.length - 1 }
      })
    }
  }

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Прайс')
  XLSX.writeFile(workbook, fileName)
}

export default downloadPriceWorkbook
