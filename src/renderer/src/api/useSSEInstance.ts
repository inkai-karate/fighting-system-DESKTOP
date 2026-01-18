import { useConfigStore } from '@renderer/store/configProvider'

// hooks/useSSEInstance.ts
export const useSSEInstance = (endpoint: string): EventSource => {
  const { config } = useConfigStore.getState()
  const token = localStorage.getItem('token')
  const baseUrl = `${config?.api_url}/api/v1${endpoint}`
  const fullUrl = `${baseUrl}?token=${encodeURIComponent(token || '')}`
  const eventSource = new EventSource(fullUrl, { withCredentials: false })
  return eventSource
}
