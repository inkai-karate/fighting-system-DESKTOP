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
import { MyAlertDialog } from '@renderer/components/core/MyAlertDialog'
import { useNavigate } from 'react-router-dom'

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
    senshu
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
        onConfirm={() => navigate('/')}
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
