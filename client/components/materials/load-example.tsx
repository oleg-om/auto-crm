import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

const COLUMNS = ['name', 'artikul', 'price', 'quantity', 'type', 'category', 'free', 'plus']

const EXAMPLE_ROWS: string[][] = [
  [
    'Вентиль PVR-32',
    'PVR-32',
    '120',
    '8',
    'shinomontazh',
    'Вентили для легковых автомобилей',
    'no',
    'no'
  ],
  [
    'Латка унив. PU-35 (35 мм)',
    'PU-35',
    '50',
    '146',
    'shinomontazh',
    'Латки универсальные',
    'yes',
    'no'
  ],
  [
    'Бутылка с пенообразователем LERATON 150мл',
    'PS-002.100',
    '50',
    '12',
    'moika',
    'Химия',
    'no',
    'yes'
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
