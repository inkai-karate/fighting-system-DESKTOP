import React from 'react'
import { UseIndex } from './hook/useIndex'
import { useSocketIpc } from '@renderer/components/core/hook/useSocketIpc'

export const ScoringDisplayPage: React.FC = () => {
  const {
    dataMatch,
    scoreAka,
    scoreAo,
    currentRound,
    totalRounds,
    warningsAka,
    warningsAo,
    timeLeft,
    senshu,
    screenSize,
    displaySizes,
    isShowingWinner,
    winnerTransition,
    winnerInfo
  } = UseIndex()
  // eslint-disable-next-line no-empty-pattern
  const {} = useSocketIpc()

  if (isShowingWinner && winnerInfo) {
    return (
      <div
        className={`bg-black flex flex-col items-center justify-center transition-all duration-1000 ${
          winnerTransition ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: `${screenSize.width}px`,
          height: `${screenSize.height}px`,
          overflow: 'hidden',
          background:
            winnerInfo.winnerColor === 'red'
              ? 'radial-gradient(circle, rgba(185, 28, 28, 0.9) 0%, rgba(0, 0, 0, 1) 70%)'
              : winnerInfo.winnerColor === 'blue'
                ? 'radial-gradient(circle, rgba(29, 78, 216, 0.9) 0%, rgba(0, 0, 0, 1) 70%)'
                : 'radial-gradient(circle, rgba(161, 98, 7, 0.9) 0%, rgba(0, 0, 0, 1) 70%)'
        }}
      >
        {/* Winner Animation */}
        <div className="relative">
          {/* Glow Effect */}
          <div
            className="absolute inset-0 rounded-full blur-3xl"
            style={{
              background:
                winnerInfo.winnerColor === 'red'
                  ? 'rgba(239, 68, 68, 0.4)'
                  : winnerInfo.winnerColor === 'blue'
                    ? 'rgba(59, 130, 246, 0.4)'
                    : 'rgba(234, 179, 8, 0.4)'
            }}
          />

          {/* Winner Text */}
          <div className="relative text-center mb-16">
            <div
              className="font-extrabold uppercase tracking-widest mb-6 animate-pulse"
              style={{
                fontSize: `${displaySizes.winnerFont}px`,
                color:
                  winnerInfo.winnerColor === 'red'
                    ? '#fca5a5'
                    : winnerInfo.winnerColor === 'blue'
                      ? '#93c5fd'
                      : '#fde047'
              }}
            >
              {winnerInfo.winner === 'Seri' ? 'DRAW' : 'WINNER'}
            </div>

            {winnerInfo.winner !== 'Seri' && (
              <div
                className="font-bold uppercase"
                style={{
                  fontSize: `${displaySizes.winnerFont * 1.5}px`,
                  color: winnerInfo.winnerColor === 'red' ? '#ef4444' : '#3b82f6',
                  textShadow: '0 0 30px currentColor'
                }}
              >
                {winnerInfo.winner}
              </div>
            )}
          </div>

          {/* Final Scores */}
          <div className="grid grid-cols-2 gap-32 mb-16">
            {/* AKA Final Score */}
            <div className="text-center">
              <div className="text-red-400 text-3xl font-bold mb-4">
                {dataMatch?.red_corner.full_name}
              </div>
              <div
                className="text-red-500 font-extrabold"
                style={{ fontSize: `${displaySizes.finalScoreFont}px` }}
              >
                {scoreAka}
              </div>
              {winnerInfo.winnerColor === 'red' && (
                <div className="text-yellow-400 text-xl font-bold mt-4 animate-bounce">
                  🏆 CHAMPION 🏆
                </div>
              )}
            </div>

            {/* AO Final Score */}
            <div className="text-center">
              <div className="text-blue-400 text-3xl font-bold mb-4">
                {dataMatch?.blue_corner.full_name}
              </div>
              <div
                className="text-blue-500 font-extrabold"
                style={{ fontSize: `${displaySizes.finalScoreFont}px` }}
              >
                {scoreAo}
              </div>
              {winnerInfo.winnerColor === 'blue' && (
                <div className="text-yellow-400 text-xl font-bold mt-4 animate-bounce">
                  🏆 CHAMPION 🏆
                </div>
              )}
            </div>
          </div>

          {/* Match Info */}
          <div className="text-gray-300 text-4xl font-semibold mb-8">
            Round {currentRound} / {totalRounds}
          </div>

          {/* Trophy Animation */}
          <div className="text-8xl animate-bounce mt-8">
            {winnerInfo.winner === 'Seri' ? '⚖️' : '🏆'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="bg-black flex flex-col justify-between overflow-hidden"
      style={{
        width: `${screenSize.width}px`,
        height: `${screenSize.height}px`,
        overflow: 'hidden'
      }}
    >
      {/* Top Section - Scores */}
      <div
        className="grid grid-cols-2"
        style={{
          paddingTop: `${displaySizes.verticalPadding}px`,
          paddingLeft: `${displaySizes.horizontalPadding}px`,
          paddingRight: `${displaySizes.horizontalPadding}px`,
          gap: `${displaySizes.sectionGap}px`
        }}
      >
        {/* AKA Section */}
        <div className="flex items-start justify-between">
          <div>
            <div
              className="text-red-500 font-bold uppercase tracking-wide"
              style={{
                fontSize: `${displaySizes.nameFont}px`,
                marginBottom: `${displaySizes.smallGap}px`
              }}
            >
              {dataMatch?.red_corner.full_name || 'AKA'}
            </div>
            <div
              className="text-red-500 font-bold leading-none"
              style={{ fontSize: `${displaySizes.scoreFont}px` }}
            >
              {scoreAka}
            </div>
          </div>
          {/* Senshu Indicator for AKA */}
          {senshu === 'aka' && (
            <div
              className="rounded-full bg-yellow-400 border-4 border-yellow-500 animate-pulse"
              style={{
                width: `${displaySizes.senshuSize}px`,
                height: `${displaySizes.senshuSize}px`,
                marginTop: `${displaySizes.smallGap}px`
              }}
            />
          )}
        </div>

        {/* AO Section */}
        <div className="flex items-start justify-between flex-row-reverse">
          <div className="text-right">
            <div
              className="text-blue-500 font-bold uppercase tracking-wide"
              style={{
                fontSize: `${displaySizes.nameFont}px`,
                marginBottom: `${displaySizes.smallGap}px`
              }}
            >
              {dataMatch?.blue_corner.full_name || 'AO'}
            </div>
            <div
              className="text-blue-500 font-bold leading-none"
              style={{ fontSize: `${displaySizes.scoreFont}px` }}
            >
              {scoreAo}
            </div>
          </div>
          {/* Senshu Indicator for AO */}
          {senshu === 'ao' && (
            <div
              className="rounded-full bg-yellow-400 border-4 border-yellow-500 animate-pulse"
              style={{
                width: `${displaySizes.senshuSize}px`,
                height: `${displaySizes.senshuSize}px`,
                marginTop: `${displaySizes.smallGap}px`
              }}
            />
          )}
        </div>
      </div>

      {/* Warnings Section */}
      <div
        className="grid grid-cols-2"
        style={{
          paddingLeft: `${displaySizes.horizontalPadding}px`,
          paddingRight: `${displaySizes.horizontalPadding}px`,
          gap: `${displaySizes.sectionGap}px`
        }}
      >
        {/* AKA Warnings */}
        <div>
          <div
            className="text-red-500 font-bold"
            style={{
              fontSize: `${displaySizes.warningTitleFont}px`,
              marginBottom: `${displaySizes.smallGap}px`
            }}
          >
            WARNING
          </div>
          <div
            className="flex justify-start"
            style={{
              gap: `${displaySizes.warningGap}px`,
              fontSize: `${displaySizes.warningFont}px`
            }}
          >
            {Object.entries(warningsAka).map(([key, value]) => (
              <span
                key={key}
                className={`font-bold transition-opacity ${
                  value ? 'text-red-500 opacity-100' : 'text-gray-600 opacity-30'
                }`}
              >
                {key.replace('w', '').toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* AO Warnings */}
        <div className="text-right">
          <div
            className="text-blue-500 font-bold"
            style={{
              fontSize: `${displaySizes.warningTitleFont}px`,
              marginBottom: `${displaySizes.smallGap}px`
            }}
          >
            WARNING
          </div>
          <div
            className="flex justify-end"
            style={{
              gap: `${displaySizes.warningGap}px`,
              fontSize: `${displaySizes.warningFont}px`
            }}
          >
            {Object.entries(warningsAo)
              .toReversed()
              .map(([key, value]) => (
                <span
                  key={key}
                  className={`font-bold transition-opacity ${
                    value ? 'text-blue-500 opacity-100' : 'text-gray-600 opacity-30'
                  }`}
                >
                  {key.replace('w', '').toUpperCase()}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Center Section - Logo and Timer */}
      <div className="flex flex-col items-center justify-center flex-1">
        {/* Logo */}
        <div className="mb-8">
          <svg
            viewBox="0 0 200 100"
            style={{
              width: `${displaySizes.logoWidth}px`,
              height: 'auto'
            }}
          >
            <text
              x="100"
              y="60"
              textAnchor="middle"
              className="fill-gray-400"
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                fontFamily: 'Arial, sans-serif',
                letterSpacing: '8px'
              }}
            >
              InKai
            </text>
          </svg>
        </div>

        {/* Timer */}
        <div
          className="text-gray-400 font-bold font-mono tracking-tight"
          style={{ fontSize: `${displaySizes.timerFont}px` }}
        >
          {Math.floor(timeLeft / 60)}:
          {Math.floor(timeLeft % 60)
            .toString()
            .padStart(2, '0')}
          <span style={{ fontSize: `${displaySizes.timerDecimalFont}px` }}>
            .{Math.floor((timeLeft % 1) * 10)}
          </span>
        </div>
      </div>

      {/* Bottom Section - Round */}
      <div
        className="text-center"
        style={{
          paddingBottom: `${displaySizes.verticalPadding}px`
        }}
      >
        <div className="text-white font-bold" style={{ fontSize: `${displaySizes.roundFont}px` }}>
          Round {currentRound} / {totalRounds}
        </div>
      </div>
    </div>
  )
}
