import React, { JSX, useEffect, useState } from 'react'
import { Button } from '@renderer/components/ui/button'
import { useDetail } from './hook/useDetail'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Sword,
  Brackets,
  Trophy,
  Clock,
  User
} from 'lucide-react'
import useBreadcrumbStore from '@store/breadCrumb.store'
import { format } from 'date-fns'
import { statusCategoryBracket, statusEvent, statusMatch } from '@utils/optionsData'
import {
  Match,
  SVGViewer,
  DoubleEliminationBracket,
  SingleEliminationBracket
} from '@g-loot/react-tournament-brackets'
import { convertToSingleBracket } from '@utils/singleBracketFormater'
import { convertToDoubleBracket } from '@utils/doubleBracketFormater'
import { CustomThemeBracket } from '@utils/bracketOptions'
import { Input } from '@components/ui/input'
import { IMatch } from '@renderer/interface/match.interface'
import { useNavigate } from 'react-router-dom'
import { IParticipant } from '@renderer/interface/participant.interface'
import { formatDateTime } from '@renderer/utils/myFunctions'
import { MyContainer } from '@renderer/components/core/MyContainer'

type TabType = 'matches' | 'brackets'

export const DetailEventPage: React.FC = () => {
  const { setBreadcrumb, setTitle } = useBreadcrumbStore()
  const {
    eventData,
    brackets,
    selectedBracket,
    loading,
    dataMatch,
    getTitlePage,
    handleSelectBracket,
    navigate
  } = useDetail()
  const [activeTab, setActiveTab] = useState<TabType>('matches')
  const [matchSearchTerm, setMatchSearchTerm] = useState('')

  const handleMatchSearch = (searchTerm: string): void => {
    setMatchSearchTerm(searchTerm)
  }

  useEffect(() => {
    setBreadcrumb([
      { label: 'Dashboard', path: '/system' },
      { label: getTitlePage(), path: `/system/${getTitlePage('path')}` },
      { label: 'Detail', path: '#' }
    ])
    setTitle('Dashboard')
  }, [])

  if (loading.fetchDetail) {
    return (
      <MyContainer>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Memuat data event...</p>
          </div>
        </div>
      </MyContainer>
    )
  }

  if (!eventData) {
    return (
      <MyContainer>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Data event tidak ditemukan</p>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Kembali
            </Button>
          </div>
        </div>
      </MyContainer>
    )
  }
  let simpleBracketData
  if (selectedBracket?.bracket_type === 'SINGLE_ELIMINATION') {
    simpleBracketData = selectedBracket && convertToSingleBracket(selectedBracket!)
  } else {
    simpleBracketData = selectedBracket && convertToDoubleBracket(selectedBracket!)
  }

  // Filter matches based on search term
  const filteredMatches =
    selectedBracket?.matches?.filter((match) => {
      if (!matchSearchTerm.trim()) return true
      const searchLower = matchSearchTerm.toLowerCase()
      return (
        match.match_number?.toString().includes(searchLower) ||
        match.red_corner?.full_name?.toLowerCase().includes(searchLower) ||
        match.blue_corner?.full_name?.toLowerCase().includes(searchLower) ||
        match.round_number?.toString().includes(searchLower) ||
        `match ${match.match_number}`.toLowerCase().includes(searchLower)
      )
    }) || []

  const handleDetailBracket = (uuid: string): void => {
    navigate(`/bracket/${uuid}`)
    const payloadIpc = {
      type: 'BRACKET_DISPLAY',
      bracketId: uuid
    }
    window.electron?.ipcRenderer.send('mirror-to-main', payloadIpc)
  }

  const menuItems = [
    {
      id: 'matches',
      label: 'Pertandingan',
      icon: Sword,
      count: selectedBracket?.matches?.length || 0
    },
    {
      id: 'brackets',
      label: 'Braket',
      icon: Brackets,
      count: brackets.length || 0
    }
  ]

  return (
    <div className="px-5 lg:px-10 h-[calc(100vh-40px)] flex flex-col overflow-hidden">
      {/* Header Section - Fixed */}
      <div className="flex-shrink-0 py-6">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali
        </Button>

        {/* Event Info Card */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {eventData.name}
                </h1>
                <span
                  className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusEvent[eventData.status]?.className ||
                    'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {statusEvent[eventData.status]?.label || 'Unknown'}
                </span>
              </div>

              {/* Quick Info Row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>
                    {format(new Date(eventData.start_date), 'dd MMM yyyy')} -{' '}
                    {format(new Date(eventData.end_date), 'dd MMM yyyy')}
                  </span>
                </div>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{eventData.location}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {eventData.participants?.length || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Peserta</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {brackets.length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Bracket</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedBracket?.matches?.length || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Match</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation - Fixed */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex gap-1 overflow-x-auto pb-px">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
                {item.count > 0 && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            )
          })}
          {activeTab === 'brackets' && selectedBracket && (
            <Button
              onClick={() => handleDetailBracket(selectedBracket.uuid)}
              variant="outline"
              size="sm"
              className="gap-2 h-[40px] bg-gray-900 dark:bg-gray-800 border-gray-900 dark:border-gray-700 text-white dark:text-gray-200 ml-auto"
            >
              <Brackets className="w-4 h-4" />
              Full Screen
            </Button>
          )}
        </nav>
      </div>

      {/* Tab Content - Scrollable */}
      <div className="flex-1 overflow-auto pb-4">
        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Cari pertandingan (nama peserta, nomor match, ronde)..."
                value={matchSearchTerm}
                onChange={(e) => handleMatchSearch(e.target.value)}
                className="w-full h-[45px] rounded-lg shadow-sm focus:ring-2 focus:ring-primary/40 border-gray-300"
              />
              {matchSearchTerm.trim() && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Menampilkan {filteredMatches.length} dari {selectedBracket?.matches?.length || 0}{' '}
                  pertandingan
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading.fetchMatch ? (
                <>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
                    >
                      <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between">
                          <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                          <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        </div>
                        <div className="h-10 w-full bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
                        <div className="h-3 w-8 bg-slate-200 dark:bg-slate-700 rounded self-center animate-pulse"></div>
                        <div className="h-10 w-full bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
                        <div className="h-3 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : dataMatch && dataMatch.length > 0 ? (
                dataMatch.map((match) => <MatchCard key={match.id} match={match} />)
              ) : (
                <div className="col-span-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-3">
                    <Sword className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Belum ada pertandingan
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Pertandingan yang ditugaskan akan muncul di sini.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Brackets Tab */}
        {activeTab === 'brackets' && (
          <div className="space-y-4">
            {/* Bracket Cards Overview */}
            {brackets.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {brackets.map((bracket) => (
                  <div
                    key={bracket.id}
                    onClick={() => handleSelectBracket(bracket)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedBracket?.id === bracket.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                          {bracket.name} - {statusCategoryBracket[bracket.category].label} -{' '}
                          {bracket.class_name}
                        </h4>
                        {/* <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {bracket.bracket_type.replace("_", " ")}
                          </p> */}
                      </div>
                      {selectedBracket?.id === bracket.id && (
                        <span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded-full">
                          Aktif
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {bracket.total_participant || 0} peserta
                      </span>
                      <span className="flex items-center gap-1">
                        <Sword className="w-3 h-3" />
                        {bracket.matches?.length || 0} match
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bracket Visualization */}
            {selectedBracket && selectedBracket.matches && selectedBracket.matches.length > 0 ? (
              selectedBracket.bracket_type === 'SINGLE_ELIMINATION' ? (
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
                      width={window.innerWidth - 150}
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
                      width={window.innerWidth - 150}
                      height={window.innerHeight - 80}
                      {...props}
                    >
                      {children}
                    </SVGViewer>
                  )}
                />
              )
            ) : brackets.length === 0 ? (
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-8 bg-white dark:bg-slate-800 text-center">
                <Brackets className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Belum ada bracket. Buat bracket baru untuk memulai.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-8 bg-white dark:bg-slate-800 text-center">
                <Brackets className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
                <p className="text-gray-500 dark:text-gray-400">
                  Pilih bracket untuk melihat visualisasi.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const MatchCard = ({ match }: { match: IMatch }): JSX.Element => {
  const navigate = useNavigate()
  const getParticipantName = (participant: IParticipant): string => participant?.full_name || '-'
  const getInitial = (participant: IParticipant): string =>
    participant?.full_name ? participant.full_name.charAt(0).toUpperCase() : '?'

  const handleDetailScoring = (matchUuid: string): void | Promise<void> => {
    if (match.status === 'FINISHED') {
      return navigate(`/scoring/history/${matchUuid}`)
    }
    navigate(`/scoring/xyz/${matchUuid}`)
    const payloadIpc = {
      type: 'SCORING_DISPLAY',
      matchId: matchUuid
    }
    window.electron?.ipcRenderer.send('mirror-to-main', payloadIpc)
  }

  return (
    <div
      onClick={() => handleDetailScoring(match.uuid)}
      className="relative cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col"
    >
      {/* Color accent stripe */}
      <div className={`h-1 w-full ${statusMatch[match.status]?.bgcolor}`}></div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Header row: match number + status badge */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            Match {match.match_number}
          </span>
          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-500 dark:text-gray-400">
            Ronde {match.round_number}
          </span>
        </div>

        {/* Fighter rows */}
        <div className="flex flex-col gap-1">
          {/* Red Corner */}
          <div
            className={`relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg border ${
              match.winner_id && match.winner_id === match.red_corner_id
                ? 'bg-green-50 dark:bg-green-900/15 border border-green-200 dark:border-green-800'
                : match.red_corner
                  ? 'bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20'
                  : 'bg-gray-50 dark:bg-gray-900/30 border border-dashed border-gray-250 dark:border-gray-600'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                match.winner_id && match.winner_id === match.red_corner_id
                  ? 'bg-green-500'
                  : match.red_corner
                    ? 'bg-red-500'
                    : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span className="text-white text-xs font-bold">{getInitial(match.red_corner)}</span>
            </div>
            <span className={`font-semibold text-sm text-slate-800 dark:text-slate-200 truncate`}>
              {getParticipantName(match.red_corner)}
            </span>
            {match.winner_id && match.winner_id === match.red_corner_id && (
              <Trophy className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 dark:text-green-400" />
            )}
          </div>

          {/* VS Divider */}
          <div className="flex items-center justify-center gap-2 py-0.5">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-200 dark:to-slate-700"></div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-widest">
              VS
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-200 dark:to-slate-700"></div>
          </div>

          {/* Blue Corner */}
          <div
            className={`relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg border ${
              match.winner_id && match.winner_id === match.blue_corner_id
                ? 'bg-green-50 dark:bg-green-900/15 border border-green-200 dark:border-green-800'
                : match.blue_corner
                  ? 'bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20'
                  : 'bg-gray-50 dark:bg-gray-900/30 border border-dashed border-gray-250 dark:border-gray-600'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                match.winner_id && match.winner_id === match.blue_corner_id
                  ? 'bg-green-500'
                  : match.blue_corner
                    ? 'bg-blue-500'
                    : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span className="text-white text-xs font-bold">{getInitial(match.blue_corner)}</span>
            </div>
            <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">
              {getParticipantName(match.blue_corner)}
            </span>
            {match.winner_id && match.winner_id === match.blue_corner_id && (
              <Trophy className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 dark:text-green-400" />
            )}
          </div>
        </div>

        {/* Meta info: time + referee */}
        <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800 mt-0.5">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Clock size={13} className="text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="truncate">
              {match.start_time ? formatDateTime(match.start_time) : '-'}
              {match.end_time ? ` - ${formatDateTime(match.end_time)}` : ''}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <User size={13} className="text-slate-400 dark:text-slate-500 shrink-0" />
            <span>Penilai: {match.referee?.full_name || '-'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className={`${statusMatch[match.status].textcolor}`}>
              Status: {statusMatch[match.status]?.label || '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
