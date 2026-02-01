import { Button } from '@renderer/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@renderer/components/ui/avatar'
import { Separator } from '@renderer/components/ui/separator'
import { User, MapPin, Calendar, Phone, Mail, Sword, Clock, Trophy } from 'lucide-react'
import React from 'react'
import { useIndex } from './hook/useIndex'
import { formatDate, formatDateTime, getUrlImage } from '@renderer/utils/myFunctions'
import { IMatch } from '@renderer/interface/match.interface'
import { IParticipant } from '@renderer/interface/participant.interface'
import { useNavigate } from 'react-router-dom'
import { statusMatch } from '@renderer/utils/optionsData'

export const HomePage: React.FC = () => {
  const { dataMatch, dataStaff, loading } = useIndex()
  const getInitials = (name: string): string => {
    return name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'S'
  }

  const handleSendTOIpc = (): void => {
    const payload = {
      type: 'WAITING_DISPLAY'
    }
    window.electron?.ipcRenderer.send('scoring-to-main', payload)
  }

  // Summary counts for the pill bar
  const totalMatches = dataMatch?.length || 0
  const scheduledCount = dataMatch?.filter((m) => m.status === 'SCHEDULED').length || 0
  const ongoingCount = dataMatch?.filter((m) => m.status === 'ONGOING').length || 0
  const finishedCount = dataMatch?.filter((m) => m.status === 'FINISHED').length || 0
  const canceledCount = dataMatch?.filter((m) => m.status === 'CANCELED').length || 0

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-sm relative py-10 px-5">
        {/* Left Section - Welcome Message & Match List */}
        <div className="md:col-span-8 p-5 pt-0">
          <div className="flex flex-col gap-6">
            {/* Welcome Header */}
            <div className="flex flex-col justify-center">
              <h2 className="font-medium text-[25px] text-slate-600 dark:text-slate-400">
                Halo, Selamat Datang
              </h2>
              <h1 className="font-bold text-[35px] mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {loading.fetchDetailUser ? 'Loading...' : dataStaff?.full_name || 'Staff'}
              </h1>
            </div>

            {/* Match List */}
            <div>
              {/* Section header with title + summary pills */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="font-semibold text-lg text-slate-700 dark:text-slate-200">
                  Daftar Pertandingan
                </h3>

                {/* Summary pills - only show when data is loaded */}
                {!loading.fetchMatch && totalMatches > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                      <Sword className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {totalMatches} Total
                      </span>
                    </span>
                    {ongoingCount > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                          {ongoingCount} {statusMatch['ONGOING']?.label}
                        </span>
                      </span>
                    )}
                    {scheduledCount > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          {scheduledCount} {statusMatch['SCHEDULED']?.label}
                        </span>
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                        {finishedCount} {statusMatch['FINISHED']?.label}
                      </span>
                    </span>
                    {canceledCount > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 dark:bg-red-900/20 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                          {canceledCount} {statusMatch['CANCELED']?.label}
                        </span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Match Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading.fetchMatch ? (
                  <div className="col-span-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
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
                    </div>
                  </div>
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
          </div>
        </div>

        {/* Right Section - Staff Profile */}
        <div className="md:col-span-4">
          <div className="sticky top-5 bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-800">
            {/* Header banner */}
            <div className="h-32 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <Avatar className="w-32 h-32 border-4 border-white dark:border-slate-900 shadow-xl">
                  <AvatarImage
                    src={getUrlImage(dataStaff?.photo?.[0]?.url || '')}
                    alt={dataStaff?.full_name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-3xl font-bold">
                    {dataStaff ? getInitials(dataStaff.full_name) : 'S'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Profile content */}
            <div className="pt-20 pb-6 px-6">
              {/* Name + position */}
              <div className="text-center mb-5">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
                  {loading.fetchDetailUser ? 'Loading...' : dataStaff?.full_name || 'Unknown Staff'}
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {dataStaff?.position || 'No Position'}
                  </p>
                </span>
              </div>

              <Separator className="my-4" />

              {/* Staff Info */}
              <div className="space-y-4">
                <SidebarItem
                  icon={<Calendar size={18} className="text-blue-500" />}
                  label="Tempat, Tanggal Lahir"
                  value={`${dataStaff?.birth_place || '-'}, ${
                    dataStaff?.birth_date ? formatDate(dataStaff.birth_date) : '-'
                  }`}
                />
                <SidebarItem
                  icon={<MapPin size={18} className="text-blue-500" />}
                  label="Alamat"
                  value={dataStaff?.address || '-'}
                />
                <SidebarItem
                  icon={<Phone size={18} className="text-blue-500" />}
                  label="Telepon"
                  value={dataStaff?.phone || '-'}
                />
                <SidebarItem
                  icon={<Mail size={18} className="text-blue-500" />}
                  label="Email"
                  value={dataStaff?.email || '-'}
                />
              </div>

              <Separator className="my-4" />

              <Button className="w-full" variant="outline" onClick={() => handleSendTOIpc()}>
                Edit Profil
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const MatchCard = ({ match }: { match: IMatch }) => {
  const navigate = useNavigate()
  const getParticipantName = (participant: IParticipant): string => participant?.full_name || '-'
  const getInitial = (participant: IParticipant): string =>
    participant?.full_name ? participant.full_name.charAt(0).toUpperCase() : '?'

  const handleDetailScoring = (matchUuid: string): void => {
    navigate(`/scoring/xyz/${matchUuid}`)
    const payloadIpc = {
      type: 'SCORING_DISPLAY',
      matchId: matchUuid
    }
    window.electron?.ipcRenderer.send('scoring-to-main', payloadIpc)
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

export const SidebarItem = ({
  icon,
  label,
  value
}: {
  icon: React.ReactNode
  label: string
  value: string
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
}) => (
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-2">{value}</p>
    </div>
  </div>
)
