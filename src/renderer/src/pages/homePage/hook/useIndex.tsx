import { IMatch } from '@renderer/interface/match.interface'
import { IErrorResponse } from '@renderer/interface/response.interface'
import { IStaff } from '@renderer/interface/staff.interface'
import MatchService from '@renderer/services/matchService'
import UserService from '@renderer/services/userService'
import { toastMessage } from '@renderer/utils/optionsData'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useIndex = () => {
  const navigate = useNavigate()
  const matchService = MatchService()
  const userService = UserService()

  const [dataStaff, setDataStaff] = useState<IStaff | null>(null)
  const [dataMatch, setDataMatch] = useState<IMatch[]>([])
  const [loading, setLoading] = useState({
    fetchDetailUser: false,
    fetchMatch: false
  })
  const [temp, setTemp] = useState('initial')

  useEffect(() => {
    const fetchUserDetail = async (): Promise<void> => {
      try {
        setLoading({ ...loading, fetchDetailUser: true })
        const response = await userService.getProfile()
        if (response.success) {
          setDataStaff(response.data?.staff || null)
          fetchMatch(response.data?.staff?.id.toString() || '')
        }
      } catch (error) {
        const axiosError = error as AxiosError<IErrorResponse>
        const errorData = axiosError.response?.data?.message
        const { title, desc } = toastMessage.loadError('staff')
        toast.error(title, {
          description: errorData || desc
        })
      } finally {
        setLoading({ ...loading, fetchDetailUser: false })
      }
    }

    const fetchMatch = async (staffId: string): Promise<void> => {
      try {
        setLoading({ ...loading, fetchMatch: true })
        const params = {
          status: 'ONGOING, SCHEDULED'
        }
        const response = await matchService.getMatchesByReferee(staffId, params)
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
    fetchUserDetail()
  }, [])

  useEffect(() => {
    console.log('🎯 Scoring Display mounted, setting up listener...')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMessageFromMain = (data: any): void => {
      console.log('📩 Scoring window received message from main:', data)
      setTemp(data.type)
      if (data.type === 'SCORING_DISPLAY') {
        navigate(`/scoring/mirror/${data.matchId}`)
        window.api?.sendToMain({
          type: 'SCORING_DISPLAY',
          message: 'Hello from Scoring Display Window!',
          matchId: data.matchId,
          timestamp: new Date().toISOString()
        })
      }
      if (data.type === 'WAITING_DISPLAY') {
        navigate(`/waiting`)
        window.api?.sendToMain({
          type: 'WAITING_DISPLAY',
          message: 'Hello from Waiting Window!',
          matchId: data.matchId,
          timestamp: new Date().toISOString()
        })
      }

      if (data.type === 'PONG') {
        console.log('✅ Received PONG from main:', data.message)
      }
    }

    // Register listener
    window.api?.onMessageFromMain(handleMessageFromMain)
    console.log('✅ Listener registered')

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up listener')
      window.api?.removeMessageListener()
    }
  }, [])

  return {
    dataMatch,
    dataStaff,
    loading,
    temp
  }
}
