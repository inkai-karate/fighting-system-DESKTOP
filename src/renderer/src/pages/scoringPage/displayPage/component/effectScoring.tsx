import React from 'react'

// Ultra Dramatic Score Change Effect
export const UltraScoreChangeEffect: React.FC<{
  show: boolean
  value: number
  color: 'red' | 'blue'
  position: 'left' | 'right'
  screenSize: { width: number; height: number }
}> = ({ show, value, color, position, screenSize }) => {
  if (!show) return null

  const baseColor = color === 'red' ? '#ef4444' : '#3b82f6'
  const lightColor = color === 'red' ? '#fca5a5' : '#93c5fd'

  return (
    <>
      {/* Full Screen Flash */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${position === 'left' ? '20%' : '80%'} 30%, ${baseColor}40 0%, transparent 50%)`,
          animation: 'ultraFlash 0.6s ease-out',
          zIndex: 150
        }}
      />

      {/* Score Burst Particles */}
      <div
        className="fixed top-[15%] pointer-events-none"
        style={{
          [position === 'left' ? 'left' : 'right']: '8%',
          zIndex: 160
        }}
      >
        {/* Main Score Pop */}
        <div
          style={{
            fontSize: `${screenSize.height * 0.25}px`,
            fontWeight: 900,
            color: lightColor,
            textShadow: `
              0 0 40px ${baseColor},
              0 0 80px ${baseColor},
              0 0 120px ${baseColor},
              0 0 160px ${baseColor}
            `,
            animation: 'ultraScorePop 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            filter: 'brightness(1.8)',
            WebkitTextStroke: `3px ${baseColor}`,
            position: 'relative'
          }}
        >
          +{value}
        </div>

        {/* Explosion Rings */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              width: '400px',
              height: '400px',
              marginLeft: '-200px',
              marginTop: '-200px',
              border: `6px solid ${baseColor}`,
              borderRadius: '50%',
              animation: `explosionRing 1s ease-out ${i * 0.15}s forwards`,
              opacity: 0
            }}
          />
        ))}

        {/* Star Particles */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 360) / 8
          return (
            <div
              key={`star-${i}`}
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                fontSize: '60px',
                animation: `starBurst 1s ease-out ${i * 0.05}s forwards`,
                transform: `rotate(${angle}deg)`,
                opacity: 0,
                transformOrigin: 'center'
              }}
            >
              ✨
            </div>
          )
        })}
      </div>
    </>
  )
}

// Ultra Warning Flash Effect
export const UltraWarningFlash: React.FC<{
  show: boolean
  color: 'red' | 'blue'
  screenSize: { width: number; height: number }
}> = ({ show, color, screenSize }) => {
  if (!show) return null

  const baseColor = color === 'red' ? '#ef4444' : '#3b82f6'

  return (
    <>
      {/* Triple Flash Waves */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="fixed inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${baseColor}60 0%, transparent 70%)`,
            animation: `warningWave 0.8s ease-out ${i * 0.15}s`,
            zIndex: 140
          }}
        />
      ))}

      {/* Corner Warnings */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
        <div
          key={corner}
          className={`fixed ${corner.includes('top') ? 'top-0' : 'bottom-0'} ${corner.includes('left') ? 'left-0' : 'right-0'}`}
          style={{
            width: '300px',
            height: '300px',
            background: `radial-gradient(circle at ${corner.includes('left') ? 'left' : 'right'} ${corner.includes('top') ? 'top' : 'bottom'}, ${baseColor}80 0%, transparent 70%)`,
            animation: 'cornerFlash 0.5s ease-out',
            zIndex: 145
          }}
        />
      ))}

      {/* Warning Symbol */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ zIndex: 150 }}
      >
        <div
          style={{
            fontSize: `${screenSize.height * 0.3}px`,
            color: baseColor,
            textShadow: `0 0 60px ${baseColor}, 0 0 120px ${baseColor}`,
            animation: 'warningSymbol 0.6s ease-out forwards',
            fontWeight: 900
          }}
        >
          ⚠️
        </div>
      </div>
    </>
  )
}

