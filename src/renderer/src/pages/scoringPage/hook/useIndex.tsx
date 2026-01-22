import MatchService from '@renderer/services/matchService'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useScreenResponsive } from './useScreenResponsive'
import { IMatch } from '@renderer/interface/match.interface'
import LogScoringService from '@renderer/services/logScoringService'
import { IPayloadLogScoring } from '@renderer/interface/logScoring.interface'

const scoreButtons = [
  {
    label: 'Ippon',
    value: 10,
    color: 'bg-red-600 hover:bg-red-700',
    borderColor: 'border-red-600 hover:border-red-700'
  },
  {
    label: 'Waza-ari',
    value: 7,
    color: 'bg-orange-600 hover:bg-orange-700',
    borderColor: 'border-orange-600 hover:border-orange-700'
  },
  {
    label: 'Yuko',
    value: 5,
    color: 'bg-amber-600 hover:bg-amber-700',
    borderColor: 'border-amber-600 hover:border-amber-700'
  }
]

const penaltyButtons = [
  {
    label: '- Yuko',
    value: -5,
    color: 'bg-slate-600 hover:bg-slate-700',
    borderColor: 'border-slate-600 hover:border-slate-700'
  },
  {
    label: '- Waza-ari',
    value: -7,
    color: 'bg-slate-700 hover:bg-slate-800',
    borderColor: 'border-slate-700 hover:border-slate-800'
  },
  {
    label: '- Ippon',
    value: -10,
    color: 'bg-slate-800 hover:bg-slate-900',
    borderColor: 'border-slate-800 hover:border-slate-900'
  }
]

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const UseIndex = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const matchService = MatchService()
  const logScoringService = LogScoringService()

  const [dataMatch, setDataMatch] = useState<IMatch>()

  const [seconds, setSeconds] = useState(20)
  const [timeLeft, setTimeLeft] = useState(20)
  const [isRunning, setIsRunning] = useState(false)
  const [scoreAka, setScoreAka] = useState(0)
  const [scoreAo, setScoreAo] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [totalRounds, setTotalRounds] = useState(4)
  const { screenSize, sizes1, sizes2 } = useScreenResponsive()

  // Senshu state: null = belum ada yang dapat, 'aka' = AKA dapat senshu, 'ao' = AO dapat senshu
  const [senshu, setSenshu] = useState<'aka' | 'ao' | null>(null)

  const [warningsAka, setWarningsAka] = useState({
    w1: false,
    w2: false,
    w3: false,
    hc: false,
    h: false
  })
  const [warningsAo, setWarningsAo] = useState({
    w1: false,
    w2: false,
    w3: false,
    hc: false,
    h: false
  })
  const [confirmClosePage, setConfirmClosePage] = useState<{
    open: boolean
    id: number | null
  }>({
    open: false,
    id: null
  })
  const [matchFinished, setMatchFinished] = useState<{ open: boolean; winner: string | null }>({
    open: false,
    winner: null
  })
  const [, setActionLogs] = useState<Array<Record<string, unknown>>>([])

  useEffect(() => {
    let interval
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 0.1)
      }, 100)
    } else if (timeLeft <= 0) {
      setIsRunning(false)
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  // Open match finished modal once when timer reaches zero
  useEffect(() => {
    if (timeLeft <= 0 && !matchFinished.open) {
      // determine winner
      let winner: string | null = null
      if (scoreAka > scoreAo) winner = dataMatch?.red_corner?.full_name || 'AKA'
      else if (scoreAo > scoreAka) winner = dataMatch?.blue_corner?.full_name || 'AO'
      else {
        // Jika seri, cek senshu
        if (senshu === 'aka') winner = dataMatch?.red_corner?.full_name || 'AKA'
        else if (senshu === 'ao') winner = dataMatch?.blue_corner?.full_name || 'AO'
        else winner = 'Seri'
      }

      setMatchFinished({ open: true, winner })
    }
  }, [timeLeft, matchFinished.open, scoreAka, scoreAo, dataMatch, senshu])

  const handleStartStop = (): void => {
    setIsRunning((prev) => {
      const next = !prev
      // log action
      recordAction(next ? 'START' : 'PAUSE', 0)
      return next
    })
  }

  // record single action to local list and send to logScoringService
  const recordAction = async (action: string, point = 0): Promise<void> => {
    const timestamp = new Date().toISOString()
    const log = {
      timestamp,
      action,
      point,
      round: currentRound,
      red_score: scoreAka,
      blue_score: scoreAo,
      warnings_red: warningsAka,
      warnings_blue: warningsAo,
      senshu
    }

    setActionLogs((prev) => [...prev, log])

    // try to send immediately (best-effort)
    try {
      if (!id) return
      const payload: IPayloadLogScoring = {
        match_id: parseInt(id),
        time_seconds: Math.max(0, seconds - timeLeft),
        action,
        point,
        red_score: log.red_score,
        blue_score: log.blue_score,
        warnings_red: log.warnings_red,
        warnings_blue: log.warnings_blue
      }
      await logScoringService.createLogScoring(payload)
    } catch (error) {
      // ignore network errors, logs are kept locally
      console.error('Failed to send log action', error)
    }
  }

  const handleConfirmWinner = (): void => {
    // send final summary
    handleLogScoring()
    // optionally navigate away
    navigate('/')
  }

  const handleReset = (): void => {
    setTimeLeft(seconds)
    setIsRunning(false)
  }

  const handleResetAll = (): void => {
    setTimeLeft(seconds)
    setIsRunning(false)
    setScoreAka(0)
    setScoreAo(0)
    setCurrentRound(1)
    setSenshu(null)
    setWarningsAka({ w1: false, w2: false, w3: false, hc: false, h: false })
    setWarningsAo({ w1: false, w2: false, w3: false, hc: false, h: false })
    // log reset all
    recordAction('RESET_ALL', 0)
  }

  // wrappers to update scores and log
  const addScoreAka = (name: string, value: number): void => {
    const next = Math.max(0, scoreAka + value)
    setScoreAka(next)

    // Cek apakah ini adalah skor pertama (senshu) dan value positif
    if (senshu === null && value > 0 && scoreAka === 0 && scoreAo === 0) {
      setSenshu('aka')
      recordAction(`${name} ${value > 0 ? '+' : ''}${value} [SENSHU]`, value)
    } else {
      recordAction(`${name} ${value > 0 ? '+' : ''}${value}`, value)
    }
  }

  const addScoreAo = (name: string, value: number): void => {
    const next = Math.max(0, scoreAo + value)
    setScoreAo(next)

    // Cek apakah ini adalah skor pertama (senshu) dan value positif
    if (senshu === null && value > 0 && scoreAka === 0 && scoreAo === 0) {
      setSenshu('ao')
      recordAction(`${name} ${value > 0 ? '+' : ''}${value} [SENSHU]`, value)
    } else {
      recordAction(`${name} ${value > 0 ? '+' : ''}${value}`, value)
    }
  }

  const toggleWarningAka = (key: string, checked?: boolean): void => {
    const next = {
      ...warningsAka,
      [key]: typeof checked === 'boolean' ? checked : !warningsAka[key]
    }
    setWarningsAka(next)
    recordAction(`AKA_WARN_${key}_${next[key] ? 'ON' : 'OFF'}`, 0)
  }

  const toggleWarningAo = (key: string, checked?: boolean): void => {
    const next = { ...warningsAo, [key]: typeof checked === 'boolean' ? checked : !warningsAo[key] }
    setWarningsAo(next)
    recordAction(`AO_WARN_${key}_${next[key] ? 'ON' : 'OFF'}`, 0)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const { key, ctrlKey, shiftKey } = e

      if (key === '1' && ctrlKey) {
        e.preventDefault()
        navigate(`/scoring/xyz/${id}`)
      }
      if (key === '2' && ctrlKey) {
        e.preventDefault()
        navigate(`/scoring2/xyz/${id}`)
      }

      if (key === 'Escape') {
        setConfirmClosePage({ open: true, id: null })
      }
      if (ctrlKey && shiftKey && key === 'N') {
        e.preventDefault()
        window.electron?.ipcRenderer.send('create-screen-scoring', id)
        console.log('Shortcut Ctrl + Shift + N ditekan')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLogScoring = async (): Promise<void> => {
    if (!id) return
    try {
      const payload: IPayloadLogScoring = {
        match_id: parseInt(id),
        time_seconds: seconds - timeLeft,
        action: ``,
        point: 0,
        red_score: scoreAka,
        blue_score: scoreAo,
        warnings_red: warningsAka,
        warnings_blue: warningsAo
      }
      const response = await logScoringService.createLogScoring(payload)
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

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

  useEffect(() => {
    fetchDetailMatch()
  }, [id])

  return {
    dataMatch,
    setSeconds,
    scoreAka,
    scoreAo,
    currentRound,
    totalRounds,
    setTotalRounds,
    warningsAka,
    warningsAo,
    sizes1,
    sizes2,
    handleStartStop,
    handleReset,
    handleResetAll,
    scoreButtons,
    penaltyButtons,
    screenSize,
    isRunning,
    seconds,
    setTimeLeft,
    timeLeft,
    setScoreAka,
    setScoreAo,
    setWarningsAka,
    setWarningsAo,
    setCurrentRound,
    matchFinished,
    setMatchFinished,
    confirmClosePage,
    setConfirmClosePage,
    handleConfirmWinner,
    handleLogScoring,
    addScoreAka,
    addScoreAo,
    toggleWarningAka,
    toggleWarningAo,
    senshu,
    setSenshu
  }
}
