import { Button } from '@renderer/components/ui/button'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { AlertCircle, Clock, Pause, Play, Swords, Trophy } from 'lucide-react'
import React, { JSX } from 'react'
import { useNavigate } from 'react-router-dom'
import { IPrintData } from './hook/useIndex'
import { UseHistory } from './hook/useHistory'

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate()
  const { dataMatch, sizes2, screenSize, dataLogActivityMatch, handlePrintLogActivity } =
    UseHistory()

  // Calculate final scores from log activity
  const scoreAka =
    dataLogActivityMatch.length > 0
      ? dataLogActivityMatch[dataLogActivityMatch.length - 1].red_score
      : 0
  const scoreAo =
    dataLogActivityMatch.length > 0
      ? dataLogActivityMatch[dataLogActivityMatch.length - 1].blue_score
      : 0

  // Get match info from dataMatch
  const currentRound = dataMatch?.round_number || 1
  const totalRounds = 3 // Default value, bisa disesuaikan dengan config

  // Determine winner info from match data
  const winnerInfo = {
    winner: dataMatch?.winner
      ? dataMatch.winner.full_name
      : scoreAka > scoreAo
        ? dataMatch?.red_corner.full_name || 'AKA'
        : scoreAo > scoreAka
          ? dataMatch?.blue_corner.full_name || 'AO'
          : 'Seri',
    winnerColor:
      dataMatch?.winner_id === dataMatch?.red_corner_id
        ? ('red' as const)
        : dataMatch?.winner_id === dataMatch?.blue_corner_id
          ? ('blue' as const)
          : scoreAka > scoreAo
            ? ('red' as const)
            : scoreAo > scoreAka
              ? ('blue' as const)
              : ('draw' as const)
  }

  const getActionIcon = (action: string): JSX.Element => {
    if (action.includes('Ippon')) return <Trophy className="w-4 h-4 text-yellow-500" />
    if (action.includes('Waza')) return <Swords className="w-4 h-4 text-orange-500" />
    if (action.includes('Yuko')) return <Swords className="w-4 h-4 text-amber-500" />
    if (action.includes('WARN')) return <AlertCircle className="w-4 h-4 text-red-400" />
    if (action.includes('START')) return <Play className="w-4 h-4 text-green-500" />
    if (action.includes('PAUSE')) return <Pause className="w-4 h-4 text-yellow-500" />
    return <Clock className="w-4 h-4 text-gray-400" />
  }

  // Helper function untuk mendapatkan warna border berdasarkan action
  const getActionBorderColor = (action: string): string => {
    if (action.includes('AKA') || action.includes('aka')) return 'border-l-red-500'
    if (action.includes('AO') || action.includes('ao')) return 'border-l-blue-500'
    if (action.includes('SENSHU')) return 'border-l-yellow-500'
    return 'border-l-gray-500'
  }

  const sortedLogs = [...dataLogActivityMatch].sort(
    (a, b) => (a.time_seconds as unknown as number) - (b.time_seconds as unknown as number)
  )

  const handlePrint = (): void => {
    const payload: IPrintData = {
      data: sortedLogs,
      match: dataMatch!,
      matchInfo: {
        scoreAka,
        scoreAo,
        winner: winnerInfo.winner
      }
    }
    handlePrintLogActivity(payload)
  }

  return (
    <>
      <div
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex"
        style={{
          width: `${screenSize.width - 80}px`,
          height: `${screenSize.height > 758 ? screenSize.height * 0.953 : screenSize.height * 0.945}px`,
          overflow: 'hidden'
        }}
      >
        {/* Left Side - Winner Display */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-center max-w-3xl w-full">
            <div
              className="text-white font-bold mb-8 animate-pulse"
              style={{ fontSize: `${sizes2.logoFont * 1.5}px` }}
            >
              PERTANDINGAN SELESAI
            </div>

            <div
              className={`p-8 rounded-2xl shadow-2xl mb-8 border-8 transition-all duration-300 hover:scale-[1.02] ${
                winnerInfo.winnerColor === 'red'
                  ? 'border-red-500 bg-gradient-to-r from-red-900/50 to-red-800/30'
                  : winnerInfo.winnerColor === 'blue'
                    ? 'border-blue-500 bg-gradient-to-r from-blue-900/50 to-blue-800/30'
                    : 'border-yellow-500 bg-gradient-to-r from-yellow-900/50 to-yellow-800/30'
              }`}
            >
              <div
                className="text-6xl font-extrabold mb-4"
                style={{
                  color:
                    winnerInfo.winnerColor === 'red'
                      ? '#ef4444'
                      : winnerInfo.winnerColor === 'blue'
                        ? '#3b82f6'
                        : '#eab308'
                }}
              >
                {winnerInfo.winner === 'Seri' ? 'SERI' : 'PEMENANG'}
              </div>

              {winnerInfo.winner !== 'Seri' && (
                <>
                  <div
                    className="text-5xl font-bold mb-6"
                    style={{
                      color: winnerInfo.winnerColor === 'red' ? '#f87171' : '#60a5fa'
                    }}
                  >
                    {winnerInfo.winner}
                  </div>
                  <div
                    className="text-3xl font-semibold"
                    style={{
                      color: winnerInfo.winnerColor === 'red' ? '#dc2626' : '#2563eb'
                    }}
                  >
                    {winnerInfo.winnerColor === 'red' ? '(AKA - Red)' : '(AO - Blue)'}
                  </div>
                </>
              )}

              {winnerInfo.winner === 'Seri' && (
                <div className="text-4xl font-bold text-yellow-400 mt-4">DRAW</div>
              )}
            </div>

            {/* Final Scores */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* AKA Score */}
              <div className="text-center transition-transform hover:scale-105">
                <div className="text-red-400 text-2xl font-bold mb-2 truncate">
                  {dataMatch?.red_corner.full_name}
                </div>
                <div className="text-red-500 text-7xl font-extrabold">{scoreAka}</div>
                <div className="text-white text-lg mt-2">Final Score</div>
              </div>

              {/* AO Score */}
              <div className="text-center transition-transform hover:scale-105">
                <div className="text-blue-400 text-2xl font-bold mb-2 truncate">
                  {dataMatch?.blue_corner.full_name}
                </div>
                <div className="text-blue-500 text-7xl font-extrabold">{scoreAo}</div>
                <div className="text-white text-lg mt-2">Final Score</div>
              </div>
            </div>

            {/* Match Info */}
            <div className="text-white text-xl font-semibold mb-8 bg-slate-800/50 p-4 rounded-lg">
              <div className="flex items-center justify-center space-x-4">
                <span>
                  Round {currentRound} / {totalRounds}
                </span>
                <span className="text-gray-400">•</span>
                <span>{sortedLogs.length} Total Actions</span>
              </div>
            </div>

            {/* Return Button */}
            <Button
              onClick={() => {
                const payloadIpc = {
                  type: 'WAITING_DISPLAY'
                }
                window.electron?.ipcRenderer.send('mirror-to-main', payloadIpc)
                navigate('/')
              }}
              className="text-white font-bold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-12 py-6 text-xl transition-all hover:scale-105 shadow-lg"
            >
              Kembali ke Menu Utama
            </Button>
          </div>
        </div>

        {/* Right Side - Log Activity */}
        <div className="w-1/3 bg-slate-900/80 border-l border-slate-700 flex flex-col h-full">
          <div className="p-6 border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-800 rounded-lg">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Match Activity Log</h2>
                <p className="text-sm text-gray-400">Timeline of all scoring actions</p>
              </div>
              <div>
                <Button
                  onClick={() => handlePrint()}
                  className=" bg-green-500 text-white px-4 py-2 rounded"
                >
                  Export Data
                </Button>
              </div>
            </div>
          </div>

          {/* Logs List */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="p-6 pt-4 space-y-3">
                <div className="text-sm text-gray-400 font-medium mb-3 px-2">
                  Latest Activities ({sortedLogs.length})
                </div>
                {sortedLogs.length > 0 ? (
                  sortedLogs.map((log, index) => (
                    <div
                      key={`log-${log.id || index}`}
                      className={`p-3 rounded-md border-l-4 bg-slate-800/30 hover:bg-slate-800/50 transition-colors ${getActionBorderColor(log.action)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          <div className="mt-0.5 flex-shrink-0">{getActionIcon(log.action)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-200 truncate">
                              {log.action}
                            </div>
                            <div className="flex items-center flex-wrap gap-2 mt-2">
                              <span className="text-xs px-2 py-1 bg-gray-800/50 rounded text-gray-300">
                                Point: {log.point > 0 ? `+${log.point}` : log.point}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 ml-2 whitespace-nowrap flex-shrink-0">
                          {/* {formatTime(log.time)} */}
                          Time: {Number(log.time_seconds).toFixed(1)}s
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-2">No activity logs recorded</div>
                    <div className="text-sm text-gray-600">Scoring actions will appear here</div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Summary Footer */}
          <div className="p-4 border-t border-slate-700 bg-slate-900/50 flex-shrink-0">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-400">{scoreAka}</div>
                <div className="text-xs text-red-300 mt-1">AKA Final</div>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="text-2xl font-bold text-white">{Math.abs(scoreAka - scoreAo)}</div>
                <div className="text-xs text-gray-300 mt-1">Point Diff</div>
              </div>
              <div className="p-3 bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{scoreAo}</div>
                <div className="text-xs text-blue-300 mt-1">AO Final</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
