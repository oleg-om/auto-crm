import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

const COLUMNS = [
  'Название',
  'Направление',
  'Категория',
  'Порядковый номер',
  'Акция',
  'Легковые',
  'Паркетник',
  'Джип'
]

const EXAMPLE_ROWS: string[][] = [
  ['Комплекс (кузов + диски)', 'Легковые', 'Седан, Хетчбек', '1', 'Нет', '400', '450', '500'],
  ['Экспресс мойка', 'Легковые', 'Кроссоверы', '2', 'Да', '250', '280', '320'],
  ['Мойка кузова', 'Грузовые', 'Основное', '1', 'Нет', '', '', '']
]

const LoadExample = () => (
  <div className="overflow-x-auto rounded-lg">
    <Table className="min-w-[640px]">
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
