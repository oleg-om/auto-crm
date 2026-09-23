import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

const COLUMNS = [
  'Название',
  'Направление',
  'Категория',
  'Порядковый номер',
  'Акция',
  'R13',
  'R14',
  'R15',
  'Время, мин'
]

const EXAMPLE_ROWS: string[][] = [
  ['Осмотр покрышки', 'Легковой', 'Седан, Хетчбек', '1', 'Нет', '20', '25', '30', '5'],
  [
    'Комплекс монтаж 4 колёс',
    'Легковой',
    'Кроссоверы, внедорожник, универсалы и микроавтобусы',
    '2',
    'Да',
    '1200',
    '1300',
    '1400',
    ''
  ],
  ['Чистка диска (мойка колеса)', 'Легковой', 'RUNFLAT', '3', 'Нет', '50', '60', '70', '10']
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
