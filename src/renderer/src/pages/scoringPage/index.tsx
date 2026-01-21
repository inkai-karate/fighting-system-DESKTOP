import React, { useState, useEffect, useMemo } from 'react'
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

export const ScoringPage: React.FC = () => {
  const [seconds, setSeconds] = useState(20)
  const [timeLeft, setTimeLeft] = useState(20)
  const [isRunning, setIsRunning] = useState(false)
  const [scoreAka, setScoreAka] = useState(0)
  const [scoreAo, setScoreAo] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [totalRounds, setTotalRounds] = useState(4)
  const [screenSize, setScreenSize] = useState({ width: 1920, height: 1080 })
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

  // Get screen size from Electron
  useEffect(() => {
    if (window.api?.screen) {
      window.api.screen.getSize().then((size) => {
        setScreenSize(size)
        console.log('Screen size:', size)
      })

      window.api.screen.onSizeChanged((size) => {
        setScreenSize(size)
        console.log('Screen size changed:', size)
      })
    }
  }, [])

  // Calculate responsive sizes based on screen size
  const sizes = useMemo(() => {
    const h = screenSize.height
    // const w = screenSize.width

    return {
      // Heights - Total harus < 100%
      headerHeight: h * 0.055 * 1.15,
      startButtonHeight: h * 0.07 * 1.15,
      timerButtonHeight: h * 0.045 * 1.15,
      scoreButtonHeight: h * 0.055 * 1.15,
      penaltyButtonHeight: h * 0.048 * 1.15,
      checkboxSize: h * 0.025 * 1.15,
      selectHeight: h * 0.045 * 1.15,
      roundButtonHeight: h * 0.045 * 1.15,
      resetButtonHeight: h * 0.055 * 1.15,

      // Paddings & Gaps
      containerPadding: h * 0.012,
      sectionGap: h * 0.012,
      gridGap: h * 0.006,

      // Font Sizes
      headerFont: h * 0.022 * 1.25,
      sectionTitleFont: h * 0.016 * 1.25,
      buttonTextFont: h * 0.014 * 1.25,
      smallTextFont: h * 0.013 * 1.25,
      tinyTextFont: h * 0.011 * 1.25,

      // Display Board Heights
      displayLogoHeight: h * 0.12 * 1.03 * 1.03,
      displayScoreHeight: h * 0.35 * 1.03 * 1.03,
      displayWarningHeight: h * 0.15 * 1.03 * 1.03,
      displayRoundHeight: h * 0.08 * 1.03 * 1.03,

      // Display Board Font Sizes
      logoFont: h * 0.028,
      timerFont: h * 0.1,
      timerDecimalFont: h * 0.05,
      scoreFont: h * 0.12,
      scoreLabelFont: h * 0.038,
      warningFont: h * 0.018,
      warningLabelFont: h * 0.015,
      roundFont: h * 0.026,

      // Icon sizes
      iconSmall: h * 0.02,
      iconMedium: h * 0.026,
      iconLarge: h * 0.032
    }
  }, [screenSize])

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

  const handleStartStop = (): void => {
    setIsRunning(!isRunning)
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
    setWarningsAka({ w1: false, w2: false, w3: false, hc: false, h: false })
    setWarningsAo({ w1: false, w2: false, w3: false, hc: false, h: false })
  }

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
      label: '-Yuko',
      value: -5,
      color: 'bg-slate-600 hover:bg-slate-700',
      borderColor: 'border-slate-600 hover:border-slate-700'
    },
    {
      label: '-Waza-ari',
      value: -7,
      color: 'bg-slate-700 hover:bg-slate-800',
      borderColor: 'border-slate-700 hover:border-slate-800'
    },
    {
      label: '-Ippon',
      value: -10,
      color: 'bg-slate-800 hover:bg-slate-900',
      borderColor: 'border-slate-800 hover:border-slate-900'
    }
  ]

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
              padding: `${sizes.containerPadding}px`,
              gap: `${sizes.sectionGap}px`
            }}
          >
            {/* Start/Stop Button */}
            <Button
              onClick={handleStartStop}
              className="w-full text-white font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex-shrink-0"
              style={{
                height: `${sizes.startButtonHeight}px`,
                fontSize: `${sizes.buttonTextFont}px`
              }}
            >
              {isRunning ? (
                <Pause
                  style={{
                    marginRight: '8px',
                    width: `${sizes.iconMedium}px`,
                    height: `${sizes.iconMedium}px`
                  }}
                />
              ) : (
                <Play
                  style={{
                    marginRight: '8px',
                    width: `${sizes.iconMedium}px`,
                    height: `${sizes.iconMedium}px`
                  }}
                />
              )}
              {isRunning ? 'PAUSE' : 'START'}
            </Button>

            {/* Timer Controls */}
            <div className="flex-shrink-0">
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: `${sizes.gridGap}px` }}
              >
                <span
                  className="text-white font-medium"
                  style={{ fontSize: `${sizes.smallTextFont}px` }}
                >
                  Timer:
                </span>
                <div className="flex items-center" style={{ gap: `${sizes.gridGap}px` }}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-0 bg-slate-700 border-slate-600 hover:bg-slate-600"
                    style={{
                      height: `${sizes.timerButtonHeight}px`,
                      width: `${sizes.timerButtonHeight}px`
                    }}
                    onClick={() => setSeconds(Math.max(5, seconds - 5))}
                  >
                    <Minus
                      style={{ width: `${sizes.iconSmall}px`, height: `${sizes.iconSmall}px` }}
                      className="text-white"
                    />
                  </Button>
                  <span
                    className="text-white font-bold text-center"
                    style={{
                      fontSize: `${sizes.smallTextFont}px`,
                      minWidth: `${sizes.timerButtonHeight * 1.2}px`
                    }}
                  >
                    {seconds}s
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-0 bg-slate-700 border-slate-600 hover:bg-slate-600"
                    style={{
                      height: `${sizes.timerButtonHeight}px`,
                      width: `${sizes.timerButtonHeight}px`
                    }}
                    onClick={() => setSeconds(seconds + 5)}
                  >
                    <Plus
                      style={{ width: `${sizes.iconSmall}px`, height: `${sizes.iconSmall}px` }}
                      className="text-white"
                    />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2" style={{ gap: `${sizes.gridGap}px` }}>
                <Button
                  onClick={handleReset}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  style={{
                    height: `${sizes.timerButtonHeight}px`,
                    fontSize: `${sizes.smallTextFont}px`
                  }}
                >
                  <RotateCcw
                    style={{
                      marginRight: '4px',
                      width: `${sizes.iconSmall}px`,
                      height: `${sizes.iconSmall}px`
                    }}
                  />
                  Reset
                </Button>
                <Button
                  onClick={() => setTimeLeft(timeLeft + 10)}
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                  style={{
                    height: `${sizes.timerButtonHeight}px`,
                    fontSize: `${sizes.smallTextFont}px`
                  }}
                >
                  <Plus
                    style={{
                      marginRight: '4px',
                      width: `${sizes.iconSmall}px`,
                      height: `${sizes.iconSmall}px`
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
                  fontSize: `${sizes.sectionTitleFont}px`,
                  paddingBottom: `${sizes.gridGap / 2}px`,
                  marginBottom: `${sizes.gridGap}px`
                }}
              >
                AKA (Red) Scoring
              </h3>
              <div
                className="grid grid-cols-3"
                style={{ gap: `${sizes.gridGap}px`, marginBottom: `${sizes.gridGap}px` }}
              >
                {scoreButtons.map((btn) => (
                  <button
                    key={`aka-${btn.label}`}
                    onClick={() => setScoreAka(scoreAka + btn.value)}
                    // variant="outline"
                    className={`border-red-600 hover:border-red-800 cursor-pointer rounded-md text-white font-semibold p-1 flex flex-col items-center justify-center border-2 hover:text-white hover:bg-transparent`}
                    style={{
                      height: `${sizes.scoreButtonHeight}px`,
                      fontSize: `${sizes.smallTextFont}px`
                    }}
                  >
                    <span className="text-red-400">{btn.label}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3" style={{ gap: `${sizes.gridGap}px` }}>
                {penaltyButtons.map((btn) => (
                  <button
                    key={`aka-penalty-${btn.label}`}
                    onClick={() => setScoreAka(Math.max(0, scoreAka + btn.value))}
                    // variant="outline"
                    className={`border-gray-500 hover:border-gray-800 cursor-pointer rounded-md text-white p-1 border-2 hover:text-white hover:bg-transparent`}
                    style={{
                      height: `${sizes.penaltyButtonHeight}px`,
                      fontSize: `${sizes.smallTextFont}px`
                    }}
                  >
                    <span className="text-red-400">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Score Buttons AO */}
            <div className="flex-shrink-0">
              <h3
                className="text-blue-500 font-bold border-b border-slate-700"
                style={{
                  fontSize: `${sizes.sectionTitleFont}px`,
                  paddingBottom: `${sizes.gridGap / 2}px`,
                  marginBottom: `${sizes.gridGap}px`
                }}
              >
                AO (Blue) Scoring
              </h3>
              <div
                className="grid grid-cols-3"
                style={{ gap: `${sizes.gridGap}px`, marginBottom: `${sizes.gridGap}px` }}
              >
                {scoreButtons.map((btn) => (
                  <button
                    key={`ao-${btn.label}`}
                    onClick={() => setScoreAo(scoreAo + btn.value)}
                    // variant="outline"
                    className={`border-blue-500 hover:border-blue-800 cursor-pointer rounded-md text-white font-semibold p-1 flex flex-col items-center justify-center border-2 hover:text-white hover:bg-transparent`}
                    style={{
                      height: `${sizes.scoreButtonHeight}px`,
                      fontSize: `${sizes.smallTextFont}px`
                    }}
                  >
                    <span className="text-blue-400">{btn.label}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3" style={{ gap: `${sizes.gridGap}px` }}>
                {penaltyButtons.map((btn) => (
                  <button
                    key={`ao-penalty-${btn.label}`}
                    onClick={() => setScoreAo(Math.max(0, scoreAo + btn.value))}
                    // variant="outline"
                    className={`border-gray-500 hover:border-gray-800 rounded-md cursor-pointer text-white p-1 border-2 hover:text-white hover:bg-transparent`}
                    style={{
                      height: `${sizes.penaltyButtonHeight}px`,
                      fontSize: `${sizes.smallTextFont}px`
                    }}
                  >
                    <span className="text-blue-400">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Warnings AKA */}
            <div className="flex-shrink-0">
              <h3
                className="text-red-500 font-bold border-b border-slate-700"
                style={{
                  fontSize: `${sizes.sectionTitleFont}px`,
                  paddingBottom: `${sizes.gridGap / 2}px`,
                  marginBottom: `${sizes.gridGap}px`
                }}
              >
                AKA Warnings
              </h3>
              <div className="grid grid-cols-5" style={{ gap: `${sizes.gridGap}px` }}>
                {Object.entries(warningsAka).map(([key, value]) => (
                  <div
                    key={`aka-warn-${key}`}
                    className="flex flex-col items-center"
                    style={{ gap: `${sizes.gridGap / 2}px` }}
                  >
                    <Checkbox
                      checked={value}
                      onCheckedChange={(checked) =>
                        setWarningsAka({ ...warningsAka, [key]: checked })
                      }
                      className="border-red-500"
                      style={{
                        height: `${sizes.checkboxSize}px`,
                        width: `${sizes.checkboxSize}px`
                      }}
                    />
                    <span
                      className="text-red-400 font-semibold uppercase"
                      style={{ fontSize: `${sizes.tinyTextFont}px` }}
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
                  fontSize: `${sizes.sectionTitleFont}px`,
                  paddingBottom: `${sizes.gridGap / 2}px`,
                  marginBottom: `${sizes.gridGap}px`
                }}
              >
                AO Warnings
              </h3>
              <div className="grid grid-cols-5" style={{ gap: `${sizes.gridGap}px` }}>
                {Object.entries(warningsAo).map(([key, value]) => (
                  <div
                    key={`ao-warn-${key}`}
                    className="flex flex-col items-center"
                    style={{ gap: `${sizes.gridGap / 2}px` }}
                  >
                    <Checkbox
                      checked={value}
                      onCheckedChange={(checked) =>
                        setWarningsAo({ ...warningsAo, [key]: checked })
                      }
                      className="border-blue-500"
                      style={{
                        height: `${sizes.checkboxSize}px`,
                        width: `${sizes.checkboxSize}px`
                      }}
                    />
                    <span
                      className="text-blue-400 font-semibold uppercase"
                      style={{ fontSize: `${sizes.tinyTextFont}px` }}
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
                style={{ gap: `${sizes.gridGap}px`, marginBottom: `${sizes.gridGap}px` }}
              >
                {/* Bagian kiri: Round dan dropdown */}
                <div className="flex items-center" style={{ gap: `${sizes.gridGap}px` }}>
                  <span
                    className="text-white font-medium"
                    style={{ fontSize: `${sizes.smallTextFont}px` }}
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
                        width: `${sizes.selectHeight * 1.9}px`,
                        height: `${sizes.selectHeight}px`,
                        fontSize: `${sizes.smallTextFont}px`
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
                    style={{ fontSize: `${sizes.smallTextFont}px` }}
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
                        width: `${sizes.selectHeight * 1.9}px`,
                        height: `${sizes.selectHeight}px`,
                        fontSize: `${sizes.smallTextFont}px`
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
                <div className="grid grid-cols-2" style={{ gap: `${sizes.gridGap}px` }}>
                  <Button
                    onClick={() => setCurrentRound(Math.max(1, currentRound - 1))}
                    variant="outline"
                    className="text-white bg-slate-700 border-slate-600 hover:bg-slate-600"
                    style={{
                      height: `${sizes.roundButtonHeight}px`,
                      fontSize: `${sizes.smallTextFont}px`
                    }}
                  >
                    ← Prev
                  </Button>
                  <Button
                    onClick={() => setCurrentRound(Math.min(totalRounds, currentRound + 1))}
                    variant="outline"
                    className="text-white bg-slate-700 border-slate-600 hover:bg-slate-600"
                    style={{
                      height: `${sizes.roundButtonHeight}px`,
                      fontSize: `${sizes.smallTextFont}px`
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
                height: `${sizes.resetButtonHeight}px`,
                fontSize: `${sizes.buttonTextFont}px`
              }}
            >
              <RotateCcw
                style={{
                  marginRight: '8px',
                  width: `${sizes.iconMedium}px`,
                  height: `${sizes.iconMedium}px`
                }}
              />
              Reset Everything
            </Button>
          </div>
        </div>

        {/* Display Board */}
        <div
          className="col-span-6 bg-black flex flex-col justify-between overflow-hidden"
          style={{ padding: `${sizes.containerPadding * 2}px` }}
        >
          {/* Logo and Timer */}
          <div className="text-center">
            <div
              className="text-white font-bold tracking-wider"
              style={{
                fontSize: `${sizes.logoFont}px`,
                marginBottom: `${sizes.gridGap}px`
              }}
            >
              SPORTDATA
            </div>
            <div
              className="text-white font-bold font-mono tracking-tight"
              style={{ fontSize: `${sizes.timerFont}px` }}
            >
              {Math.floor(timeLeft / 60)}:
              {Math.floor(timeLeft % 60)
                .toString()
                .padStart(2, '0')}
              <span style={{ fontSize: `${sizes.timerDecimalFont}px` }}>
                .{Math.floor((timeLeft % 1) * 10)}
              </span>
            </div>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-2" style={{ gap: `${sizes.containerPadding * 3}px` }}>
            {/* AKA */}
            <div className="text-center">
              <div
                className="text-red-500 font-bold"
                style={{
                  fontSize: `${sizes.scoreLabelFont}px`,
                  marginBottom: `${sizes.gridGap * 2}px`
                }}
              >
                AKA
              </div>
              <div
                className="text-red-500 font-bold leading-none"
                style={{ fontSize: `${sizes.scoreFont}px` }}
              >
                {scoreAka}
              </div>
            </div>

            {/* AO */}
            <div className="text-center">
              <div
                className="text-blue-500 font-bold"
                style={{
                  fontSize: `${sizes.scoreLabelFont}px`,
                  marginBottom: `${sizes.gridGap * 2}px`
                }}
              >
                AO
              </div>
              <div
                className="text-blue-500 font-bold leading-none"
                style={{ fontSize: `${sizes.scoreFont}px` }}
              >
                {scoreAo}
              </div>
            </div>
          </div>

          {/* Warnings Display */}
          <div className="grid grid-cols-2" style={{ gap: `${sizes.containerPadding * 3}px` }}>
            {/* AKA Warnings */}
            <div>
              <div
                className="text-red-500 font-bold"
                style={{
                  fontSize: `${sizes.warningFont}px`,
                  marginBottom: `${sizes.gridGap}px`
                }}
              >
                WARNING
              </div>
              <div
                className="flex justify-center text-red-400"
                style={{
                  gap: `${sizes.gridGap * 2}px`,
                  fontSize: `${sizes.warningFont}px`
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
                  fontSize: `${sizes.warningFont}px`,
                  marginBottom: `${sizes.gridGap}px`
                }}
              >
                WARNING
              </div>
              <div
                className="flex justify-center text-blue-400"
                style={{
                  gap: `${sizes.gridGap * 2}px`,
                  fontSize: `${sizes.warningFont}px`
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
            <div className="text-white font-bold" style={{ fontSize: `${sizes.roundFont}px` }}>
              Round {currentRound} / {totalRounds}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
