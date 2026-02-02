import { useAxiosInstance } from '@api/axiosInstance'
import type { IResponse } from '@interface/response.interface'
import type { AxiosResponse } from 'axios'
import type { IEventUserDetail } from '@interface/userEvent.interface'
import { IEvent, IPayloadEvent } from '@renderer/interface/event.interface'

interface EventService {
  getAllEvent: (params?: object) => Promise<IResponse<IEvent[]>>
  getDetailEvent: (id: string) => Promise<IResponse<IEvent>>
  createEvent: (data: FormData | IPayloadEvent) => Promise<IResponse>
  updateEvent: (id: string, data: FormData | IPayloadEvent) => Promise<IResponse>
  deleteEvent: (id: string) => Promise<IResponse>

  getAllUserEvent: (params?: object) => Promise<IResponse<IEvent[]>>
  getDetailUserEvent: (id: string) => Promise<IResponse<IEventUserDetail>>
}

const EventService = (): EventService => {
  const axiosInstance = useAxiosInstance()

  const getAllEvent = async (params?: object): Promise<IResponse<IEvent[]>> => {
    try {
      const response: AxiosResponse<IResponse<IEvent[]>> = await axiosInstance.get(`/event`, {
        params
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getAllUserEvent = async (params?: object): Promise<IResponse<IEvent[]>> => {
    try {
      const response: AxiosResponse<IResponse<IEvent[]>> = await axiosInstance.get(
        `/event/user-event`,
        { params }
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getDetailUserEvent = async (id: string): Promise<IResponse<IEventUserDetail>> => {
    try {
      const response: AxiosResponse<IResponse<IEventUserDetail>> = await axiosInstance.get(
        `/event/user-event/${id}`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getDetailEvent = async (id: string): Promise<IResponse<IEvent>> => {
    try {
      const response: AxiosResponse<IResponse<IEvent>> = await axiosInstance.get(`/event/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const createEvent = async (data: FormData | IPayloadEvent): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(`/event`, data, {
        headers:
          data instanceof FormData
            ? {
                'Content-Type': 'multipart/form-data'
              }
            : undefined
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const updateEvent = async (id: string, data: FormData | IPayloadEvent): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(`/event/${id}`, data, {
        headers:
          data instanceof FormData
            ? {
                'Content-Type': 'multipart/form-data'
              }
            : undefined
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const deleteEvent = async (id: string): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.delete(`/event/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    getAllEvent,
    getAllUserEvent,
    getDetailEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    getDetailUserEvent
  }
}

export default EventService
