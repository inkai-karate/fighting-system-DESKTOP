import { useAxiosInstance } from '@api/axiosInstance'
import type {
  IPayloadLogin,
  IResponseLogin,
  PayloadChangePassword,
  IResponseTokenValidation
} from '@interface/auth.interface'
import type { IResponse } from '@interface/response.interface'
import type { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { LoggerService } from './loggerService'

interface AuthService {
  loginAuth: (data: IPayloadLogin) => Promise<IResponse<IResponseLogin>>
  changePassword: (data: PayloadChangePassword) => Promise<IResponse>
  validateToken: (token: string) => Promise<IResponseTokenValidation>
  logout: () => void
}

const AuthService = (): AuthService => {
  const axiosInstance = useAxiosInstance()
  const navigate = useNavigate()

  const userLogin = localStorage.getItem('userLogin')
  const userData = userLogin ? JSON.parse(userLogin) : null

  const loginAuth = async (data: IPayloadLogin): Promise<IResponse<IResponseLogin>> => {
    try {
      const response = await axiosInstance.post<IResponse<IResponseLogin>>(`/auth/login`, data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('AuthService.loginAuth', 'Gagal login', {
        request: '/auth/login',
        payload: data,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const changePassword = async (data: PayloadChangePassword): Promise<IResponse> => {
    try {
      const response = await axiosInstance.post<IResponse>(`/auth/change-password`, data, {
        headers: {
          authorization: `Bearer ${userData?.token}`
        }
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const validateToken = async (token: string): Promise<IResponseTokenValidation> => {
    try {
      const response = await axiosInstance.get<IResponseTokenValidation>(`/auth/verify-token`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    localStorage.removeItem('userLogin')
    navigate('/cmsadmin/login')
    await LoggerService.info('Logout Berhasil', 'user melakukan logout')
  }

  return {
    loginAuth,
    logout,
    validateToken,
    changePassword
  }
}

export default AuthService
