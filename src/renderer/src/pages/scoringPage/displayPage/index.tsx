import React from 'react'
import { UseIndex } from './hook/useIndex'

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
    displaySizes
  } = UseIndex()

  return (
    <div
      className="bg-black flex flex-col justify-between overflow-hidden"
      style={{
        width: `${screenSize.width}px`,
        height: `${screenSize.height > 758 ? screenSize.height * 0.953 : screenSize.height * 0.945}px`,
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
              {dataMatch?.blue_corner.full_name || 'AKA'}
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
              {dataMatch?.red_corner.full_name || 'AO'}
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
