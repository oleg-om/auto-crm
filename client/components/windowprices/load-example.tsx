import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

const COLUMNS = ['name', 'type', 'category', 'number', 'free', 'price']

const EXAMPLE_ROWS: string[][] = [
  ['Лобовое стекло (замена)', 'legk', 'Седан, Хетчбек', '1', 'no', '3500'],
  ['Лобовое стекло с датчиком дождя', 'legk', 'Кроссоверы', '2', 'yes', '4200']
]

const LoadExample = () => (
  <div className="overflow-x-auto rounded-lg">
    <Table className="min-w-[560px]">
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
