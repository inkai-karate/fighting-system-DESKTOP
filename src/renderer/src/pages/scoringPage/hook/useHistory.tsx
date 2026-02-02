import MatchService from '@renderer/services/matchService'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useScreenResponsive } from './useScreenResponsive'
import { IMatch } from '@renderer/interface/match.interface'
import LogScoringService from '@renderer/services/logScoringService'
import { ILogScoring } from '@renderer/interface/logScoring.interface'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import autoTable from 'jspdf-autotable'

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
export const UseHistory = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const matchService = MatchService()
  const logScoringService = LogScoringService()

  const [dataMatch, setDataMatch] = useState<IMatch>()
  const [dataLogActivityMatch, setDataLogActivityMatch] = useState<ILogScoring[]>([])

  const { screenSize, sizes2 } = useScreenResponsive()

  const fetchLogActivityMatch = async (id): Promise<ILogScoring[]> => {
    try {
      const response = await logScoringService.getAllLogMatchScoring(id || 0)
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
        fetchLogActivityMatch(response.data?.id)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchDetailMatch()
  }, [id])

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

  return {
    dataMatch,
    sizes2,
    screenSize,
    dataLogActivityMatch,
    handlePrintLogActivity
  }
}
