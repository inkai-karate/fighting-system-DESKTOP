import { useTableInstance } from '@components/core/useTableDataInstance'
import { Badge } from '@components/ui/badge'
import { Button } from '@components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@components/ui/dropdown-menu'
import type { IPagination } from '@interface/config.interface'
import type { IParticipant, IStats } from '@interface/participant.interface'
import type { IErrorResponse } from '@interface/response.interface'
import type { IEvent } from '@interface/event.interface'
import ParticipantService from '@services/participantService'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { useDebounce } from '@uidotdev/usehooks'
import { formatGenderParticipant } from '@utils/myFunctions'
import { optionInitialLimit, statusPayment, timeDebounce, toastMessage } from '@utils/optionsData'
import type { AxiosError } from 'axios'
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import { toast } from 'sonner'

interface UseParticipantProps {
  eventData: IEvent | null
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useParticipant = ({ eventData }: UseParticipantProps) => {
  const participantService = ParticipantService()

  const [participants, setParticipants] = useState<IParticipant[]>([])
  const [statsParticipants, setStatsParticipants] = useState<IStats[]>([])

  const [editingParticipant, setEditingParticipant] = useState<IParticipant | null>(null)
  const [editParticipantOpen, setEditParticipantOpen] = useState(false)

  const [confirmDeleteParticipant, setConfirmDeleteParticipant] = useState<{
    open: boolean
    id: string | null
  }>({
    open: false,
    id: null
  })

  const [loading, setLoading] = useState({
    fetchParticipantEvent: false,
    deleteParticipant: false,
    updateParticipant: false
  })

  const [searchParamsParticipant, setSearchParamsParticipant] = useSearchParams()
  const [sorting, setSorting] = useState<SortingState>([])

  const initialPage = Number(searchParamsParticipant.get('page')) || 1
  const initialLimit = Number(searchParamsParticipant.get('limit')) || optionInitialLimit
  const initialSearch = searchParamsParticipant.get('search') || ''

  const [totalRowsParticipant, setTotalRowsParticipant] = useState(0)
  const [searchParticipant, setSearchParticipant] = useState(initialSearch)
  const debouncedSearch = useDebounce(searchParticipant, timeDebounce)

  const [paginationParticipant, setPaginationParticipant] = useState<IPagination>({
    page: initialPage,
    limit: initialLimit
  })

  const totalPagesParticipant = Math.ceil(totalRowsParticipant / paginationParticipant.limit) || 1

  // Sync URL params with state
  useEffect(() => {
    const page = Number(searchParamsParticipant.get('page')) || 1
    const limit = Number(searchParamsParticipant.get('limit')) || optionInitialLimit
    const searchParam = searchParamsParticipant.get('search') || ''

    setPaginationParticipant({ page, limit })
    setSearchParticipant(searchParam)
  }, [searchParamsParticipant])

  // Fetch participants when dependencies change
  useEffect(() => {
    if (eventData?.id) {
      fetchParticipantEvent()
    }
  }, [debouncedSearch, paginationParticipant.page, paginationParticipant.limit, eventData?.id])

  const handlePageChangeParticipant = (newPage: number): void => {
    setSearchParamsParticipant({
      page: newPage.toString(),
      limit: paginationParticipant.limit.toString(),
      search: debouncedSearch
    })
  }

  const handleLimitChangeParticipant = (newLimit: number): void => {
    setSearchParamsParticipant({
      page: '1',
      limit: newLimit.toString(),
      search: debouncedSearch
    })
  }

  const fetchParticipantEvent = async (eventIdParam?: number): Promise<void> => {
    const idToUse = eventIdParam || eventData?.id
    if (!idToUse) return

    try {
      setLoading((prev) => ({ ...prev, fetchParticipantEvent: true }))
      const params = {
        page: paginationParticipant.page,
        limit: paginationParticipant.limit,
        search: debouncedSearch,
        event_id: idToUse
      }

      const response = await participantService.getAllParticipant(params)

      if (response.success && response.data) {
        const participantList = Array.isArray(response.data) ? response.data : [response.data]
        setParticipants(participantList)
        setStatsParticipants(response.stats || [])

        // Set total rows if available in response
        if (response.meta?.total !== undefined) {
          setTotalRowsParticipant(response.meta?.total)
        } else {
          setTotalRowsParticipant(participantList.length)
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>
      const { title, desc } = toastMessage.loadDetailError('Peserta')
      const message = axiosError.response?.data?.message || desc
      toast.error(title, {
        description: `${message}`
      })
    } finally {
      setLoading((prev) => ({ ...prev, fetchParticipantEvent: false }))
    }
  }

  const handleDeleteDataParticipant = async (id: string): Promise<void> => {
    try {
      setLoading((p) => ({ ...p, deleteParticipant: true }))
      const response = await participantService.deleteParticipant(id)

      if (response.success) {
        const { title, desc } = toastMessage.deleteSuccess('Peserta')
        toast.success(title, { description: response.message || desc })
        await fetchParticipantEvent()
      }
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>
      const { title, desc } = toastMessage.deleteError('Peserta')
      toast.error(title, { description: axiosError.response?.data?.message || desc })
    } finally {
      setLoading((p) => ({ ...p, deleteParticipant: false }))
      setConfirmDeleteParticipant({ open: false, id: null })
    }
  }

  const openEditParticipant = (participant: IParticipant): void => {
    setEditingParticipant(participant)
    setEditParticipantOpen(true)
  }

  const handleUpdateParticipant = async (payload: FormData): Promise<boolean> => {
    if (!editingParticipant?.uuid) {
      toast.error('Error', { description: 'Peserta tidak ditemukan' })
      return false
    }

    try {
      setLoading((p) => ({ ...p, updateParticipant: true }))

      const response = await participantService.updateParticipant(editingParticipant.uuid, payload)

      if (response.success) {
        const { title, desc } = toastMessage.updateSuccess('Peserta')
        toast.success(title, { description: response.message || desc })
        setEditParticipantOpen(false)
        setEditingParticipant(null)
        await fetchParticipantEvent()
        return true
      } else {
        toast.error('Error', { description: response.message || 'Gagal update peserta' })
        return false
      }
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>
      const { title, desc } = toastMessage.updateError('Peserta')
      toast.error(title, { description: axiosError.response?.data?.message || desc })
      return false
    } finally {
      setLoading((p) => ({ ...p, updateParticipant: false }))
    }
  }

  const columnsParticipants: ColumnDef<IParticipant>[] = [
    {
      accessorKey: 'name',
      header: () => 'No',
      cell: ({ row }) => <span>{row.index + 1}</span>
    },
    {
      accessorKey: 'category',
      header: () => (
        <Button variant="ghost" className="text-white font-semibold hover:bg-transparent">
          Foto
        </Button>
      ),
      cell: ({ row }) => (
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={row.original.media.length > 0 ? row.original.media[0].url : ''}
            alt={row.original.full_name}
          />
          <AvatarFallback>
            {row.original.full_name ? row.original.full_name.charAt(0) : '?'}
          </AvatarFallback>
        </Avatar>
      ),
      size: 50
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-white font-semibold hover:bg-transparent"
        >
          Nama Peserta
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-60 text-white" />
        </Button>
      ),
      cell: ({ row }) => (
        <button
          onClick={() => openEditParticipant(row.original)}
          className="text-blue-600 font-medium hover:underline hover:text-blue-600 transition-colors text-left"
        >
          {row.original.full_name}
        </button>
      )
    },
    {
      accessorKey: 'category',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-white font-semibold hover:bg-transparent"
        >
          Kategori
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-60 text-white" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.category?.event_category?.name || '-'}</span>,
      size: 300
    },
    {
      accessorKey: 'class',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-white font-semibold hover:bg-transparent"
        >
          Kelas
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-60 text-white" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.category?.name || '-'}</span>,
      size: 300
    },
    {
      accessorKey: 'gender',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-white font-semibold hover:bg-transparent"
        >
          Gender
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-60 text-white" />
        </Button>
      ),
      cell: ({ row }) => <span>{formatGenderParticipant(row.original.gender || '')}</span>,
      size: 300
    },
    {
      accessorKey: 'payment_status',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-white font-semibold hover:bg-transparent"
        >
          Status Pembayaran
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-60 text-white" />
        </Button>
      ),
      cell: ({ row }) => (
        <Badge
          variant="default"
          className={statusPayment[row.original.payment_status]?.className || ''}
        >
          {statusPayment[row.original.payment_status]?.label || 'Unknown'}
        </Badge>
      ),
      size: 120
    },
    {
      size: 50,
      id: 'actions',
      header: () => <div className="text-white font-semibold hover:bg-transparent">Aksi</div>,
      cell: ({ row }) => {
        const participant = row.original
        return (
          <div className="w-[30px] text-left">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <MoreHorizontal size={256} strokeWidth={3} className="text-blue-500 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
              >
                <DropdownMenuItem
                  onClick={() => openEditParticipant(participant)}
                  className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <Pencil className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    setConfirmDeleteParticipant({
                      open: true,
                      id: participant.uuid
                    })
                  }
                  className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      }
    }
  ]

  const tableParticipant = useTableInstance({
    data: participants,
    columns: columnsParticipants,
    totalRows: totalRowsParticipant,
    pagination: paginationParticipant,
    sorting,
    setSorting
  })

  return {
    loading,
    paginationParticipant,
    participants,
    tableParticipant,
    totalRowsParticipant,
    setTotalRowsParticipant,
    columnsParticipants,
    setSearchParticipant,
    totalPagesParticipant,
    handlePageChangeParticipant,
    handleLimitChangeParticipant,
    confirmDeleteParticipant,
    setConfirmDeleteParticipant,
    handleDeleteDataParticipant,
    editParticipantOpen,
    setEditParticipantOpen,
    editingParticipant,
    setEditingParticipant,
    updateParticipantLoading: loading.updateParticipant,
    openEditParticipant,
    handleUpdateParticipant,
    fetchParticipantEvent,
    statsParticipants
  }
}
