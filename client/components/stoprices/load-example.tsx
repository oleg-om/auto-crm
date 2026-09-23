import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

const COLUMNS = [
  'Название',
  'Направление',
  'Категория',
  'Порядковый номер',
  'Акция',
  'ВАЗ 2101-07 (1 кат)',
  'Иномарки (1 кат)',
  'Скорая (Газель)',
  'Минтранс (Прочее)',
  'Время, мин'
]

const EXAMPLE_ROWS: string[][] = [
  ['Развал-схождение', 'Отечественные', 'Развал-схождение', '1', 'Нет', '800', '', '', '', '30'],
  ['Развал-схождение', 'Иномарки', 'Развал-схождение', '2', 'Нет', '', '1200', '', '', '30'],
  ['Скорая помощь', 'Скорая помощь', 'Основное', '3', 'Да', '', '', '600', '', '']
]

const LoadExample = () => (
  <div className="overflow-x-auto rounded-lg">
    <Table className="min-w-[820px]">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {COLUMNS.map((it) => (
            <TableHead key={it}>{it}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {EXAMPLE_ROWS.map((row, rowIndex) => (
          // eslint-disable-next-line react/no-array-index-key
          <TableRow key={rowIndex} className="bg-white">
            {row.map((cell, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <TableCell key={`${rowIndex}-${index}`} className="truncate">
                {cell || '—'}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)

export default LoadExample
