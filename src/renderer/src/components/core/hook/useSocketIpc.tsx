import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useSocketIpc = () => {
  const [data, setData] = useState()
  const navigate = useNavigate()
  useEffect(() => {
    console.log('🎯 Scoring Display mounted, setting up listener...')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMessageFromMain = (data: any): void => {
      console.log('📩 Scoring window received message from main:', data)
      setData(data)
      if (data.type === 'SCORING_DISPLAY') {
        navigate(`/scoring/display/${data.matchId}`)
      }
      if (data.type === 'WAITING_DISPLAY') {
        navigate(`/waiting`)
      }

      if (data.type === 'PONG') {
        console.log('✅ Received PONG from main:', data.message)
      }
    }

    // Register listener
    window.api?.onMessageFromMain(handleMessageFromMain)
    console.log('✅ Listener registered')

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up listener')
      window.api?.removeMessageListener()
    }
  }, [])
  return { data }
}
