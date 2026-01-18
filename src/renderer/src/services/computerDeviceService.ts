import { useAxiosInstance } from '@api/axiosInstance'
import type { IResponse } from '@interface/response.interface'
import type { IComputerDevice, IPayloadComputerDevice } from '@interface/computerDevice.interface'
import type { AxiosResponse } from 'axios'

interface ComputerDeviceService {
  getAllComputerDevice: (params?: object) => Promise<IResponse<IComputerDevice[]>>
  createComputerDevice: (date: IPayloadComputerDevice) => Promise<IResponse>
  getDetailComputerDevice: (id: string) => Promise<IResponse<IComputerDevice>>
  getDetailComputerDeviceByDeviceId: (id: string) => Promise<IResponse<IComputerDevice>>
  deleteComputerDevice: (id: number) => Promise<IResponse>
}

const ComputerDeviceService = (): ComputerDeviceService => {
  const axiosInstance = useAxiosInstance()

  const getAllComputerDevice = async (params?: object): Promise<IResponse<IComputerDevice[]>> => {
    try {
      const response: AxiosResponse<IResponse<IComputerDevice[]>> = await axiosInstance.get(
        `/computer-device`,
        { params }
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const createComputerDevice = async (data: IPayloadComputerDevice): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse<IComputerDevice[]>> = await axiosInstance.post(
        `/computer-device`,
        data
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getDetailComputerDevice = async (id: string): Promise<IResponse<IComputerDevice>> => {
    try {
      const response: AxiosResponse<IResponse<IComputerDevice>> = await axiosInstance.get(
        `/computer-device/${id}`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getDetailComputerDeviceByDeviceId = async (
    id: string
  ): Promise<IResponse<IComputerDevice>> => {
    try {
      const response: AxiosResponse<IResponse<IComputerDevice>> = await axiosInstance.get(
        `/computer-device/${id}/device-id`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const deleteComputerDevice = async (id: number): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.delete(
        `/computer-device/${id}`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    getAllComputerDevice,
    getDetailComputerDevice,
    deleteComputerDevice,
    createComputerDevice,
    getDetailComputerDeviceByDeviceId
  }
}

export default ComputerDeviceService
