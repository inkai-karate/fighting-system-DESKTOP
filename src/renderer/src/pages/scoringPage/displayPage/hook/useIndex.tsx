// useIndex.tsx (ScoringDisplayPage)
import { useEffect, useState, useMemo } from 'react'
// import { useParams } from 'react-router-dom'
import MatchService from '@renderer/services/matchService'
import { IMatch } from '@renderer/interface/match.interface'
import { useParams } from 'react-router-dom'

interface IScoringData {
  scoreAka: number
  scoreAo: number
  currentRound: number
  totalRounds: number
  warningsAka: {
    w1: boolean
    w2: boolean
    w3: boolean
    hc: boolean
    h: boolean
  }
  warningsAo: {
    w1: boolean
    w2: boolean
    w3: boolean
    hc: boolean
    h: boolean
  }
  timeLeft: number
  isRunning: boolean
  senshu: 'aka' | 'ao' | null
  winnerDeclared: boolean
  winnerInfo: {
    winner: string
    winnerColor: 'red' | 'blue' | 'draw'
  } | null
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const UseIndex = () => {
  const { id } = useParams()
  const matchService = MatchService()

  const [dataMatch, setDataMatch] = useState<IMatch>()
  const [screenSize, setScreenSize] = useState({ width: 1920, height: 1080 })

  // State untuk data scoring yang di-sync dari window utama
  const [scoringData, setScoringData] = useState<IScoringData>({
    scoreAka: 0,
    scoreAo: 0,
    currentRound: 1,
    totalRounds: 4,
    warningsAka: { w1: false, w2: false, w3: false, hc: false, h: false },
    warningsAo: { w1: false, w2: false, w3: false, hc: false, h: false },
    timeLeft: 120,
    isRunning: false,
    senshu: null,
    winnerDeclared: false,
    winnerInfo: null
  })

  const [isShowingWinner, setIsShowingWinner] = useState(false)
  const [winnerTransition, setWinnerTransition] = useState(false)

  useEffect(() => {
    if (!id) return
    const fetchDetailMatch = async (): Promise<void> => {
      try {
        const response = await matchService.getMatchDetail(id)
        if (response.success) {
          setDataMatch(response.data)
          console.log('✅ Match detail loaded:', response.data)
        }
      } catch (error) {
        console.error('❌ Error fetching match detail:', error)
      }
    }
    fetchDetailMatch()
  }, [id])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null

    if (scoringData.winnerDeclared && scoringData.winnerInfo) {
      // Tunggu sebentar sebelum menampilkan winner untuk efek dramatis
      timer = setTimeout(() => {
        setIsShowingWinner(true)
        setWinnerTransition(true)
      }, 500)
    } else {
      setIsShowingWinner(false)
      setWinnerTransition(false)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [scoringData.winnerDeclared, scoringData.winnerInfo])

  // Listen untuk pesan dari main process
  useEffect(() => {
    console.log('🎯 Scoring Display mounted, setting up listener...')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMessageFromMain = (data: any): void => {
      if (data.type === 'SCORING_UPDATE') {
        console.log('📊 Received scoring update:', data)
        setScoringData((prev) => ({
          ...prev,
          scoreAka: data.scoreAka,
          scoreAo: data.scoreAo,
          currentRound: data.currentRound,
          totalRounds: data.totalRounds,
          warningsAka: data.warningsAka,
          warningsAo: data.warningsAo,
          timeLeft: data.timeLeft,
          isRunning: data.isRunning,
          senshu: data.senshu
        }))
      } else if (data.type === 'WINNER_DECLARED') {
        console.log('🏆 Received winner declared:', data)
        setScoringData((prev) => ({
          ...prev,
          winnerDeclared: data.winnerDeclared,
          winnerInfo: data.winnerInfo
        }))
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

  // Listen untuk screen size changes
  useEffect(() => {
    let mounted = true

    const fetchSize = async (attempts = 4, delay = 50): Promise<void> => {
      try {
        const size = await window.api?.screen?.getSize()
        if (mounted && size && size.width && size.height) {
          setScreenSize({ width: window.innerWidth, height: window.innerHeight })
          return
        }
      } catch (e) {
        console.log('fetchSize: ', e)
      }

      if (attempts > 0) setTimeout(() => fetchSize(attempts - 1, delay * 2), delay)
      else if (mounted) setScreenSize({ width: window.innerWidth, height: window.innerHeight })
    }

    fetchSize()

    if (window.api?.screen?.onSizeChanged) {
      window.api.screen.onSizeChanged((size) => {
        if (mounted && size && size.width && size.height) setScreenSize(size)
      })
    }

    const onWinResize = (): void => {
      if (!mounted) return
      setScreenSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', onWinResize)

    return () => {
      mounted = false
      window.removeEventListener('resize', onWinResize)
    }
  }, [])

  // Calculate responsive sizes
  const displaySizes = useMemo(() => {
    const h = screenSize.height
    const w = screenSize.width

    return {
      verticalPadding: h * 0.04,
      horizontalPadding: w * 0.06,
      sectionGap: w * 0.08,
      smallGap: h * 0.015,
      warningGap: w * 0.025,
      nameFont: h * 0.045,
      scoreFont: h * 0.22,
      warningTitleFont: h * 0.028,
      warningFont: h * 0.035,
      timerFont: h * 0.15,
      timerDecimalFont: h * 0.075,
      roundFont: h * 0.04,
      logoWidth: w * 0.15,
      senshuSize: h * 0.055,
      winnerFont: h * 0.08,
      finalScoreFont: h * 0.15
    }
  }, [screenSize])

  return {
    id,
    dataMatch,
    scoreAka: scoringData.scoreAka,
    scoreAo: scoringData.scoreAo,
    currentRound: scoringData.currentRound,
    totalRounds: scoringData.totalRounds,
    warningsAka: scoringData.warningsAka,
    warningsAo: scoringData.warningsAo,
    timeLeft: scoringData.timeLeft,
    isRunning: scoringData.isRunning,
    senshu: scoringData.senshu,
    winnerDeclared: scoringData.winnerDeclared,
    winnerInfo: scoringData.winnerInfo,
    isShowingWinner,
    winnerTransition,
    screenSize,
    displaySizes
  }
}
