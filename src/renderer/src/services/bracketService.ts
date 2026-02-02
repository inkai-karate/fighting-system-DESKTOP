import { useAxiosInstance } from '@api/axiosInstance'
import type { IResponse } from '@interface/response.interface'
import type { IBracket, IPayloadBracket } from '@interface/bracket.interface'
import type { AxiosResponse } from 'axios'
import type { IParticipant } from '@interface/participant.interface'

interface BracketService {
  getBracketsByEvent: (eventId?: string | number) => Promise<IResponse<IBracket[]>>
  getAllBracket: (params?: object) => Promise<IResponse<IBracket[]>>
  getBracketDetail: (uuid: string) => Promise<IResponse<IBracket>>
  generateBracket: (data: IPayloadBracket) => Promise<IResponse>
  reshuffleBracket: (bracketId: number | string) => Promise<IResponse>
  swapMatchParticipants: (matchId: number | string) => Promise<IResponse>
  assignMatchParticipants: (matchId: number | string) => Promise<IResponse>
  getAvailableParticipants: (params?: object) => Promise<IResponse<IParticipant[]>>
}

const BracketService = (): BracketService => {
  const axiosInstance = useAxiosInstance()

  const getBracketsByEvent = async (eventId?: string | number): Promise<IResponse<IBracket[]>> => {
    try {
      const params = eventId ? { eventId } : {}
      const response: AxiosResponse<IResponse<IBracket[]>> = await axiosInstance.get(`/bracket`, {
        params
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getBracketDetail = async (uuid: string): Promise<IResponse<IBracket>> => {
    try {
      const response: AxiosResponse<IResponse<IBracket>> = await axiosInstance.get(
        `/bracket/${uuid}`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getAllBracket = async (params?: object): Promise<IResponse<IBracket[]>> => {
    try {
      const response: AxiosResponse<IResponse<IBracket[]>> = await axiosInstance.get(`/bracket`, {
        params
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const generateBracket = async (data: IPayloadBracket): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(`/bracket/generate`, data)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const reshuffleBracket = async (bracketId: number | string): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(
        `/bracket/${bracketId}/reshuffle`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const swapMatchParticipants = async (matchId: number | string): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(
        `/bracket/match/${matchId}/swap`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const assignMatchParticipants = async (matchId: number | string): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(
        `/bracket/match/${matchId}/assign`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getAvailableParticipants = async (
    params?: object //eventId, category, class_name
  ): Promise<IResponse<IParticipant[]>> => {
    try {
      const response: AxiosResponse<IResponse<IParticipant[]>> = await axiosInstance.get(
        `/bracket/available-participants`,
        { params }
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    getBracketsByEvent,
    getAllBracket,
    getBracketDetail,
    generateBracket,
    reshuffleBracket,
    swapMatchParticipants,
    assignMatchParticipants,
    getAvailableParticipants
  }
}

export default BracketService