// Ultra Senshu Effect
export const UltraSenshuEffect: React.FC<{
  show: boolean
  color: 'red' | 'blue'
  screenSize: { width: number; height: number }
}> = ({ show, screenSize }) => {
  if (!show) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: 160, background: 'rgba(0, 0, 0, 0.85)' }}
    >
      {/* Golden Rays */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 360) / 12
        return (
          <div
            key={`ray-${i}`}
            className="absolute"
            style={{
              width: '8px',
              height: `${screenSize.height * 0.6}px`,
              background: 'linear-gradient(to bottom, transparent, #fbbf24, transparent)',
              transformOrigin: 'center',
              transform: `rotate(${angle}deg)`,
              animation: `goldenRay 2s ease-out ${i * 0.05}s forwards`,
              opacity: 0
            }}
          />
        )
      })}

      {/* Central Burst */}
      <div
        className="absolute"
        style={{
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #fbbf2480 0%, transparent 70%)',
          animation: 'centralBurst 1.5s ease-out forwards'
        }}
      />

      {/* SENSHU Text with Multiple Layers */}
      <div className="relative">
        {/* Background Glow Layers */}
        {[0, 1, 2].map((i) => (
          <div
            key={`glow-${i}`}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              animation: `senshuGlow 1.5s ease-out ${i * 0.1}s infinite`,
              opacity: 0.3 - i * 0.1
            }}
          >
            <div
              style={{
                fontSize: `${screenSize.height * 0.15}px`,
                fontWeight: 900,
                color: '#fbbf24',
                textShadow: '0 0 80px #fbbf24',
                filter: 'blur(20px)'
              }}
            >
              ⭐ SENSHU ⭐
            </div>
          </div>
        ))}

        {/* Main Text */}
        <div
          className="relative"
          style={{
            fontSize: `${screenSize.height * 0.15}px`,
            fontWeight: 900,
            background: 'linear-gradient(45deg, #fbbf24, #fde047, #fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 60px #fbbf24, 0 0 120px #fbbf24',
            animation: 'senshuBounce 1.5s ease-out forwards',
            filter: 'drop-shadow(0 0 40px #fbbf24)'
          }}
        >
          ⭐ SENSHU ⭐
        </div>
      </div>

      {/* Floating Stars */}
      {[...Array(20)].map((_, i) => {
        const randomX = Math.random() * 100
        const randomY = Math.random() * 100
        const randomDelay = Math.random() * 0.5
        return (
          <div
            key={`float-star-${i}`}
            className="absolute"
            style={{
              left: `${randomX}%`,
              top: `${randomY}%`,
              fontSize: '40px',
              animation: `floatingStar 2s ease-out ${randomDelay}s forwards`,
              opacity: 0
            }}
          >
            ⭐
          </div>
        )
      })}
    </div>
  )
}

// Ultra Round Change Effect
export const UltraRoundChangeEffect: React.FC<{
  show: boolean
  round: number
  screenSize: { width: number; height: number }
}> = ({ show, round, screenSize }) => {
  if (!show) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: 170, background: 'rgba(0, 0, 0, 0.95)' }}
    >
      {/* Expanding Circles */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={`circle-${i}`}
          className="absolute"
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            border: '4px solid rgba(255, 255, 255, 0.5)',
            animation: `expandCircle 2s ease-out ${i * 0.2}s forwards`,
            opacity: 0
          }}
        />
      ))}

      {/* Round Number */}
      <div className="relative">
        <div
          style={{
            fontSize: `${screenSize.height * 0.25}px`,
            fontWeight: 900,
            color: '#fff',
            textShadow: '0 0 60px rgba(255, 255, 255, 0.8), 0 0 120px rgba(255, 255, 255, 0.6)',
            animation: 'roundNumberPop 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            marginBottom: '40px'
          }}
        >
          ROUND {round}
        </div>

        {/* FIGHT text */}
        <div
          className="text-center"
          style={{
            fontSize: `${screenSize.height * 0.12}px`,
            fontWeight: 900,
            background: 'linear-gradient(45deg, #ef4444, #f59e0b, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'fightText 2s ease-out 0.8s forwards',
            opacity: 0,
            filter: 'drop-shadow(0 0 40px rgba(255, 255, 255, 0.8))'
          }}
        >
          FIGHT!
        </div>
      </div>

      {/* Energy Bolts */}
      {[...Array(6)].map((_, i) => {
        const angle = (i * 360) / 6
        return (
          <div
            key={`bolt-${i}`}
            className="absolute"
            style={{
              width: '6px',
              height: '400px',
              background: 'linear-gradient(to bottom, transparent, #fff, transparent)',
              transformOrigin: 'center',
              transform: `rotate(${angle}deg)`,
              animation: `energyBolt 1.5s ease-out ${i * 0.1}s forwards`,
              opacity: 0
            }}
          />
        )
      })}
    </div>
  )
}
