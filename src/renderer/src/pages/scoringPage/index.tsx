import React from 'react'
import { Button } from '@renderer/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { Checkbox } from '@renderer/components/ui/checkbox'
import { Play, RotateCcw, Plus, Minus, Pause } from 'lucide-react'
import { UseIndex } from './hook/useIndex'

export const ScoringPage: React.FC = () => {
  const {
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
    setCurrentRound
  } = UseIndex()
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
        {/* Control Panel */}
        <div className="col-span-6 bg-slate-800/50 border-r border-slate-700 backdrop-blur flex flex-col overflow-hidden">
          <div
            className="flex-1 flex flex-col overflow-y-auto scrollbar-hide"
            style={{
              padding: `${sizes1.containerPadding}px`,
              gap: `${sizes1.sectionGap}px`
            }}
          >
            {/* Start/Stop Button */}

            {/* Timer Controls */}
            <div className="flex-shrink-0">
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: `${sizes1.gridGap}px` }}
              >
                <Button
                  onClick={handleStartStop}
                  className="w-[50%] text-white font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex-shrink-0"
                  style={{
                    height: `${sizes1.timerButtonHeight}px`,
                    fontSize: `${sizes1.buttonTextFont}px`
                  }}
                >
                  {isRunning ? (
                    <Pause
                      style={{
                        marginRight: '8px',
                        width: `${sizes1.iconMedium}px`,
                        height: `${sizes1.iconMedium}px`
                      }}
                    />
                  ) : (
                    <Play
                      style={{
                        marginRight: '8px',
                        width: `${sizes1.iconMedium}px`,
                        height: `${sizes1.iconMedium}px`
                      }}
                    />
                  )}
                  {isRunning ? 'PAUSE' : 'START'}
                </Button>
                <span
                  className="text-white font-medium"
                  style={{ fontSize: `${sizes1.smallTextFont}px` }}
                >
                  Timer:
                </span>
                <div className="flex items-center" style={{ gap: `${sizes1.gridGap}px` }}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-0 bg-slate-700 border-slate-600 hover:bg-slate-600"
                    style={{
                      height: `${sizes1.timerButtonHeight}px`,
                      width: `${sizes1.timerButtonHeight}px`
                    }}
                    onClick={() => setSeconds(Math.max(5, seconds - 5))}
                  >
                    <Minus
                      style={{ width: `${sizes1.iconSmall}px`, height: `${sizes1.iconSmall}px` }}
                      className="text-white"
                    />
                  </Button>
                  <span
                    className="text-white font-bold text-center"
                    style={{
                      fontSize: `${sizes1.smallTextFont}px`,
                      minWidth: `${sizes1.timerButtonHeight * 1.2}px`
                    }}
                  >
                    {seconds}s
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-0 bg-slate-700 border-slate-600 hover:bg-slate-600"
                    style={{
                      height: `${sizes1.timerButtonHeight}px`,
                      width: `${sizes1.timerButtonHeight}px`
                    }}
                    onClick={() => setSeconds(seconds + 5)}
                  >
                    <Plus
                      style={{ width: `${sizes1.iconSmall}px`, height: `${sizes1.iconSmall}px` }}
                      className="text-white"
                    />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2" style={{ gap: `${sizes1.gridGap}px` }}>
                <Button
                  onClick={handleReset}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  style={{
                    height: `${sizes1.timerButtonHeight}px`,
                    fontSize: `${sizes1.smallTextFont}px`
                  }}
                >
                  <RotateCcw
                    style={{
                      marginRight: '4px',
                      width: `${sizes1.iconSmall}px`,
                      height: `${sizes1.iconSmall}px`
                    }}
                  />
                  Reset
                </Button>
                <Button
                  onClick={() => setTimeLeft(timeLeft + 10)}
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                  style={{
                    height: `${sizes1.timerButtonHeight}px`,
                    fontSize: `${sizes1.smallTextFont}px`
                  }}
                >
                  <Plus
                    style={{
                      marginRight: '4px',
                      width: `${sizes1.iconSmall}px`,
                      height: `${sizes1.iconSmall}px`
                    }}
                  />
                  10s
                </Button>
              </div>
            </div>

            {/* Score Buttons AKA */}
            <div className="flex-shrink-0">
              <h3
                className="text-red-500 font-bold border-b border-slate-700"
                style={{
                  fontSize: `${sizes1.sectionTitleFont}px`,
                  paddingBottom: `${sizes1.gridGap / 2}px`,
                  marginBottom: `${sizes1.gridGap}px`
                }}
              >
                AKA (Red) Scoring
              </h3>
              <div
                className="grid grid-cols-3"
                style={{ gap: `${sizes1.gridGap}px`, marginBottom: `${sizes1.gridGap}px` }}
              >
                {scoreButtons.map((btn) => (
                  <button
                    key={`aka-${btn.label}`}
                    onClick={() => setScoreAka(scoreAka + btn.value)}
                    // variant="outline"
                    className={`border-red-600 hover:border-red-800 cursor-pointer rounded-md text-white font-semibold p-1 flex flex-col items-center justify-center border-2 hover:text-white hover:bg-transparent`}
                    style={{
                      height: `${sizes1.scoreButtonHeight}px`,
                      fontSize: `${sizes1.smallTextFont}px`
                    }}
                  >
                    <span className="text-red-400 font-extrabold text-base/8">{btn.label}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3" style={{ gap: `${sizes1.gridGap}px` }}>
                {penaltyButtons.map((btn) => (
                  <button
                    key={`aka-penalty-${btn.label}`}
                    onClick={() => setScoreAka(Math.max(0, scoreAka + btn.value))}
                    // variant="outline"
                    className={`border-gray-500 hover:border-gray-800 cursor-pointer rounded-md text-white p-1 border-2 hover:text-white hover:bg-transparent`}
                    style={{
                      height: `${sizes1.penaltyButtonHeight}px`,
                      fontSize: `${sizes1.smallTextFont}px`
                    }}
                  >
                    <span className="text-red-400 text-base/8">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Score Buttons AO */}
            <div className="flex-shrink-0">
              <h3
                className="text-blue-500 font-bold border-b border-slate-700"
                style={{
                  fontSize: `${sizes1.sectionTitleFont}px`,
                  paddingBottom: `${sizes1.gridGap / 2}px`,
                  marginBottom: `${sizes1.gridGap}px`
                }}
              >
                AO (Blue) Scoring
              </h3>
              <div
                className="grid grid-cols-3"
                style={{ gap: `${sizes1.gridGap}px`, marginBottom: `${sizes1.gridGap}px` }}
              >
                {scoreButtons.map((btn) => (
                  <button
                    key={`ao-${btn.label}`}
                    onClick={() => setScoreAo(scoreAo + btn.value)}
                    // variant="outline"
                    className={`border-blue-500 hover:border-blue-800 cursor-pointer rounded-md text-white font-semibold p-1 flex flex-col items-center justify-center border-2 hover:text-white hover:bg-transparent`}
                    style={{
                      height: `${sizes1.scoreButtonHeight}px`,
                      fontSize: `${sizes1.smallTextFont}px`
                    }}
                  >
                    <span className="text-blue-400 font-extrabold text-base/8">{btn.label}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3" style={{ gap: `${sizes1.gridGap}px` }}>
                {penaltyButtons.map((btn) => (
                  <button
                    key={`ao-penalty-${btn.label}`}
                    onClick={() => setScoreAo(Math.max(0, scoreAo + btn.value))}
                    // variant="outline"
                    className={`border-gray-500 hover:border-gray-800 rounded-md cursor-pointer text-white p-1 border-2 hover:text-white hover:bg-transparent`}
                    style={{
                      height: `${sizes1.penaltyButtonHeight}px`,
                      fontSize: `${sizes1.smallTextFont}px`
                    }}
                  >
                    <span className="text-blue-400 text-base/8">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Warnings AKA */}
            <div className="flex-shrink-0">
              <h3
                className="text-red-500 font-bold border-b border-slate-700"
                style={{
                  fontSize: `${sizes1.sectionTitleFont}px`,
                  paddingBottom: `${sizes1.gridGap / 2}px`,
                  marginBottom: `${sizes1.gridGap}px`
                }}
              >
                AKA Warnings
              </h3>
              <div className="grid grid-cols-5" style={{ gap: `${sizes1.gridGap}px` }}>
                {Object.entries(warningsAka).map(([key, value]) => (
                  <div
                    key={`aka-warn-${key}`}
                    className="flex flex-col items-center"
                    style={{ gap: `${sizes1.gridGap / 2}px` }}
                  >
                    <Checkbox
                      checked={value}
                      onCheckedChange={(checked) =>
                        setWarningsAka({ ...warningsAka, [key]: checked })
                      }
                      className="border-red-500"
                      style={{
                        height: `${sizes1.checkboxSize}px`,
                        width: `${sizes1.checkboxSize}px`
                      }}
                    />
                    <span
                      className="text-red-400 font-semibold uppercase"
                      style={{ fontSize: `${sizes1.tinyTextFont}px` }}
                    >
                      {key.replace('w', '')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warnings AO */}
            <div className="flex-shrink-0">
              <h3
                className="text-blue-500 font-bold border-b border-slate-700"
                style={{
                  fontSize: `${sizes1.sectionTitleFont}px`,
                  paddingBottom: `${sizes1.gridGap / 2}px`,
                  marginBottom: `${sizes1.gridGap}px`
                }}
              >
                AO Warnings
              </h3>
              <div className="grid grid-cols-5" style={{ gap: `${sizes1.gridGap}px` }}>
                {Object.entries(warningsAo).map(([key, value]) => (
                  <div
                    key={`ao-warn-${key}`}
                    className="flex flex-col items-center"
                    style={{ gap: `${sizes1.gridGap / 2}px` }}
                  >
                    <Checkbox
                      checked={value}
                      onCheckedChange={(checked) =>
                        setWarningsAo({ ...warningsAo, [key]: checked })
                      }
                      className="border-blue-500"
                      style={{
                        height: `${sizes1.checkboxSize}px`,
                        width: `${sizes1.checkboxSize}px`
                      }}
                    />
                    <span
                      className="text-blue-400 font-semibold uppercase"
                      style={{ fontSize: `${sizes1.tinyTextFont}px` }}
                    >
                      {key.replace('w', '')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Round Selector */}
            <div className="flex-shrink-0">
              <div
                className="flex items-center justify-between"
                style={{ gap: `${sizes1.gridGap}px`, marginBottom: `${sizes1.gridGap}px` }}
              >
                {/* Bagian kiri: Round dan dropdown */}
                <div className="flex items-center" style={{ gap: `${sizes1.gridGap}px` }}>
                  <span
                    className="text-white font-medium"
                    style={{ fontSize: `${sizes1.smallTextFont}px` }}
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
                        width: `${sizes1.selectHeight * 1.9}px`,
                        height: `${sizes1.selectHeight}px`,
                        fontSize: `${sizes1.smallTextFont}px`
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
                    style={{ fontSize: `${sizes1.smallTextFont}px` }}
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
                        width: `${sizes1.selectHeight * 1.9}px`,
                        height: `${sizes1.selectHeight}px`,
                        fontSize: `${sizes1.smallTextFont}px`
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
                <div className="grid grid-cols-2" style={{ gap: `${sizes1.gridGap}px` }}>
                  <Button
                    onClick={() => setCurrentRound(Math.max(1, currentRound - 1))}
                    variant="outline"
                    className="text-white bg-slate-700 border-slate-600 hover:bg-slate-600"
                    style={{
                      height: `${sizes1.roundButtonHeight}px`,
                      fontSize: `${sizes1.smallTextFont}px`
                    }}
                  >
                    ← Prev
                  </Button>
                  <Button
                    onClick={() => setCurrentRound(Math.min(totalRounds, currentRound + 1))}
                    variant="outline"
                    className="text-white bg-slate-700 border-slate-600 hover:bg-slate-600"
                    style={{
                      height: `${sizes1.roundButtonHeight}px`,
                      fontSize: `${sizes1.smallTextFont}px`
                    }}
                  >
                    Next →
                  </Button>
                </div>
              </div>
            </div>

            {/* Reset All */}
            <Button
              onClick={handleResetAll}
              className="text-white w-full font-bold bg-red-700 hover:bg-red-800 flex-shrink-0"
              style={{
                height: `${sizes1.resetButtonHeight}px`,
                fontSize: `${sizes1.buttonTextFont}px`
              }}
            >
              <RotateCcw
                style={{
                  marginRight: '8px',
                  width: `${sizes1.iconMedium}px`,
                  height: `${sizes1.iconMedium}px`
                }}
              />
              Reset Everything
            </Button>
          </div>
        </div>

        {/* Display Board */}
        <div
          className="col-span-6 bg-black flex flex-col justify-between overflow-hidden"
          style={{ padding: `${sizes1.containerPadding * 2}px` }}
        >
          {/* Logo and Timer */}
          <div className="text-center">
            <div
              className="text-white font-bold tracking-wider"
              style={{
                fontSize: `${sizes1.logoFont}px`,
                marginBottom: `${sizes1.gridGap}px`
              }}
            >
              SPORTDATA
            </div>
            <div
              className="text-white font-bold font-mono tracking-tight"
              style={{ fontSize: `${sizes1.timerFont}px` }}
            >
              {Math.floor(timeLeft / 60)}:
              {Math.floor(timeLeft % 60)
                .toString()
                .padStart(2, '0')}
              <span style={{ fontSize: `${sizes1.timerDecimalFont}px` }}>
                .{Math.floor((timeLeft % 1) * 10)}
              </span>
            </div>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-2" style={{ gap: `${sizes1.containerPadding * 3}px` }}>
            {/* AKA */}
            <div className="text-center">
              <div
                className="text-red-500 font-bold"
                style={{
                  fontSize: `${sizes1.scoreLabelFont}px`,
                  marginBottom: `${sizes1.gridGap * 2}px`
                }}
              >
                {dataMatch?.red_corner.full_name}
              </div>
              <div
                className="text-red-500 font-bold leading-none"
                style={{ fontSize: `${sizes1.scoreFont}px` }}
              >
                {scoreAka}
              </div>
            </div>

            {/* AO */}
            <div className="text-center">
              <div
                className="text-blue-500 font-bold"
                style={{
                  fontSize: `${sizes1.scoreLabelFont}px`,
                  marginBottom: `${sizes1.gridGap * 2}px`
                }}
              >
                {dataMatch?.blue_corner.full_name}
              </div>
              <div
                className="text-blue-500 font-bold leading-none"
                style={{ fontSize: `${sizes1.scoreFont}px` }}
              >
                {scoreAo}
              </div>
            </div>
          </div>

          {/* Warnings Display */}
          <div className="grid grid-cols-2" style={{ gap: `${sizes1.containerPadding * 3}px` }}>
            {/* AKA Warnings */}
            <div>
              <div
                className="text-red-500 font-bold"
                style={{
                  fontSize: `${sizes1.warningFont}px`,
                  marginBottom: `${sizes1.gridGap}px`
                }}
              >
                WARNING
              </div>
              <div
                className="flex justify-center text-red-400"
                style={{
                  gap: `${sizes1.gridGap * 2}px`,
                  fontSize: `${sizes1.warningFont}px`
                }}
              >
                {Object.entries(warningsAka).map(([key, value]) => (
                  <span
                    key={key}
                    className={`text-[25px]  ${value ? 'opacity-100 font-bold' : 'opacity-30'}`}
                  >
                    {key.replace('w', '').toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* AO Warnings */}
            <div>
              <div
                className="text-blue-500 font-bold"
                style={{
                  fontSize: `${sizes1.warningFont}px`,
                  marginBottom: `${sizes1.gridGap}px`
                }}
              >
                WARNING
              </div>
              <div
                className="flex justify-center text-blue-400"
                style={{
                  gap: `${sizes1.gridGap * 2}px`,
                  fontSize: `${sizes1.warningFont}px`
                }}
              >
                {Object.entries(warningsAo).map(([key, value]) => (
                  <span
                    key={key}
                    className={`text-[25px]  ${value ? 'opacity-100 font-bold' : 'opacity-30'}`}
                  >
                    {key.replace('w', '').toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Round Display */}
          <div className="text-center">
            <div className="text-white font-bold" style={{ fontSize: `${sizes1.roundFont}px` }}>
              Round {currentRound} / {totalRounds}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
