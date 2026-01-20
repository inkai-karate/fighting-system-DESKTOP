import { useAxiosInstance } from '@api/axiosInstance'
import type { IResponse } from '@interface/response.interface'
import type { AxiosError } from 'axios'
import { LoggerService } from './loggerService'
import { IUser } from '@renderer/interface/user.interface'

interface UserService {
  getProfile: () => Promise<IResponse<IUser>>
}

const UserService = (): UserService => {
  const axiosInstance = useAxiosInstance()

  const getProfile = async (): Promise<IResponse<IUser>> => {
    try {
      const response = await axiosInstance.get<IResponse<IUser>>(`/user/profile`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('UserService.getProfile', 'Gagal mendapatkan profil', {
        request: '/user/profile',
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  return {
    getProfile
  }
}

export default UserService
