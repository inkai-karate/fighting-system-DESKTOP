import MatchService from '@renderer/services/matchService'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useScreenResponsive } from './useScreenResponsive'
import { IMatch } from '@renderer/interface/match.interface'
import LogScoringService from '@renderer/services/logScoringService'
import { ILogScoring, IPayloadLogScoring } from '@renderer/interface/logScoring.interface'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import autoTable from 'jspdf-autotable'

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
export interface IPrintData {
  data: ILogScoring[]
  match: IMatch
  matchInfo: {
    scoreAka: number
    scoreAo: number
    winner: string
  }
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const UseIndex = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const matchService = MatchService()
  const logScoringService = LogScoringService()

  const [dataMatch, setDataMatch] = useState<IMatch>()
  const [dataLogActivityMatch, setDataLogActivityMatch] = useState<ILogScoring[]>([])

  const [seconds, setSeconds] = useState(20)
  const [timeLeft, setTimeLeft] = useState(20)
  const [isRunning, setIsRunning] = useState(false)
  const [scoreAka, setScoreAka] = useState(0)
  const [scoreAo, setScoreAo] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [totalRounds, setTotalRounds] = useState(4)
  const { screenSize, sizes1, sizes2, isReady } = useScreenResponsive()

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
  const [hasMatchStarted, setHasMatchStarted] = useState<boolean>(false)

  const [winnerDeclared, setWinnerDeclared] = useState<boolean>(false)
  const [winnerInfo, setWinnerInfo] = useState<{
    winner: string
    winnerColor: 'red' | 'blue' | 'draw'
  } | null>(null)

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

  const handleStartStop = async (): Promise<void> => {
    const next = !isRunning

    // If starting for the first time, call startMatch
    if (next && !hasMatchStarted) {
      try {
        const matchId = dataMatch?.id || (id as unknown as number) || 0
        const refereeId = dataMatch?.referee_id || dataMatch?.referee?.id || 0
        if (matchId) {
          await matchService.startMatch(matchId, { referee_id: refereeId })
          setHasMatchStarted(true)
        }
      } catch (error) {
        console.error('Failed to start match:', error)
      }
    }

    setIsRunning(next)
    // log action (START should still be recorded even if timer state check blocks other actions)
    recordAction(next ? 'START' : 'PAUSE', 0)
  }

  const fetchLogActivityMatch = async (): Promise<ILogScoring[]> => {
    if (!id) return []
    try {
      const response = await logScoringService.getAllLogMatchScoring(dataMatch?.id || 0)
      console.log('aa', response)

      if (response.success) {
        setDataLogActivityMatch(response.data || [])
        return response.data || []
      }
      return response.data || []
    } catch (error) {
      console.log(error)
      return []
    }
  }

  // record single action to local list and send to logScoringService
  const recordAction = async (action: string, point = 0): Promise<void> => {
    // Only allow recordAction if timer has started (not at initial state)
    // but allow recording the START action so it isn't blocked when user starts timer
    if (!isRunning && timeLeft === seconds && action !== 'START') return

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
      if (!dataMatch) return
      const payload: IPayloadLogScoring = {
        match_id: dataMatch.id,
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
      console.error('Failed to send log action', error)
    }
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
    recordAction(`${dataMatch?.red_corner.full_name}_WARN_${key}_${next[key] ? 'ON' : 'OFF'}`, 0)
  }

