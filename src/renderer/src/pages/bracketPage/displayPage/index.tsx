import React, { useMemo } from 'react'
import { Sword, RotateCcw, Trophy, AlertCircle } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import useIndex from './../hook/useIndex'
import { CustomThemeBracket } from '@utils/bracketOptions'
import { convertToSingleBracket } from '@utils/singleBracketFormater'
import { convertToDoubleBracket } from '@utils/doubleBracketFormater'
import {
  Match,
  SVGViewer,
  DoubleEliminationBracket,
  SingleEliminationBracket
} from '@g-loot/react-tournament-brackets'
import { statusMatch } from '@utils/optionsData'
import { useScreenResponsive } from '../../scoringPage/hook/useScreenResponsive'
import { useSocketIpc } from '@renderer/components/core/hook/useSocketIpc'

export const BracketScreenPageDisplayPage: React.FC = () => {
  const { bracket, matches, isLoading, error, refreshData } = useIndex()
  const { screenSize } = useScreenResponsive()
  // eslint-disable-next-line no-empty-pattern
  const {} = useSocketIpc()

  let simpleBracketData
  if (bracket?.bracket_type === 'SINGLE_ELIMINATION') {
    simpleBracketData = bracket && convertToSingleBracket(bracket!)
  } else {
    simpleBracketData = bracket && convertToDoubleBracket(bracket!)
  }

  // Calculate stats
  const stats = useMemo(() => {
    const total = matches.length
    const scheduled = matches.filter((m) => m.status === 'SCHEDULED').length
    const ongoing = matches.filter((m) => m.status === 'ONGOING').length
    const completed = matches.filter((m) => m.status === 'FINISHED').length
    const canceled = matches.filter((m) => m.status === 'CANCELED').length

    return { total, completed, ongoing, scheduled, canceled }
  }, [matches])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Memuat data bracket...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-4">{error}</p>
          <Button onClick={refreshData} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  // Empty state
  if (!matches || matches.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Sword className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Belum ada pertandingan di bracket ini</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className=" bg-gray-900 flex flex-col"
      style={{
        width: `${screenSize.width}px`,
        height: `${screenSize.height > 758 ? screenSize.height * 0.96 : screenSize.height * 0.945}px`,
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Bracket Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                {bracket?.category || 'Bracket'} - {bracket?.class_name || ''}
                {/* {bracket?.name || ""} */}
              </h1>
              <p className="text-sm text-gray-400">
                {/* {bracket?.category} • {bracket?.total_participant || 0} Peserta */}
                {bracket?.event?.name || ''}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-gray-400">Total Match</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${statusMatch['FINISHED']?.textcolor}`}>
                {stats.completed}
              </p>
              <p className="text-xs text-gray-400">{statusMatch['FINISHED']?.label}</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${statusMatch['ONGOING']?.textcolor}`}>
                {stats.ongoing}
              </p>
              <p className="text-xs text-gray-400">{statusMatch['ONGOING']?.label}</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${statusMatch['SCHEDULED']?.textcolor}`}>
                {stats.scheduled}
              </p>
              <p className="text-xs text-gray-400">{statusMatch['SCHEDULED']?.label}</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${statusMatch['CANCELED']?.textcolor}`}>
                {stats.canceled}
              </p>
              <p className="text-xs text-gray-400">{statusMatch['CANCELED']?.label}</p>
            </div>
          </div>

          {/* Refresh Button */}
          <Button
            onClick={refreshData}
            variant="outline"
            size="sm"
            className="gap-2 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            <RotateCcw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </header>

      {/* Bracket Container */}
      <div className="flex-1 overflow-hidden">
        {bracket && bracket.bracket_type === 'SINGLE_ELIMINATION' ? (
          <SingleEliminationBracket
            matches={simpleBracketData}
            matchComponent={Match}
            theme={CustomThemeBracket}
            options={{
              style: {
                roundHeader: {
                  backgroundColor: CustomThemeBracket.roundHeader.backgroundColor,
                  fontColor: CustomThemeBracket.roundHeader.fontColor
                },
                connectorColor: CustomThemeBracket.connectorColor,
                connectorColorHighlight: CustomThemeBracket.connectorColorHighlight
              }
            }}
            svgWrapper={({
              children,
              ...props
            }: {
              children: React.ReactNode
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              [key: string]: any
            }) => (
              <SVGViewer
                background={CustomThemeBracket.svgBackground}
                SVGBackground={CustomThemeBracket.svgBackground}
                width={window.innerWidth}
                height={window.innerHeight - 80}
                {...props}
              >
                {children}
              </SVGViewer>
            )}
          />
        ) : (
          <DoubleEliminationBracket
            matches={simpleBracketData}
            matchComponent={Match}
            theme={CustomThemeBracket}
            options={{
              style: {
                roundHeader: {
                  backgroundColor: CustomThemeBracket.roundHeader.backgroundColor,
                  fontColor: CustomThemeBracket.roundHeader.fontColor
                },
                connectorColor: CustomThemeBracket.connectorColor,
                connectorColorHighlight: CustomThemeBracket.connectorColorHighlight
              }
            }}
            svgWrapper={({
              children,
              ...props
            }: {
              children: React.ReactNode
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              [key: string]: any
            }) => (
              <SVGViewer
                background={CustomThemeBracket.svgBackground}
                SVGBackground={CustomThemeBracket.svgBackground}
                width={window.innerWidth}
                height={window.innerHeight - 80}
                {...props}
              >
                {children}
              </SVGViewer>
            )}
          />
        )}
      </div>
    </div>
  )
}
