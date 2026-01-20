import { useAxiosInstance } from '@api/axiosInstance'
import type { IResponse } from '@interface/response.interface'
import type {
  IMatch,
  IPayloadMatch,
  IPayloadStartMatch,
  IPayloadFinishMatch,
  IPayloadCancelMatch,
  IPayloadWalkoverMatch,
  IPayloadassignRefereeMatch,
  IMatchStats
} from '@interface/match.interface'
import type { AxiosResponse } from 'axios'
import type { IBracketProgress } from '@interface/bracket.interface'

interface MatchService {
  getMatchesByEvent: (params?: object) => Promise<IResponse<IMatch[]>>
  getMatchesByReferee: (id: string | number, params?: object) => Promise<IResponse<IMatch[]>>
  getOngoingMatches: (params?: object) => Promise<IResponse<IMatch[]>>
  getMatchStats: (params?: object) => Promise<IResponse<IMatchStats>>
  getMatchesByBracket: (bracketId: string | number) => Promise<IResponse<IMatch[]>>
  getBracketProgress: (bracketId: string | number) => Promise<IResponse<IBracketProgress>>
  getMatchDetail: (matchId: string | number) => Promise<IResponse<IMatch>>
  startMatch: (matchId: string | number, data: IPayloadStartMatch) => Promise<IResponse>
  finishMatch: (matchId: string | number, data: IPayloadFinishMatch) => Promise<IResponse>
  cancelMatch: (matchId: string | number, data: IPayloadCancelMatch) => Promise<IResponse>
  setWalkover: (matchId: string | number, data: IPayloadWalkoverMatch) => Promise<IResponse>
  assignReferee: (matchId: string | number, data: IPayloadassignRefereeMatch) => Promise<IResponse>
  updateMatch: (matchId: string | number, data: IPayloadMatch) => Promise<IResponse>
}

const MatchService = (): MatchService => {
  const axiosInstance = useAxiosInstance()

  // GET / - Get matches by event
  const getMatchesByEvent = async (params?: object): Promise<IResponse<IMatch[]>> => {
    try {
      const response: AxiosResponse<IResponse<IMatch[]>> = await axiosInstance.get(`/match`, {
        params
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getMatchesByReferee = async (
    id: string | number,
    params?: object
  ): Promise<IResponse<IMatch[]>> => {
    try {
      const response: AxiosResponse<IResponse<IMatch[]>> = await axiosInstance.get(
        `/match/${id}/referee`,
        { params }
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // GET /ongoing - Get ongoing matches
  const getOngoingMatches = async (params?: object): Promise<IResponse<IMatch[]>> => {
    try {
      const response: AxiosResponse<IResponse<IMatch[]>> = await axiosInstance.get(
        `/match/ongoing`,
        { params }
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // GET /stats - Get match statistics
  const getMatchStats = async (params?: object): Promise<IResponse<IMatchStats>> => {
    try {
      const response: AxiosResponse<IResponse<IMatchStats>> = await axiosInstance.get(
        `/match/stats`,
        { params }
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // GET /bracket/:bracketId - Get matches by bracket
  const getMatchesByBracket = async (bracketId: string | number): Promise<IResponse<IMatch[]>> => {
    try {
      const response: AxiosResponse<IResponse<IMatch[]>> = await axiosInstance.get(
        `/match/bracket/${bracketId}`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // GET /bracket/:bracketId/progress - Get bracket progress
  const getBracketProgress = async (
    bracketId: string | number
  ): Promise<IResponse<IBracketProgress>> => {
    try {
      const response: AxiosResponse<IResponse<IBracketProgress>> = await axiosInstance.get(
        `/match/bracket/${bracketId}/progress`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // GET /:matchId - Get match detail
  const getMatchDetail = async (matchId: string | number): Promise<IResponse<IMatch>> => {
    try {
      const response: AxiosResponse<IResponse<IMatch>> = await axiosInstance.get(
        `/match/${matchId}`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // POST /:matchId/start - Start a match
  const startMatch = async (
    matchId: string | number,
    data: IPayloadStartMatch
  ): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(
        `/match/${matchId}/start`,
        data
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // POST /:matchId/finish - Finish a match
  const finishMatch = async (
    matchId: string | number,
    data: IPayloadFinishMatch
  ): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(
        `/match/${matchId}/finish`,
        data
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // POST /:matchId/cancel - Cancel a match
  const cancelMatch = async (
    matchId: string | number,
    data: IPayloadCancelMatch
  ): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(
        `/match/${matchId}/cancel`,
        data
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // POST /:matchId/walkover - Set walkover
  const setWalkover = async (
    matchId: string | number,
    data: IPayloadWalkoverMatch
  ): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(
        `/match/${matchId}/walkover`,
        data
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // PUT /:matchId/referee - Assign referee
  const assignReferee = async (
    matchId: string | number,
    data: IPayloadassignRefereeMatch
  ): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(
        `/match/${matchId}/referee`,
        data
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // PUT /:matchId - Update match
  const updateMatch = async (matchId: string | number, data: IPayloadMatch): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(`/match/${matchId}`, data)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    getMatchesByEvent,
    getMatchesByReferee,
    getOngoingMatches,
    getMatchStats,
    getMatchesByBracket,
    getBracketProgress,
    getMatchDetail,
    startMatch,
    finishMatch,
    cancelMatch,
    setWalkover,
    assignReferee,
    updateMatch
  }
}

export default MatchService
