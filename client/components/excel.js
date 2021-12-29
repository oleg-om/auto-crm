import React from 'react'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

const ExportCSV = ({ csvData, fileName }) => {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'
  const exportToCSV = (csvDatas, fileNames) => {
    const ws = XLSX.utils.json_to_sheet(csvDatas)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileNames + fileExtension)
  }
  return (
    <button
      type="button"
      onClick={() => exportToCSV(csvData, fileName)}
      className="bg-green-600 text-white p-3 rounded-md mt-5"
    >
      Выгрузить в ексель
    </button>
  )
}

export default ExportCSV
