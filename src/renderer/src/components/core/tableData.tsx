import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/ui/table'
import { flexRender, type ColumnDef, type Table as TableInstance } from '@tanstack/react-table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import type { IPagination } from '@interface/config.interface'
import { Button } from '@components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { optionsPagination } from '@renderer/utils/optionsData'

interface TableComponentProps<IData> {
  table: TableInstance<IData>
  data: IData[]
  columns: ColumnDef<IData>[]
  loading: { fetchData: boolean }
  totalRows: number
  pagination: IPagination
  handlePageChange: (newPage: number) => void
  handleLimitChange: (newLimit: number) => void
  totalPages: number
  withPagiantion?: boolean
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function TableComponent<TData>({
  table,
  data,
  columns,
  loading,
  pagination,
  handlePageChange,
  handleLimitChange,
  totalPages,
  withPagiantion = true
}: TableComponentProps<TData>) {
  return (
    <>
      <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-neutral-900 transition-colors duration-300">
        {loading.fetchData && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-700 text-white">
              {table.getHeaderGroups().map((headerGroup, index) => (
                <TableRow
                  key={index}
                  className="border-b dark:border-slate-700 hover:bg-transparent !hover:bg-transparent"
                >
                  {headerGroup.headers.map((header, index) => (
                    <TableHead
                      key={index}
                      className="text-sm font-semibold text-white py-4 px-2 relative select-none"
                      style={{
                        width: header.getSize(),
                        minWidth: header.column.columnDef.minSize ?? 0
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`absolute right-0 top-0 h-full w-[3px] cursor-col-resize 
          ${header.column.getIsResizing() ? 'bg-blue-500' : 'bg-transparent hover:bg-blue-400'}
        `}
                        />
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {data.length > 0
                ? table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={index}
                      className={`transition-colors duration-150 hover:bg-blue-50 dark:hover:bg-slate-700 ${
                        index % 2 === 0
                          ? 'bg-white dark:bg-neutral-900'
                          : 'bg-slate-50 dark:bg-slate-800'
                      }`}
                    >
                      {row.getVisibleCells().map((cell, index) => (
                        <TableCell
                          key={index}
                          style={{ width: cell.column.getSize() || '100px' }}
                          className="text-sm text-slate-700 dark:text-slate-100 py-4 px-5"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : !loading.fetchData && (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center h-32 text-slate-500 dark:text-slate-400 text-base"
                      >
                        Tidak ada hasil ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {withPagiantion && (
        <div className="flex items-center justify-between py-4 text-sm">
          <div className="flex items-center gap-2">
            <span>Total per page:</span>
            <Select
              value={pagination.limit.toString()}
              onValueChange={(value) => handleLimitChange(Number(value))}
            >
              <SelectTrigger className="w-20 h-8" style={{ height: '45px' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {optionsPagination.map((val, index) => (
                  <SelectItem className="h-[45px]" key={index} value={val.toString()}>
                    {val}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-6">
            <span>
              Page {pagination.page} of {totalPages}
            </span>

            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1 || loading.fetchData}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= totalPages || loading.fetchData}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
