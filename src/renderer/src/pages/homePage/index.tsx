import { Button } from '@renderer/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@renderer/components/ui/avatar'
import { Separator } from '@renderer/components/ui/separator'
import { User, MapPin, Calendar, Phone, Mail } from 'lucide-react'
import React from 'react'
import { useIndex } from './hook/useIndex'
import { formatDate, formatDateTime, getUrlImage } from '@renderer/utils/myFunctions'
import { IMatch } from '@renderer/interface/match.interface'
import { IParticipant } from '@renderer/interface/participant.interface'
import { useNavigate } from 'react-router-dom'

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
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-sm relative">
        {/* Left Section - Welcome Message & Match List */}
        <div className="md:col-span-8 p-5 pt-0">
          <div className="flex flex-col gap-6">
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
              <h3 className="font-semibold text-lg mb-3 text-slate-700 dark:text-slate-200">
                Daftar Pertandingan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading.fetchMatch ? (
                  <div className="col-span-full text-center py-8 text-slate-400">Loading...</div>
                ) : dataMatch && dataMatch.length > 0 ? (
                  dataMatch.map((match) => <MatchCard key={match.id} match={match} />)
                ) : (
                  <div className="col-span-full text-center py-8 text-slate-400">
                    Tidak ada pertandingan
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Staff Profile */}
        <div className="md:col-span-4">
          <div className="sticky top-0 bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-800">
            {/* Header */}
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

            {/* Content */}
            <div className="pt-20 pb-6 px-6">
              {/* Name */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
                  {loading.fetchDetailUser ? 'Loading...' : dataStaff?.full_name || 'Unknown Staff'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {dataStaff?.position || 'No Position'}
                </p>
              </div>

              <Separator className="my-4" />

              {/* Staff Info */}
              <div className="space-y-4">
                <SidebarItem
                  icon={<User size={18} className="text-blue-500" />}
                  label="ID"
                  value={dataStaff?.uuid || '-'}
                />
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

              <Button className="w-full" variant="outline">
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

  return (
    <div
      onClick={() => navigate(`/scoring/xyz/${match.uuid}`)}
      className="cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-slate-400">Match #{match.match_number}</span>
        <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold">
          {match.status}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-red-500 truncate max-w-[120px]">
            {getParticipantName(match.red_corner)}
          </span>
          <span className="text-xs text-slate-400">vs</span>
          <span className="font-semibold text-blue-500 truncate max-w-[120px]">
            {getParticipantName(match.blue_corner)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
          <Calendar size={14} className="mr-1 text-blue-400" />
          <span>
            {match.start_time ? formatDateTime(match.start_time) : '-'}
            {match.end_time ? ` - ${formatDateTime(match.end_time)}` : ''}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <User size={14} className="mr-1 text-blue-400" />
          <span>Penilai: {match.referee?.full_name || '-'}</span>
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
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-2">{value}</p>
    </div>
  </div>
)
