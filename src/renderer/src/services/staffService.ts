import { useAxiosInstance } from '@api/axiosInstance'
import type { IResponse } from '@interface/response.interface'
import type { IStaff } from '@interface/staff.interface'
import type { AxiosResponse } from 'axios'

interface StaffService {
  getAllStaff: (params?: object) => Promise<IResponse<IStaff[]>>
  getDetailStaff: (id: string) => Promise<IResponse<IStaff>>
  createStaff: (data: FormData) => Promise<IResponse>
  updateStaff: (id: string, data: FormData) => Promise<IResponse>
  deleteStaff: (id: number) => Promise<IResponse>
}

const StaffService = (): StaffService => {
  const axiosInstance = useAxiosInstance()

  const getAllStaff = async (params?: object): Promise<IResponse<IStaff[]>> => {
    try {
      const response: AxiosResponse<IResponse<IStaff[]>> = await axiosInstance.get(`/staff`, {
        params
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getDetailStaff = async (id: string): Promise<IResponse<IStaff>> => {
    try {
      const response: AxiosResponse<IResponse<IStaff>> = await axiosInstance.get(`/staff/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const createStaff = async (data: FormData): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(`/staff`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const updateStaff = async (id: string, data: FormData): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(`/staff/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const deleteStaff = async (id: number): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.delete(`/staff/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    getAllStaff,
    getDetailStaff,
    createStaff,
    updateStaff,
    deleteStaff
  }
}

export default StaffService