  const toggleWarningAo = (key: string, checked?: boolean): void => {
    const next = { ...warningsAo, [key]: typeof checked === 'boolean' ? checked : !warningsAo[key] }
    setWarningsAo(next)
    recordAction(`${dataMatch?.blue_corner.full_name}_WARN_${key}_${next[key] ? 'ON' : 'OFF'}`, 0)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const { key, ctrlKey } = e

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
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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

  const sendDataToDisplay = (): void => {
    const data = {
      type: 'SCORING_UPDATE',
      scoreAka,
      scoreAo,
      currentRound,
      totalRounds,
      warningsAka,
      warningsAo,
      timeLeft,
      isRunning,
      senshu,
      timestamp: new Date().toISOString()
    }

    console.log('Sending data to display window:', data)
    window.api?.sendToScoring(data)
  }

  // Kirim data setiap kali ada perubahan pada state scoring
  useEffect(() => {
    sendDataToDisplay()
  }, [
    scoreAka,
    scoreAo,
    currentRound,
    totalRounds,
    warningsAka,
    warningsAo,
    timeLeft,
    isRunning,
    senshu
  ])

  useEffect(() => {
    if (timeLeft <= 0 && !matchFinished.open && !winnerDeclared) {
      // determine winner
      let winner: string | null = null
      let winnerColor: 'red' | 'blue' | 'draw' = 'draw'

      if (scoreAka > scoreAo) {
        winner = dataMatch?.red_corner?.full_name || 'AKA'
        winnerColor = 'red'
      } else if (scoreAo > scoreAka) {
        winner = dataMatch?.blue_corner?.full_name || 'AO'
        winnerColor = 'blue'
      } else {
        // Jika seri, cek senshu
        if (senshu === 'aka') {
          winner = dataMatch?.red_corner?.full_name || 'AKA'
          winnerColor = 'red'
        } else if (senshu === 'ao') {
          winner = dataMatch?.blue_corner?.full_name || 'AO'
          winnerColor = 'blue'
        } else {
          winner = 'Seri'
          winnerColor = 'draw'
        }
      }

      setWinnerInfo({ winner, winnerColor })
      setMatchFinished({ open: true, winner })
    }
  }, [timeLeft, matchFinished.open, scoreAka, scoreAo, dataMatch, senshu, winnerDeclared])

  const sendWinnerToDisplay = (): void => {
    if (!winnerDeclared || !winnerInfo) return

    const data = {
      type: 'WINNER_DECLARED',
      winnerDeclared,
      winnerInfo,
      finalScoreAka: scoreAka,
      finalScoreAo: scoreAo,
      timestamp: new Date().toISOString()
    }

    console.log('Sending winner to display window:', data)
    window.api?.sendToScoring(data)
  }

  useEffect(() => {
    if (winnerDeclared && winnerInfo) {
      sendWinnerToDisplay()
    }
  }, [winnerDeclared, winnerInfo])

  // Update handleConfirmWinner untuk set winnerDeclared
  const handleConfirmWinner = async (): Promise<void> => {
    setWinnerDeclared(true)
    sendWinnerToDisplay()

    // Call finishMatch on the backend with the determined winner (if any)
    try {
      const matchId = dataMatch?.id || (id as unknown as number) || 0
      if (matchId) {
        // determine winner id based on winnerInfo or scores
        let winner_id = 0
        if (winnerInfo && winnerInfo.winnerColor === 'red') {
          winner_id = dataMatch?.red_corner_id || dataMatch?.red_corner?.id || 0
        } else if (winnerInfo && winnerInfo.winnerColor === 'blue') {
          winner_id = dataMatch?.blue_corner_id || dataMatch?.blue_corner?.id || 0
        } else {
          // draw -> set winner_id to 0 (server should handle as draw if supported)
          winner_id = 0
        }

        await matchService.finishMatch(matchId, { winner_id })
      }
    } catch (error) {
      console.error('Failed to finish match:', error)
    }

    await fetchLogActivityMatch()
  }

  const handlePrintLogActivity = async (payload: IPrintData): Promise<void> => {
    try {
      // Extract data from payload
      const { data, match, matchInfo } = payload
      const { scoreAka, scoreAo, winner } = matchInfo

      // Sort data by time ascending (oldest first)
      const sortedData = [...data].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )

      // Create PDF document
      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height

      // Add title
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('LAPORAN LOG PERTANDINGAN', pageWidth / 2, 20, { align: 'center' })

      // Add match info
      let startY = 35 // Start position for table

      if (match && matchInfo) {
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')

        // Format date from match start_time
        const matchDate = new Date(match.start_time).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })

        // Left column - Match details
        doc.text(`Tanggal: ${matchDate}`, 20, 30)
        doc.text(`AKA (Merah): ${match.red_corner.full_name}`, 20, 37)
        doc.text(`AO (Biru): ${match.blue_corner.full_name}`, 20, 44)
        doc.text(`Skor Akhir: ${scoreAka} - ${scoreAo}`, 20, 51)
        doc.text(`Pemenang: ${winner}`, 20, 58)

        // Right column - Statistics
        doc.text(`Total Aksi: ${sortedData.length}`, pageWidth - 20, 30, { align: 'right' })

        // Calculate total time
        const totalTime = sortedData.reduce((sum, log) => {
          const seconds = parseFloat(log.time_seconds) || 0
          return sum + seconds
        }, 0)

        // Format total time as minutes:seconds
        const minutes = Math.floor(totalTime / 60)
        const seconds = Math.floor(totalTime % 60)
        doc.text(
          `Waktu Total: ${minutes}:${seconds.toString().padStart(2, '0')}`,
          pageWidth - 20,
          37,
          { align: 'right' }
        )

        // Add match number and round
        doc.text(`Match: ${match.match_number || 'N/A'}`, pageWidth - 20, 44, { align: 'right' })
        doc.text(`Round: ${match.round_number || 'N/A'}`, pageWidth - 20, 51, { align: 'right' })

        // Add referee info
        if (match.referee?.full_name) {
          doc.text(`Wasit: ${match.referee.full_name}`, pageWidth - 20, 58, { align: 'right' })
        }

        startY = 65 // Move table start position down
      }

      // Prepare table data
      const tableData = sortedData.map((log, index) => {
        return [
          (index + 1).toString(),
          log.action,
          log.point > 0 ? `+${log.point}` : log.point.toString(),
          log.time_seconds ? `${parseFloat(log.time_seconds).toFixed(1)}` : '0.0',
          log.red_score.toString(),
          log.blue_score.toString(),
          log.description || '-'
        ]
      })

