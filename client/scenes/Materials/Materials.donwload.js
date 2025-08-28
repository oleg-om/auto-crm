import React from 'react'
import { useSelector } from 'react-redux'
import XLSX from 'xlsx'
import cx from 'classnames'
import { deleteKeys } from '../Shinomotazh.prices/Shinomontazh.prices.donwload'

const MaterialricesDonwnload = () => {
  const data = useSelector((s) => s.materials.list)

  const download = () => {
    const array = []

    if (data?.length) {
      data
        .sort((a, b) => a.type.localeCompare(b.type))
        .forEach((item) => {
          array.push(deleteKeys(item, ['id', '_id', '__v', 'date']))
        })
    }

    const worksheet = XLSX.utils.json_to_sheet(array)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Прайс')

    XLSX.writeFile(workbook, `crm-прайс-материалы-${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  return (
    <button
      className={cx(
        'my-1 py-1 mr-2 px-3 text-white hover:text-white rounded-lg bg-orange-500 text-base hover:bg-orange-700'
      )}
      onClick={download}
      type="button"
    >
      Скачать прайс
    </button>
  )
}

export default MaterialricesDonwnload
