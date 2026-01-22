import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import MatchService from '@renderer/services/matchService'
import { IMatch } from '@renderer/interface/match.interface'

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
    senshu: null
  })

  // Fetch match detail
  const fetchDetailMatch = async (): Promise<void> => {
    if (!id) return
    try {
      const response = await matchService.getMatchDetail(id || '')
      if (response.success) {
        setDataMatch(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Listen untuk screen size changes
  useEffect(() => {
    let mounted = true

    const fetchSize = async (attempts = 4, delay = 50): Promise<void> => {
      try {
        const size = await window.api?.screen?.getSize()
        if (mounted && size && size.width && size.height) {
          setScreenSize(size)
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

  // Listen untuk data dari window utama via IPC
  useEffect(() => {
    // Listen untuk data scoring dari window utama
    const handleReceiveData = (data: IScoringData): void => {
      console.log('Received scoring data:', data)
      setScoringData(data)
    }

    // Register listener
    // if (window.electron?.ipcRenderer) {
    //   window.electron.ipcRenderer.on('receive-data-from-window1', handleReceiveData)
    // }

    // Cleanup
    return () => {
      if (window.electron?.ipcRenderer) {
        window.electron.ipcRenderer.removeListener('receive-data-from-window1', handleReceiveData)
      }
    }
  }, [])

  // Fetch match detail saat component mount
  useEffect(() => {
    fetchDetailMatch()
  }, [id])

  // Calculate responsive sizes
  const displaySizes = useMemo(() => {
    const h = screenSize.height
    const w = screenSize.width

    return {
      // Spacing
      verticalPadding: h * 0.04,
      horizontalPadding: w * 0.06,
      sectionGap: w * 0.08,
      smallGap: h * 0.015,
      warningGap: w * 0.025,

      // Fonts
      nameFont: h * 0.045,
      scoreFont: h * 0.22,
      warningTitleFont: h * 0.028,
      warningFont: h * 0.035,
      timerFont: h * 0.15,
      timerDecimalFont: h * 0.075,
      roundFont: h * 0.04,

      // Elements
      logoWidth: w * 0.15,
      senshuSize: h * 0.055
    }
  }, [screenSize])

  return {
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
    screenSize,
    displaySizes
  }
}
