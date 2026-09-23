import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

const COLUMNS = [
  'Название',
  'Артикул',
  'Цена',
  'Количество',
  'Направление',
  'Категория',
  'Акция',
  'Цифра 8'
]

const EXAMPLE_ROWS: string[][] = [
  [
    'Вентиль PVR-32',
    'PVR-32',
    '120',
    '8',
    'Шиномонтаж',
    'Вентили для легковых автомобилей',
    'Нет',
    'Нет'
  ],
  [
    'Латка унив. PU-35 (35 мм)',
    'PU-35',
    '50',
    '146',
    'Шиномонтаж',
    'Латки универсальные',
    'Да',
    'Нет'
  ],
  [
    'Бутылка с пенообразователем LERATON 150мл',
    'PS-002.100',
    '50',
    '12',
    'Автомойка',
    'Химия',
    'Нет',
    'Да'
  ]
]

const LoadExample = () => (
  <div className="overflow-x-auto rounded-lg">
    <Table className="min-w-[720px]">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {COLUMNS.map((it) => (
            <TableHead key={it}>{it}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {EXAMPLE_ROWS.map((row) => (
          <TableRow key={row[1]} className="bg-white">
            {row.map((cell, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <TableCell key={`${row[1]}-${index}`} className="truncate">
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)

export default LoadExample
