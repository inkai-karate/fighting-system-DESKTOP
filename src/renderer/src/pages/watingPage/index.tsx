import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@renderer/components/ui/card'
import { Trophy, Clock } from 'lucide-react'
import { useSocketIpc } from '@renderer/components/core/hook/useSocketIpc'

export const WaitingPage: React.FC = () => {
  // eslint-disable-next-line no-empty-pattern
  const {} = useSocketIpc()

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timeInterval)
  }, [])

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="flex flex-col items-center gap-12 p-8 z-10">
        {/* Trophy Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-500 rounded-full blur-2xl opacity-50 animate-pulse" />
          <Trophy className="h-32 w-32 text-yellow-400 relative z-10" strokeWidth={1.5} />
        </div>

        {/* Main Card */}
        <Card className="w-full max-w-4xl bg-slate-800/50 backdrop-blur-xl border-slate-700 shadow-2xl">
          <CardContent className="p-16">
            <div className="flex flex-col items-center gap-8">
              {/* Status */}
              <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-4">Pertandingan Belum Dimulai</h1>
                <p className="text-2xl text-slate-300">
                  Mohon tunggu, persiapan sedang berlangsung
                </p>
              </div>

              {/* Clock Display */}
              <div className="flex items-center gap-6 bg-slate-900/50 px-12 py-8 rounded-2xl border border-slate-700">
                <Clock className="h-12 w-12 text-blue-400" />
                <div className="text-center">
                  <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tabular-nums">
                    {formatTime(currentTime)}
                  </div>
                  <div className="text-lg text-slate-400 mt-2">{formatDate(currentTime)}</div>
                </div>
              </div>

              {/* Loading Animation */}
              <div className="flex gap-3 mt-4">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{
                      animation: 'pulse 1.5s ease-in-out infinite',
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="text-center">
          <p className="text-xl text-slate-400">Pertandingan akan segera dimulai</p>
          <p className="text-sm text-slate-500 mt-2">Terima kasih atas kesabaran Anda</p>
        </div>
      </div>
    </div>
  )
}
