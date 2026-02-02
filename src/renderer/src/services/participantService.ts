import { useAxiosInstance } from '@api/axiosInstance'
import type { IResponse } from '@interface/response.interface'
import type { IParticipant, IStats } from '@interface/participant.interface'
import type { AxiosResponse } from 'axios'

interface ParticipantService {
  getAllParticipant: (params?: object) => Promise<IResponse<IParticipant[], IStats[]>>
  getFilterParticipant: (params?: object) => Promise<IResponse<IParticipant[], IStats[]>>
  getDetailParticipant: (id: string) => Promise<IResponse<IParticipant>>
  createParticipant: (data: FormData) => Promise<IResponse>
  updateParticipant: (id: string, data: FormData) => Promise<IResponse>
  deleteParticipant: (id: string) => Promise<IResponse>
}

const ParticipantService = (): ParticipantService => {
  const axiosInstance = useAxiosInstance()

  const getAllParticipant = async (
    params?: object
  ): Promise<IResponse<IParticipant[], IStats[]>> => {
    try {
      const response: AxiosResponse<IResponse<IParticipant[], IStats[]>> = await axiosInstance.get(
        `/participant`,
        { params }
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getFilterParticipant = async (
    params?: object
  ): Promise<IResponse<IParticipant[], IStats[]>> => {
    try {
      const response: AxiosResponse<IResponse<IParticipant[], IStats[]>> = await axiosInstance.get(
        `/participant/filter`,
        { params }
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getDetailParticipant = async (id: string): Promise<IResponse<IParticipant>> => {
    try {
      const response: AxiosResponse<IResponse<IParticipant>> = await axiosInstance.get(
        `/participant/${id}`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const createParticipant = async (data: FormData): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(`/participant`, data)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const updateParticipant = async (id: string, data: FormData): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(`/participant/${id}`, data)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const deleteParticipant = async (id: string): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.delete(`/participant/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    getAllParticipant,
    getFilterParticipant,
    getDetailParticipant,
    createParticipant,
    updateParticipant,
    deleteParticipant
  }
}

export default ParticipantService
