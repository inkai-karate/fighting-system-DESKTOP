import type { IBracket } from '@interface/bracket.interface'
import type { PageType } from '@interface/config.interface'
import type { IEvent } from '@interface/event.interface'
import type { IErrorResponse } from '@interface/response.interface'
import EventService from '@services/eventService'
import MatchService from '@services/matchService'
import { toastMessage } from '@utils/optionsData'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BracketService from '@renderer/services/bracketService'
import { toast } from 'sonner'
import { IMatch } from '@renderer/interface/match.interface'

export type MatchActionType = 'start' | 'finish' | 'cancel' | 'walkover' | 'assign_referee'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useDetail = () => {
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

  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const eventService = EventService()
  const bracketService = BracketService()
  const matchService = MatchService()

  const [eventData, setEventData] = useState<IEvent | null>(null)
  const [dataMatch, setDataMatch] = useState<IMatch[]>([])
  const [brackets, setBrackets] = useState<IBracket[]>([])
  const [selectedBracket, setSelectedBracket] = useState<IBracket | null>(null)

  const [loading, setLoading] = useState({
    fetchDetail: false,
    fetchBrackets: false,
    fetchMatch: false
  })

  const fetchDetailData = async (): Promise<void> => {
    if (!id) return
    try {
      setLoading((prev) => ({ ...prev, fetchDetail: true }))

      const response = await eventService.getDetailEvent(id)
      if (response.success) {
        const data = response.data as IEvent
        setEventData(data)
        await fetchMatch(data.id.toString())
        if (data.brackets && data.brackets.length > 0) {
          await fetchBrackets(data.id.toString())
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>
      const { title, desc } = toastMessage.loadDetailError(getTitlePage('sub'))
      const message = axiosError.response?.data?.message || desc
      toast.error(title, { description: message })
      navigate(-1)
    } finally {
      setLoading((prev) => ({ ...prev, fetchDetail: false }))
    }
  }

  useEffect(() => {
    fetchDetailData()
  }, [id])

  const fetchMatch = async (eventId: string): Promise<void> => {
    try {
      setLoading({ ...loading, fetchMatch: true })
      const userLogin = localStorage.getItem('userLogin')
      const userData = userLogin ? JSON.parse(userLogin) : null
      const params = {
        event_id: eventId
      }
      const response = await matchService.getMatchesByReferee(userData?.id, params)
      if (response.success) {
        setDataMatch(response.data || [])
      }
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>
      const errorData = axiosError.response?.data?.message
      const { title, desc } = toastMessage.loadError('staff')
      toast.error(title, {
        description: errorData || desc
      })
    } finally {
      setLoading({ ...loading, fetchMatch: false })
    }
  }

  const fetchBrackets = async (eventId: string): Promise<void> => {
    try {
      setLoading((prev) => ({ ...prev, fetchBrackets: true }))
      const params = { eventId: eventId }
      const response = await bracketService.getAllBracket(params)
      if (response.success && response.data) {
        const bracketList = Array.isArray(response.data) ? response.data : [response.data]
        setBrackets(bracketList)
        if (bracketList.length > 0) {
          if (selectedBracket) {
            const updated = bracketList.find((b) => b.id === selectedBracket.id)
            if (updated) {
              setSelectedBracket(updated)
            } else {
              setSelectedBracket(bracketList[0])
            }
          } else {
            setSelectedBracket(bracketList[0])
          }
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>
      const { title, desc } = toastMessage.loadDetailError(getTitlePage('sub'))
      const message = axiosError.response?.data?.message || desc
      toast.error(title, { description: message })
    } finally {
      setLoading((prev) => ({ ...prev, fetchBrackets: false }))
    }
  }

  const handleSelectBracket = (bracket: IBracket): void => {
    setSelectedBracket(bracket)
  }

  return {
    eventData,
    brackets,
    selectedBracket,
    loading,
    dataMatch,
    getTitlePage,
    handleSelectBracket,
    navigate
  }
}
