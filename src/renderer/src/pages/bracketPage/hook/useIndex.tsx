import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { IBracket } from '@interface/bracket.interface'
import type { IMatch } from '@interface/match.interface'
import BracketService from '@services/bracketService'

interface LoadingState {
  fetchBracket: boolean
  fetchMatches: boolean
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useIndex = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const bracketService = BracketService()

  const [bracket, setBracket] = useState<IBracket | null>(null)
  const [matches, setMatches] = useState<IMatch[]>([])
  const [loading, setLoading] = useState<LoadingState>({
    fetchBracket: false,
    fetchMatches: false
  })
  const [error, setError] = useState<string | null>(null)

  // Fetch bracket detail
  const fetchBracketDetail = useCallback(async () => {
    if (!id) return

    setLoading((prev) => ({ ...prev, fetchBracket: true }))
    setError(null)

    try {
      const response = await bracketService.getBracketDetail(id)
      if (response.success && response.data) {
        setBracket(response.data)
        // If bracket has matches included, use them
        if (response.data.matches && response.data.matches.length > 0) {
          setMatches(response.data.matches)
        }
      } else {
        setError('Gagal memuat data bracket')
      }
    } catch (err) {
      console.error('Error fetching bracket:', err)
      setError('Terjadi kesalahan saat memuat data bracket')
    } finally {
      setLoading((prev) => ({ ...prev, fetchBracket: false }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // Refresh data
  const refreshData = useCallback(async () => {
    await Promise.all([fetchBracketDetail()])
  }, [fetchBracketDetail])

  // Initial fetch
  useEffect(() => {
    if (id) {
      fetchBracketDetail()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const isLoading = loading.fetchBracket || loading.fetchMatches

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const { key } = e
      if (key === 'Escape') {
        const payloadIpc = {
          type: 'WAITING_DISPLAY'
        }
        setTimeout(() => {
          window.electron?.ipcRenderer.send('mirror-to-main', payloadIpc)
        }, 300)
        navigate(-1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    id,
    bracket,
    matches,
    loading,
    isLoading,
    error,
    refreshData
  }
}

export default useIndex