      // Create table
      autoTable(doc, {
        startY: startY,
        head: [['No', 'Aksi', 'Point', 'Detik', 'AKA', 'AO', 'Keterangan']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [60, 60, 60],
          textColor: 255,
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 9
        },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' },
          1: { cellWidth: 60 },
          2: { cellWidth: 18, halign: 'center' },
          3: { cellWidth: 18, halign: 'center' },
          4: { cellWidth: 18, halign: 'center' },
          5: { cellWidth: 18, halign: 'center' },
          6: { cellWidth: 35 } // Fixed width for description
        },
        margin: { left: 15, right: 15 },
        styles: {
          overflow: 'linebreak',
          cellPadding: 2.5,
          lineWidth: 0.1
        }
      })

      // Add simple statistics - Pastikan ada cukup ruang
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const finalY = (doc as any).lastAutoTable?.finalY || startY

      // Cek apakah masih ada ruang di halaman ini
      if (finalY < pageHeight - 50) {
        addStatisticsOnCurrentPage(doc, sortedData, finalY)
      } else {
        // Jika tidak ada ruang, buat halaman baru
        doc.addPage()
        addStatisticsOnCurrentPage(doc, sortedData, 20)
      }

      // Add footer to all pages
      const totalPages = doc.getNumberOfPages()

      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)

        doc.setFontSize(8)
        doc.setTextColor(100, 100, 100)

        // Footer line
        doc.setDrawColor(200, 200, 200)
        doc.setLineWidth(0.3)
        doc.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15)

        // Page number
        doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth / 2, pageHeight - 10, {
          align: 'center'
        })

        // Generated info - hanya di halaman pertama
        if (i === 1) {
          const now = new Date()
          const generatedTime = now.toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
          doc.text(`Dibuat: ${generatedTime}`, 20, pageHeight - 10)
        }
      }

      // Save PDF
      const now = new Date()
      const fileName = `Log_Pertandingan_${match?.match_number || '0'}_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}.pdf`

      doc.save(fileName)
      console.log('PDF berhasil dibuat:', fileName)
    } catch (error) {
      console.error('Gagal membuat PDF:', error)
      throw error
    }
  }

  // Helper function untuk menambahkan statistik
  const addStatisticsOnCurrentPage = (
    doc: jsPDF,
    sortedData: ILogScoring[],
    startY: number
  ): void => {
    let currentY = startY + 15

    // Add statistics title
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('RINGKASAN PERTANDINGAN', 20, currentY)
    currentY += 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    // Calculate statistics
    const akaActions = sortedData.filter((log) => log.action.includes('AKA')).length
    const aoActions = sortedData.filter((log) => log.action.includes('AO')).length
    const ipponCount = sortedData.filter((log) => log.action.includes('Ippon')).length
    const wazaCount = sortedData.filter((log) => log.action.includes('Waza')).length
    const yukoCount = sortedData.filter((log) => log.action.includes('Yuko')).length
    const warningCount = sortedData.filter((log) => log.action.includes('WARN')).length
    const senshuCount = sortedData.filter((log) => log.action.includes('SENSHU')).length
    const penaltyCount = sortedData.filter((log) => log.point < 0).length

    // Statistics in two columns dengan spacing yang tepat
    const leftColX = 25
    const rightColX = 100
    const lineHeight = 6

    // Left column
    doc.text(`Total Aksi: ${sortedData.length}`, leftColX, currentY)
    doc.text(`Aksi AKA: ${akaActions}`, leftColX, currentY + lineHeight)
    doc.text(`Aksi AO: ${aoActions}`, leftColX, currentY + lineHeight * 2)
    doc.text(`Peringatan: ${warningCount}`, leftColX, currentY + lineHeight * 3)
    doc.text(`Penalty: ${penaltyCount}`, leftColX, currentY + lineHeight * 4)

    // Right column
    doc.text(`Ippon: ${ipponCount}`, rightColX, currentY)
    doc.text(`Waza-ari: ${wazaCount}`, rightColX, currentY + lineHeight)
    doc.text(`Yuko: ${yukoCount}`, rightColX, currentY + lineHeight * 2)
    doc.text(`Senshu: ${senshuCount}`, rightColX, currentY + lineHeight * 3)

    // Score progression - di bawah kolom statistik
    currentY += lineHeight * 5 + 5
  }

  const handleConfirmClosePage = (): void => {
    const payloadIpc = {
      type: 'WAITING_DISPLAY'
    }
    window.electron?.ipcRenderer.send('mirror-to-main', payloadIpc)
    navigate('/')
  }

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
    addScoreAka,
    addScoreAo,
    toggleWarningAka,
    toggleWarningAo,
    senshu,
    setSenshu,
    isReady,
    sendDataToDisplay,
    winnerDeclared,
    setWinnerDeclared,
    winnerInfo,
    handleConfirmClosePage,
    dataLogActivityMatch,
    handlePrintLogActivity,
    fetchLogActivityMatch
  }
}
