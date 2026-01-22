import { useAxiosInstance } from '@api/axiosInstance'
import type { IResponse } from '@interface/response.interface'
import type { ILogScoring, IPayloadLogScoring } from '@interface/logScoring.interface'
import type { AxiosResponse } from 'axios'

interface LogScoringService {
  getAllLogScoring: (params?: object) => Promise<IResponse<ILogScoring[]>>
  getDetailLogScoring: (id: string) => Promise<IResponse<ILogScoring>>
  createLogScoring: (data: IPayloadLogScoring) => Promise<IResponse>
  updateLogScoring: (id: string, data: IPayloadLogScoring) => Promise<IResponse>
  deleteLogScoring: (id: number) => Promise<IResponse>
}

const LogScoringService = (): LogScoringService => {
  const axiosInstance = useAxiosInstance()

  const getAllLogScoring = async (params?: object): Promise<IResponse<ILogScoring[]>> => {
    try {
      const response: AxiosResponse<IResponse<ILogScoring[]>> = await axiosInstance.get(
        `/log-scoring`,
        {
          params
        }
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getDetailLogScoring = async (id: string): Promise<IResponse<ILogScoring>> => {
    try {
      const response: AxiosResponse<IResponse<ILogScoring>> = await axiosInstance.get(
        `/log-scoring/${id}`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const createLogScoring = async (data: IPayloadLogScoring): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(`/log-scoring`, data)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const updateLogScoring = async (id: string, data: IPayloadLogScoring): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(`/log-scoring/${id}`, data)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const deleteLogScoring = async (id: number): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.delete(`/log-scoring/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    getAllLogScoring,
    getDetailLogScoring,
    createLogScoring,
    updateLogScoring,
    deleteLogScoring
  }
}

export default LogScoringService
