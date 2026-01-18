import { useAxiosInstance } from '@api/axiosInstance'
import type { IConfigCompany, IPayloadConfigCompany } from '@interface/configCompany.interface'
import type { IResponse } from '@interface/response.interface'
import type { AxiosResponse } from 'axios'

interface ConfigCompanyService {
  getDetailConfigCompany: () => Promise<IResponse<IConfigCompany>>
  getDetailConfigCompanyBySecret: (id: string) => Promise<IResponse<IConfigCompany>>
  updateConfigCompany: (id: string, data: IPayloadConfigCompany) => Promise<IResponse>
}

const ConfigCompanyService = (): ConfigCompanyService => {
  const axiosInstance = useAxiosInstance()

  const getDetailConfigCompany = async (): Promise<IResponse<IConfigCompany>> => {
    try {
      const response: AxiosResponse<IResponse<IConfigCompany>> = await axiosInstance.get(`/company`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getDetailConfigCompanyBySecret = async (id: string): Promise<IResponse<IConfigCompany>> => {
    try {
      const response: AxiosResponse<IResponse<IConfigCompany>> = await axiosInstance.get(
        `/company/${id}/secret`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const updateConfigCompany = async (
    id: string,
    data: IPayloadConfigCompany
  ): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(`/company/${id}`, data)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    getDetailConfigCompany,
    updateConfigCompany,
    getDetailConfigCompanyBySecret
  }
}

export default ConfigCompanyService
