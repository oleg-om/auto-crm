import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

const COLUMNS = ['name', 'type', 'category', 'number', 'free', 'R13', 'R14', 'R15']

const EXAMPLE_ROWS: string[][] = [
  ['Осмотр покрышки', 'legk', 'sedan', '1', 'no', '20', '25', '30'],
  ['Комплекс монтаж 4 колёс', 'legk', 'crossover', '2', 'yes', '1200', '1300', '1400'],
  ['Чистка диска (мойка колеса)', 'legk', 'runflat', '3', 'no', '50', '60', '70']
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
