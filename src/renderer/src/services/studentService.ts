import { useAxiosInstance } from '@api/axiosInstance'
import type { IResponse } from '@interface/response.interface'
import type { IStudent } from '@interface/student.interface'
import type { AxiosResponse } from 'axios'

interface StudentService {
  getAllStudent: (params?: object) => Promise<IResponse<IStudent[]>>
  getDetailStudent: (id: string) => Promise<IResponse<IStudent>>
  createStudent: (data: FormData) => Promise<IResponse>
  updateStudent: (id: string, data: FormData) => Promise<IResponse>
  deleteStudent: (id: string) => Promise<IResponse>
}

const StudentService = (): StudentService => {
  const axiosInstance = useAxiosInstance()

  const getAllStudent = async (params?: object): Promise<IResponse<IStudent[]>> => {
    try {
      const response: AxiosResponse<IResponse<IStudent[]>> = await axiosInstance.get(`/student`, {
        params
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getDetailStudent = async (id: string): Promise<IResponse<IStudent>> => {
    try {
      const response: AxiosResponse<IResponse<IStudent>> = await axiosInstance.get(`/student/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const createStudent = async (data: FormData): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(`/student`, data, {
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

  const updateStudent = async (id: string, data: FormData): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(`/student/${id}`, data, {
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

  const deleteStudent = async (id: string): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.delete(`/student/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    getAllStudent,
    getDetailStudent,
    createStudent,
    updateStudent,
    deleteStudent
  }
}

export default StudentService
