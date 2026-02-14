import { useAxiosInstance } from '@api/axiosInstance'
import type { IResponse } from '@interface/response.interface'
import { IBranch, IBranchConfig } from '@renderer/interface/branch.interface'
import type { AxiosResponse } from 'axios'

interface BranchService {
  getAllBranch: (params?: object) => Promise<IResponse<IBranch[]>>
  getDetailBranch: (id: string) => Promise<IResponse<IBranch>>
  getProfileBranch: () => Promise<IResponse<IBranch>>
  getDetailConfigBranch: (id: string) => Promise<IResponse<IBranchConfig>>
}

const BranchService = (): BranchService => {
  const axiosInstance = useAxiosInstance()

  const getAllBranch = async (params?: object): Promise<IResponse<IBranch[]>> => {
    try {
      const response: AxiosResponse<IResponse<IBranch[]>> = await axiosInstance.get(`/branch`, {
        params
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getDetailBranch = async (id: string): Promise<IResponse<IBranch>> => {
    try {
      const response: AxiosResponse<IResponse<IBranch>> = await axiosInstance.get(`/branch/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getDetailConfigBranch = async (id: string): Promise<IResponse<IBranchConfig>> => {
    try {
      const response: AxiosResponse<IResponse<IBranchConfig>> = await axiosInstance.get(
        `/branch-config/${id}`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getProfileBranch = async (): Promise<IResponse<IBranch>> => {
    try {
      const response: AxiosResponse<IResponse<IBranch>> = await axiosInstance.get(`/branch/profile`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    getAllBranch,
    getDetailBranch,
    getDetailConfigBranch,
    getProfileBranch
  }
}

export default BranchService
