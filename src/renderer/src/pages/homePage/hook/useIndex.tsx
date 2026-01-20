import { IMatch } from '@renderer/interface/match.interface'
import { IErrorResponse } from '@renderer/interface/response.interface'
import { IStaff } from '@renderer/interface/staff.interface'
import MatchService from '@renderer/services/matchService'
import UserService from '@renderer/services/userService'
import { toastMessage } from '@renderer/utils/optionsData'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useIndex = () => {
  const matchService = MatchService()
  const userService = UserService()

  const [dataStaff, setDataStaff] = useState<IStaff | null>(null)
  const [dataMatch, setDataMatch] = useState<IMatch[]>([])
  const [loading, setLoading] = useState({
    fetchDetailUser: false,
    fetchMatch: false
  })

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
        const response = await matchService.getMatchesByReferee(staffId)
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

  return {
    dataMatch,
    dataStaff,
    loading
  }
}
