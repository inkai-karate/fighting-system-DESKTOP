import React, { JSX } from 'react'
import { Button } from '@renderer/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { Checkbox } from '@renderer/components/ui/checkbox'
import {
  Play,
  RotateCcw,
  Plus,
  Minus,
  Pause,
  Clock,
  Trophy,
  Swords,
  AlertCircle
} from 'lucide-react'
import { IPrintData, UseIndex } from './hook/useIndex'
import { MyAlertDialog } from '@renderer/components/core/MyAlertDialog'
import { useNavigate } from 'react-router-dom'
import { ScrollArea } from '@renderer/components/ui/scroll-area'

export const ScoringPage2: React.FC = () => {
  const navigate = useNavigate()
  const {
    handleConfirmWinner,
    matchFinished,
    setMatchFinished,
    confirmClosePage,
    setConfirmClosePage,
    dataMatch,
    setSeconds,
    scoreAka,
    scoreAo,
    currentRound,
    totalRounds,
    setTotalRounds,
    warningsAka,
    warningsAo,
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
    addScoreAka,
    addScoreAo,
    toggleWarningAka,
    toggleWarningAo,
    setCurrentRound,
    senshu,
    isReady,
    winnerDeclared,
    winnerInfo,
    handleConfirmClosePage,
    dataLogActivityMatch,
    handlePrintLogActivity
  } = UseIndex()

  if (!isReady) {
    return (
      <div className="w-screen h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  // Helper function untuk mendapatkan icon berdasarkan action
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

  // Sort logs by time descending (latest first)
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
        winner: winnerInfo ? winnerInfo.winner : 'N/A'
      }
    }
    handlePrintLogActivity(payload)
  }

  if (winnerDeclared && winnerInfo) {
    return (
      <div
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex"
        style={{
          width: `${screenSize.width}px`,
          height: `${screenSize.height > 758 ? screenSize.height * 0.9375 : screenSize.height * 0.945}px`,
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
                window.electron?.ipcRenderer.send('scoring-to-main', payloadIpc)
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
    )
  }

  return (
    <div
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      style={{
        width: `${screenSize.width}px`,
        height: `${screenSize.height > 758 ? screenSize.height * 0.9375 : screenSize.height * 0.945}px`,
        overflow: 'hidden'
      }}
    >
      <div className="w-full h-full grid grid-cols-12 gap-0">
        {/* Control Panel Left - AKA */}
        <div className="col-span-4 bg-slate-800/50 border-r border-slate-700 backdrop-blur flex flex-col overflow-hidden">
          <div
            className="flex-1 flex flex-col justify-between overflow-y-auto scrollbar-hide"
            style={{
              padding: `${sizes2.containerPadding}px`
            }}
          >
            {/* Score Buttons AO - Top */}
            <div className="flex flex-col" style={{ gap: `${sizes2.sectionGap}px` }}>
              <div className="flex-shrink-0">
                <h3
                  className="text-red-500 font-bold border-b border-slate-700"
                  style={{
                    fontSize: `${sizes2.sectionTitleFont}px`,
                    paddingBottom: `${sizes2.gridGap / 2}px`,
                    marginBottom: `${sizes2.gridGap}px`
                  }}
                >
                  AKA (Red) Scoring
                </h3>
                <div
                  className="grid grid-cols-3"
                  style={{ gap: `${sizes2.gridGap}px`, marginBottom: `${sizes2.gridGap}px` }}
                >
                  {scoreButtons.map((btn) => (
                    <button
                      key={`aka-${btn.label}`}
                      onClick={() =>
                        addScoreAka(
                          `${dataMatch?.red_corner.full_name + ' | ' + btn.label + ' | ' || `AKA ${btn.label}`}`,
                          btn.value
                        )
                      }
                      className={`border-red-600 hover:border-red-800 cursor-pointer rounded-md text-white font-semibold p-1 flex flex-col items-center justify-center border-2 hover:text-white hover:bg-transparent`}
                      style={{
                        height: `${sizes2.scoreButtonHeight}px`,
                        fontSize: `${sizes2.smallTextFont}px`
                      }}
                    >
                      <span className="text-red-400 font-extrabold text-base/8">{btn.label}</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3" style={{ gap: `${sizes2.gridGap}px` }}>
                  {penaltyButtons.map((btn) => (
                    <button
                      key={`aka-penalty-${btn.label}`}
                      onClick={() =>
                        addScoreAka(
                          `${dataMatch?.red_corner.full_name + ' | ' + btn.label + ' | ' || `AKA ${btn.label}`}`,
                          btn.value
                        )
                      }
                      className={`border-gray-500 hover:border-gray-800 cursor-pointer rounded-md text-white p-1 border-2 hover:text-white hover:bg-transparent`}
                      style={{
                        height: `${sizes2.penaltyButtonHeight}px`,
                        fontSize: `${sizes2.smallTextFont}px`
                      }}
                    >
                      <span className="text-red-400 text-base/8">{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Warnings AKA */}
              <div className="flex-shrink-0">
                <h3
                  className="text-red-500 font-bold border-b border-slate-700"
                  style={{
                    fontSize: `${sizes2.sectionTitleFont}px`,
                    paddingBottom: `${sizes2.gridGap / 2}px`,
                    marginBottom: `${sizes2.gridGap}px`
                  }}
                >
                  AKA WARNING
                </h3>
                <div className="grid grid-cols-5" style={{ gap: `${sizes2.gridGap}px` }}>
                  {Object.entries(warningsAka).map(([key, value]) => (
                    <div
                      key={`aka-warn-${key}`}
                      className="flex flex-col items-center"
                      style={{ gap: `${sizes2.gridGap / 2}px` }}
                    >
                      <Checkbox
                        checked={value}
                        onCheckedChange={(checked) => toggleWarningAka(key, checked as boolean)}
                        className="border-red-500"
                        style={{
                          height: `${sizes2.checkboxSize}px`,
                          width: `${sizes2.checkboxSize}px`
                        }}
                      />
                      <span
                        className="text-red-400 font-semibold uppercase"
                        style={{ fontSize: `${sizes2.tinyTextFont}px` }}
                      >
                        {key.replace('w', '')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Score Buttons AKA */}
            <div className="flex flex-col" style={{ gap: `${sizes2.sectionGap}px` }}>
              {/* Timer Controls */}
              <div className="flex-shrink-0 mb-1">
                <div className="flex items-center justify-between" style={{ marginBottom: `15px` }}>
                  <span
                    className="text-white font-medium"
                    style={{ fontSize: `${sizes2.smallTextFont}px` }}
                  >
                    Timer:
                  </span>
                  <div className="flex items-center" style={{ gap: `${sizes2.gridGap}px` }}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="p-0 bg-slate-700 border-slate-600 hover:bg-slate-600"
                      style={{
                        height: `${sizes2.timerButtonHeight}px`,
                        width: `${sizes2.timerButtonHeight}px`
                      }}
                      onClick={() => setSeconds(Math.max(5, seconds - 5))}
                    >
                      <Minus
                        style={{ width: `${sizes2.iconSmall}px`, height: `${sizes2.iconSmall}px` }}
                        className="text-white"
                      />
                    </Button>
                    <span
                      className="text-white font-bold text-center"
                      style={{
                        fontSize: `${sizes2.smallTextFont}px`,
                        minWidth: `${sizes2.timerButtonHeight * 1.2}px`
                      }}
                    >
                      {seconds}s
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="p-0 bg-slate-700 border-slate-600 hover:bg-slate-600"
                      style={{
                        height: `${sizes2.timerButtonHeight}px`,
                        width: `${sizes2.timerButtonHeight}px`
                      }}
                      onClick={() => setSeconds(seconds + 5)}
                    >
                      <Plus
                        style={{ width: `${sizes2.iconSmall}px`, height: `${sizes2.iconSmall}px` }}
                        className="text-white"
                      />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2" style={{ gap: `${sizes2.gridGap}px` }}>
                  <Button
                    onClick={handleReset}
                    className="bg-red-600 hover:bg-red-700 text-white"
                    style={{
                      height: `${sizes2.timerButtonHeight}px`,
                      fontSize: `${sizes2.smallTextFont}px`
                    }}
                  >
                    <RotateCcw
                      style={{
                        marginRight: '4px',
                        width: `${sizes2.iconSmall}px`,
                        height: `${sizes2.iconSmall}px`
                      }}
                    />
                    Reset
                  </Button>
                  <Button
                    onClick={() => setTimeLeft(timeLeft + 10)}
                    className="bg-slate-700 hover:bg-slate-600 text-white"
                    style={{
                      height: `${sizes2.timerButtonHeight}px`,
                      fontSize: `${sizes2.smallTextFont}px`
                    }}
                  >
                    <Plus
                      style={{
                        marginRight: '4px',
                        width: `${sizes2.iconSmall}px`,
                        height: `${sizes2.iconSmall}px`
                      }}
                    />
                    10s
                  </Button>
                </div>
              </div>

              {/* Round Selector */}
              <div className="flex-shrink-0">
                {/* Reset Everything Button */}
                <Button
                  onClick={handleResetAll}
                  className="text-white w-full font-bold bg-red-700 hover:bg-red-800 flex-shrink-0"
                  style={{
                    height: `${sizes2.resetButtonHeight}px`,
                    fontSize: `${sizes2.buttonTextFont}px`
                  }}
                >
                  <RotateCcw
                    style={{
                      marginRight: '8px',
                      width: `${sizes2.iconMedium}px`,
                      height: `${sizes2.iconMedium}px`
                    }}
                  />
                  Reset Everything
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Display Board Center */}
        <div
          className="col-span-4 bg-black flex flex-col justify-between overflow-hidden"
          style={{ padding: `${sizes2.containerPadding * 2}px` }}
        >
          {/* Logo and Timer */}
          <div className="text-center">
            <div
              className="text-white font-bold tracking-wider"
              style={{
                fontSize: `${sizes2.logoFont}px`,
                marginBottom: `${sizes2.gridGap}px`
              }}
            >
              INKAI
            </div>
            <div
              className="text-white font-bold font-mono tracking-tight"
              style={{ fontSize: `${sizes2.timerFont}px` }}
            >
              {Math.floor(timeLeft / 60)}:
              {Math.floor(timeLeft % 60)
                .toString()
                .padStart(2, '0')}
              <span style={{ fontSize: `${sizes2.timerDecimalFont}px` }}>
                .{Math.floor((timeLeft % 1) * 10)}
              </span>
            </div>
          </div>

          {/* Scores with Senshu Indicator */}
          <div className="grid grid-cols-2" style={{ gap: `${sizes2.containerPadding * 3}px` }}>
            {/* AKA */}
            <div className="text-center">
              <div
                className="text-red-500 font-bold"
                style={{
                  fontSize: `${sizes2.scoreLabelFont}px`,
                  marginBottom: `${sizes2.gridGap * 2}px`
                }}
              >
                {dataMatch?.red_corner.full_name}
              </div>
              <div
                className="flex items-center justify-center"
                style={{ gap: `${sizes2.gridGap * 2}px` }}
              >
                {/* Senshu Indicator - Circle */}
                <div
                  className={`rounded-full border-4 transition-all ${
                    senshu === 'aka'
                      ? 'border-yellow-400 bg-yellow-400/20'
                      : 'border-slate-700 bg-transparent'
                  }`}
                  style={{
                    width: `${sizes2.scoreFont * 0.25}px`,
                    height: `${sizes2.scoreFont * 0.25}px`,
                    minWidth: '30px',
                    minHeight: '30px'
                  }}
                />
                <div
                  className="text-red-500 font-bold leading-none"
                  style={{ fontSize: `${sizes2.scoreFont}px` }}
                >
                  {scoreAka}
                </div>
              </div>
            </div>

            {/* AO */}
            <div className="text-center">
              <div
                className="text-blue-500 font-bold"
                style={{
                  fontSize: `${sizes2.scoreLabelFont}px`,
                  marginBottom: `${sizes2.gridGap * 2}px`
                }}
              >
                {dataMatch?.blue_corner.full_name}
              </div>
              <div
                className="flex items-center justify-center"
                style={{ gap: `${sizes2.gridGap * 2}px` }}
              >
                <div
                  className="text-blue-500 font-bold leading-none"
                  style={{ fontSize: `${sizes2.scoreFont}px` }}
                >
                  {scoreAo}
                </div>
                {/* Senshu Indicator - Circle */}
                <div
                  className={`rounded-full border-4 transition-all ${
                    senshu === 'ao'
                      ? 'border-yellow-400 bg-yellow-400/20'
                      : 'border-slate-700 bg-transparent'
                  }`}
                  style={{
                    width: `${sizes2.scoreFont * 0.25}px`,
                    height: `${sizes2.scoreFont * 0.25}px`,
                    minWidth: '30px',
                    minHeight: '30px'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Warnings Display */}
          <div className="grid grid-cols-2" style={{ gap: `${sizes2.containerPadding * 3}px` }}>
            {/* AKA Warnings */}
            <div>
              <div
                className="text-red-500 font-bold"
                style={{
                  fontSize: `${sizes2.warningFont}px`,
                  marginBottom: `${sizes2.gridGap}px`
                }}
              >
                WARNING
              </div>
              <div
                className="flex justify-start text-red-400"
                style={{
                  gap: `${sizes2.gridGap * 2}px`,
                  fontSize: `${sizes2.warningFont}px`
                }}
              >
                {Object.entries(warningsAka).map(([key, value]) => (
                  <span
                    key={key}
                    className={`text-[25px] ${value ? 'opacity-100 font-bold' : 'opacity-30'}`}
                  >
                    {key.replace('w', '').toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* AO Warnings */}
            <div>
              <div
                className="text-blue-500 font-bold text-end"
                style={{
                  fontSize: `${sizes2.warningFont}px`,
                  marginBottom: `${sizes2.gridGap}px`
                }}
              >
                WARNING
              </div>
              <div
                className="flex justify-end text-blue-400"
                style={{
                  gap: `${sizes2.gridGap * 2}px`,
                  fontSize: `${sizes2.warningFont}px`
                }}
              >
                {Object.entries(warningsAo)
                  .toReversed()
                  .map(([key, value]) => (
                    <span
                      key={key}
                      className={`text-[25px] ${value ? 'opacity-100 font-bold' : 'opacity-30'}`}
                    >
                      {key.replace('w', '').toUpperCase()}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Round Display */}
          <div className="text-center">
            <div className="text-white font-bold" style={{ fontSize: `${sizes2.roundFont}px` }}>
              Round {currentRound} / {totalRounds}
            </div>
          </div>
        </div>

        {/* Control Panel Right - AO */}
        <div className="col-span-4 bg-slate-800/50 border-l border-slate-700 backdrop-blur flex flex-col overflow-hidden">
          <div
            className="flex-1 flex flex-col justify-between overflow-y-auto scrollbar-hide"
            style={{
              padding: `${sizes2.containerPadding}px`
            }}
          >
            {/* Score Buttons AO - Top */}
            <div className="flex flex-col" style={{ gap: `${sizes2.sectionGap}px` }}>
              <div className="flex-shrink-0">
                <h3
                  className="text-blue-500 text-end font-bold border-b border-slate-700"
                  style={{
                    fontSize: `${sizes2.sectionTitleFont}px`,
                    paddingBottom: `${sizes2.gridGap / 2}px`,
                    marginBottom: `${sizes2.gridGap}px`
                  }}
                >
                  AO (Blue) Scoring
                </h3>
                <div
                  className="grid grid-cols-3"
                  style={{ gap: `${sizes2.gridGap}px`, marginBottom: `${sizes2.gridGap}px` }}
                >
                  {scoreButtons.toReversed().map((btn) => (
                    <button
                      key={`ao-${btn.label}`}
                      onClick={() =>
                        addScoreAo(
                          `${dataMatch?.blue_corner.full_name + ' | ' + btn.label + ' | ' || `AO ${btn.label}`}`,
                          btn.value
                        )
                      }
                      className={`border-blue-500 hover:border-blue-800 cursor-pointer rounded-md text-white font-semibold p-1 flex flex-col items-center justify-center border-2 hover:text-white hover:bg-transparent`}
                      style={{
                        height: `${sizes2.scoreButtonHeight}px`,
                        fontSize: `${sizes2.smallTextFont}px`
                      }}
                    >
                      <span className="text-blue-400 font-extrabold text-base/8">{btn.label}</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3" style={{ gap: `${sizes2.gridGap}px` }}>
                  {penaltyButtons.map((btn) => (
                    <button
                      key={`ao-penalty-${btn.label}`}
                      onClick={() =>
                        addScoreAo(
                          `${dataMatch?.blue_corner.full_name + ' | ' + btn.label + ' | ' || `AO ${btn.label}`}`,
                          btn.value
                        )
                      }
                      className={`border-gray-500 hover:border-gray-800 rounded-md cursor-pointer text-white p-1 border-2 hover:text-white hover:bg-transparent`}
                      style={{
                        height: `${sizes2.penaltyButtonHeight}px`,
                        fontSize: `${sizes2.smallTextFont}px`
                      }}
                    >
                      <span className="text-blue-400 text-base/8">{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Warnings AO */}
              <div className="flex-shrink-0">
                <h3
                  className="text-end text-blue-500 font-bold border-b border-slate-700"
                  style={{
                    fontSize: `${sizes2.sectionTitleFont}px`,
                    paddingBottom: `${sizes2.gridGap / 2}px`,
                    marginBottom: `${sizes2.gridGap}px`
                  }}
                >
                  AO WARNING
                </h3>
                <div className="grid grid-cols-5" style={{ gap: `${sizes2.gridGap}px` }}>
                  {Object.entries(warningsAo)
                    .toReversed()
                    .map(([key, value]) => (
                      <div
                        key={`ao-warn-${key}`}
                        className="flex flex-col items-center"
                        style={{ gap: `${sizes2.gridGap / 2}px` }}
                      >
                        <Checkbox
                          checked={value}
                          onCheckedChange={(checked) => toggleWarningAo(key, checked as boolean)}
                          className="border-blue-500"
                          style={{
                            height: `${sizes2.checkboxSize}px`,
                            width: `${sizes2.checkboxSize}px`
                          }}
                        />
                        <span
                          className="text-blue-400 font-semibold uppercase"
                          style={{ fontSize: `${sizes2.tinyTextFont}px` }}
                        >
                          {key.replace('w', '')}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex flex-col" style={{ gap: `${sizes2.sectionGap}px` }}>
              {/* Round Selector */}
              <div className="flex-shrink-0">
                <div
                  className="flex items-center justify-between"
                  style={{ gap: `${sizes2.gridGap}px`, marginBottom: `15px` }}
                >
                  {/* Bagian kiri: Round dan dropdown */}
                  <div className="flex items-center" style={{ gap: `${sizes2.gridGap}px` }}>
                    <span
                      className="text-white font-medium"
                      style={{ fontSize: `${sizes2.smallTextFont}px` }}
                    >
                      Round:
                    </span>
                    <Select
                      value={currentRound.toString()}
                      onValueChange={(v) => setCurrentRound(parseInt(v))}
                    >
                      <SelectTrigger
                        className="bg-slate-700 border-slate-600"
                        style={{
                          width: `${sizes2.selectHeight * 1.9}px`,
                          height: `${sizes2.selectHeight}px`,
                          fontSize: `${sizes2.smallTextFont}px`
                        }}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span
                      className="text-white font-medium"
                      style={{ fontSize: `${sizes2.smallTextFont}px` }}
                    >
                      of
                    </span>
                    <Select
                      value={totalRounds.toString()}
                      onValueChange={(v) => setTotalRounds(parseInt(v))}
                    >
                      <SelectTrigger
                        className="bg-slate-700 border-slate-600"
                        style={{
                          width: `${sizes2.selectHeight * 1.9}px`,
                          height: `${sizes2.selectHeight}px`,
                          fontSize: `${sizes2.smallTextFont}px`
                        }}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Bagian kanan: Tombol Prev dan Next */}
                  <div className="grid grid-cols-2" style={{ gap: `${sizes2.gridGap}px` }}>
                    <Button
                      onClick={() => setCurrentRound(Math.max(1, currentRound - 1))}
                      variant="outline"
                      className="text-white bg-slate-700 border-slate-600 hover:bg-slate-600"
                      style={{
                        height: `${sizes2.roundButtonHeight}px`,
                        fontSize: `${sizes2.smallTextFont}px`
                      }}
                    >
                      ← Prev
                    </Button>
                    <Button
                      onClick={() => setCurrentRound(Math.min(totalRounds, currentRound + 1))}
                      variant="outline"
                      className="text-white bg-slate-700 border-slate-600 hover:bg-slate-600"
                      style={{
                        height: `${sizes2.roundButtonHeight}px`,
                        fontSize: `${sizes2.smallTextFont}px`
                      }}
                    >
                      Next →
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleStartStop}
                  className="w-[100%] text-white font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex-shrink-0"
                  style={{
                    height: `${sizes2.timerButtonHeight}px`,
                    fontSize: `${sizes2.buttonTextFont}px`
                  }}
                >
                  {isRunning ? (
                    <Pause
                      style={{
                        marginRight: '8px',
                        width: `${sizes2.iconMedium}px`,
                        height: `${sizes2.iconMedium}px`
                      }}
                    />
                  ) : (
                    <Play
                      style={{
                        marginRight: '8px',
                        width: `${sizes2.iconMedium}px`,
                        height: `${sizes2.iconMedium}px`
                      }}
                    />
                  )}
                  {isRunning ? 'PAUSE' : 'START'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MyAlertDialog
        open={confirmClosePage.open}
        title="Konfirmasi Tutup Halaman"
        description="Apakah Anda yakin ingin menutup halaman ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Tutup"
        confirmColor="bg-red-600 hover:bg-red-700 text-white"
        onConfirm={() => handleConfirmClosePage()}
        onOpenChange={(open) => setConfirmClosePage({ open, id: null })}
      />

      {/* Match finished modal */}
      <MyAlertDialog
        open={matchFinished.open}
        title="Pertandingan Selesai"
        description={
          matchFinished.winner === 'Seri'
            ? 'Pertandingan berakhir seri.'
            : `Pertandingan telah selesai, dimenangkan oleh ${matchFinished.winner}`
        }
        confirmText="Konfirmasi Pemenang"
        confirmColor="bg-green-600 hover:bg-green-700 text-white"
        onConfirm={async () => await handleConfirmWinner()}
        onOpenChange={(open) => setMatchFinished({ open, winner: matchFinished.winner })}
      />
    </div>
  )
}
