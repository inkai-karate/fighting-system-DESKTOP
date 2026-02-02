import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { useIndex } from './hook/useIndex'
import { Plus, Calendar, MapPin, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useBreadcrumbStore from '@store/breadCrumb.store'
import { JSX, useEffect } from 'react'
import { MyAlertDialog } from '@renderer/components/core/MyAlertDialog'
import { formatDate } from '@utils/myFunctions'
import type { IEvent } from '@interface/event.interface'
import { statusEvent } from '@renderer/utils/optionsData'

export const EventPage: React.FC = () => {
  const { setBreadcrumb, setTitle } = useBreadcrumbStore()

  const navigate = useNavigate()
  const {
    data,
    loading,
    handleSearch,
    totalRows,
    pagination,
    handlePageChange,
    handleLimitChange,
    totalPages,
    getTitlePage,
    confirmDelete,
    handleDeleteData,
    setConfirmDelete
  } = useIndex()

  useEffect(() => {
    setBreadcrumb([
      { label: 'Dashboard', path: '/system' },
      { label: getTitlePage(), path: `/system/${getTitlePage('path')}` }
    ])
    setTitle('Dashboard')
  }, [])

  const EventCard = ({ event }: { event: IEvent }): JSX.Element => {
    return (
      <div
        onClick={() => navigate(`detail/${event.uuid}`)}
        className="cursor-pointer bg-white dark:bg-slate-800 rounded-b-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200"
      >
        {/* Status Stripe */}
        <div className={`h-1 w-full ${statusEvent[event.status]?.bgcolor || 'bg-gray-300'}`}></div>

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1">
                {event.name}
              </h3>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  statusEvent[event.status]?.className || 'bg-gray-100 text-gray-600'
                }`}
              >
                {statusEvent[event.status]?.label || 'Unknown'}
              </span>
            </div>
          </div>

          {/* Quick Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 shrink-0" />
              <span className="truncate text-xs">
                {formatDate(event.start_date)} - {formatDate(event.end_date)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="truncate text-xs">{event.location}</span>
            </div>
          </div>

          {/* Stats & Action */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {event._count?.brackets || 0}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Bracket</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    {event._count?.matches || 0}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Match</span>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              Lihat
              <Eye className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-5 lg:px-10 h-[calc(100vh-40px)] flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Daftar Event</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Kelola semua event dan turnamen Anda
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <Input
          placeholder="Cari event berdasarkan nama, lokasi, atau kode..."
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-md rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500/40 border-gray-300"
        />
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Menampilkan {data.length} dari {totalRows} event
        </p>
      </div>

      {/* Loading State */}
      {loading.fetchData ? (
        <div className="flex-1 overflow-auto pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse"
              >
                <div className="h-1 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="flex gap-2 pt-2">
                    <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : data.length > 0 ? (
        <>
          {/* Event Cards Grid (scrollable) */}
          <div className="flex-1 overflow-auto pr-4 pb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
              {data.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Halaman {pagination.page} dari {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Sebelumnya
                </Button>

                {/* Page Numbers */}
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1
                    } else if (pagination.page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = pagination.page - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.page === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={pagination.page === pageNum ? 'bg-blue-500' : ''}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === totalPages}
                >
                  Selanjutnya
                </Button>
              </div>

              {/* Items per page */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tampilkan:</span>
                <select
                  value={pagination.limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Belum ada event
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Mulai buat event pertama Anda untuk mengelola turnamen
          </p>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => navigate('tambah')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Event Pertama
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <MyAlertDialog
        open={confirmDelete.open}
        title="Konfirmasi Hapus"
        description="Apakah Anda yakin ingin menghapus event ini? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait termasuk bracket dan match."
        confirmText="Hapus"
        confirmColor="bg-red-600 hover:bg-red-700 text-white"
        onConfirm={() => confirmDelete.id && handleDeleteData(confirmDelete.id)}
        onOpenChange={(open) => setConfirmDelete({ open, id: null })}
      />
    </div>
  )
}
