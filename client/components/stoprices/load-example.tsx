import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

const COLUMNS = [
  'name',
  'type',
  'category',
  'number',
  'free',
  'R210107first',
  'foreignFirst',
  'cardAmbulanceOur',
  'minGazel'
]

const EXAMPLE_ROWS: string[][] = [
  ['Развал-схождение', 'rus', 'Развал-схождение', '1', 'no', '800', '', '', ''],
  ['Развал-схождение', 'foreign', 'Развал-схождение', '2', 'no', '', '1200', '', ''],
  ['Скорая помощь', 'card', 'Основное', '3', 'yes', '', '', '600', '']
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
