// src/hooks/useTableInstance.ts
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type TableOptions,
  type SortingState
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'

interface UseTableInstanceProps<TData> {
  data: TData[]
  columns: TableOptions<TData>['columns']
  totalRows: number
  pagination: {
    page: number
    limit: number
  }
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
}

export const useTableInstance = <TData>({
  data,
  columns,
  totalRows,
  pagination,
  sorting,
  setSorting
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
}: UseTableInstanceProps<TData>) => {
  // optional: simpan ukuran kolom di localStorage
  const [columnSizing, setColumnSizing] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('tableSizing')
    return saved ? JSON.parse(saved) : {}
  })

  useEffect(() => {
    localStorage.setItem('tableSizing', JSON.stringify(columnSizing))
  }, [columnSizing])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: 'onChange',
    enableColumnResizing: true,
    manualPagination: true,
    rowCount: totalRows,
    state: {
      sorting,
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.limit
      },
      columnSizing
    },
    onColumnSizingChange: setColumnSizing
  })

  return table
}
