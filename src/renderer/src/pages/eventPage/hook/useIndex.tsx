import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDebounce } from '@uidotdev/usehooks'
import { AxiosError } from 'axios'
import { optionInitialLimit, timeDebounce } from '@utils/optionsData'
import type { IErrorResponse } from '@interface/response.interface'
import type { IPagination, PageType } from '@interface/config.interface'
import { toastMessage } from '@utils/optionsData'
import EventService from '@renderer/services/eventService'
import { IEvent } from '@renderer/interface/event.interface'
import { toast } from 'sonner'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useIndex = () => {
  const getTitlePage = (type: PageType = 'title'): string => {
    const titlePage = 'Event'
    switch (type) {
      case 'title':
        return titlePage
      case 'sub':
        return titlePage.toLowerCase()
      case 'path':
        return 'event'
      default:
        return titlePage
    }
  }

  const eventService = EventService()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialPage = Number(searchParams.get('page')) || 1
  const initialLimit = Number(searchParams.get('limit')) || optionInitialLimit
  const initialSearch = searchParams.get('search') || ''

  const [data, setData] = useState<IEvent[]>([])
  const [totalRows, setTotalRows] = useState(0)
  const [search, setSearch] = useState(initialSearch)
  const debouncedSearch = useDebounce(search, timeDebounce)

  const [pagination, setPagination] = useState<IPagination>({
    page: initialPage,
    limit: initialLimit
  })

  const totalPages = Math.ceil(totalRows / pagination.limit) || 1

  const [loading, setLoading] = useState({
    fetchData: false,
    deleteData: false
  })

  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean
    id: string | null
  }>({
    open: false,
    id: null
  })

  // Sinkronisasi URL params dengan state
  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || optionInitialLimit
    const searchParam = searchParams.get('search') || ''

    setPagination({ page, limit })
    setSearch(searchParam)
  }, [searchParams])

  const handlePageChange = (newPage: number): void => {
    setSearchParams({
      page: newPage.toString(),
      limit: pagination.limit.toString(),
      search: debouncedSearch
    })
  }

  const handleLimitChange = (newLimit: number): void => {
    setSearchParams({
      page: '1',
      limit: newLimit.toString(),
      search: debouncedSearch
    })
  }

  useEffect(() => {
    fetchData()
  }, [debouncedSearch, pagination.page, pagination.limit])

  const fetchData = async (): Promise<void> => {
    try {
      setLoading((p) => ({ ...p, fetchData: true }))
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch
      }

      const response = await eventService.getAllEvent(params)

      if (response.success) {
        setData(response.data || [])
        setTotalRows(response.meta?.total || 0)
      }
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>
      const { title, desc } = toastMessage.loadError(getTitlePage('sub'))
      const message = axiosError.response?.data?.message || desc
      toast.error(title, {
        description: `${message}`
      })
    } finally {
      setLoading((p) => ({ ...p, fetchData: false }))
    }
  }

  const handleSearch = (value: string): void => {
    setSearchParams({
      page: '1',
      limit: pagination.limit.toString(),
      search: value
    })
  }

  const handleDeleteData = async (id: string): Promise<void> => {
    try {
      setLoading((p) => ({ ...p, deleteData: true }))
      const response = await eventService.deleteEvent(id)

      if (response.success) {
        const { title, desc } = toastMessage.deleteSuccess(getTitlePage('sub'))
        toast.success(title, {
          description: response.message || desc
        })
        await fetchData()
      }
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>
      const { title, desc } = toastMessage.deleteError(getTitlePage('sub'))
      toast.error(title, {
        description: axiosError.response?.data?.message || desc
      })
    } finally {
      setLoading((p) => ({ ...p, deleteData: false }))
      setConfirmDelete({ open: false, id: null })
    }
  }

  return {
    data,
    totalRows,
    pagination,
    loading,
    handleSearch,
    handleDeleteData,
    fetchData,
    handlePageChange,
    handleLimitChange,
    confirmDelete,
    setConfirmDelete,
    totalPages,
    getTitlePage
  }
}
