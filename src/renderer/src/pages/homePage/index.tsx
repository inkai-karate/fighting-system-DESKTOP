import { Button } from '@renderer/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@renderer/components/ui/avatar'
import { Separator } from '@renderer/components/ui/separator'
import { User, MapPin, Calendar, Phone, Mail } from 'lucide-react'
import React from 'react'
import { useIndex } from './hook/useIndex'
import { formatDate, getUrlImage } from '@renderer/utils/myFunctions'

export const HomePage: React.FC = () => {
  const { dataStudent, loading } = useIndex()

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-sm relative">
        {/* Left Section - Welcome Message */}
        <div className="md:col-span-8 p-5 pt-0">
          <div className="flex justify-between items-center">
            <div className="flex flex-col justify-center">
              <h2 className="font-medium text-[25px] text-slate-600 dark:text-slate-400">
                Halo, Selamat Datang
              </h2>
              <h1 className="font-bold text-[35px] mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {loading.fetchDetailUser ? 'Loading...' : dataStudent?.full_name || 'User'}
              </h1>
            </div>
          </div>
        </div>

        {/* Right Section - Student Profile */}
        <div className="md:col-span-4">
          <div className="sticky top-0 bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-800">
            {/* Header */}
            <div className="h-32 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <Avatar className="w-32 h-32 border-4 border-white dark:border-slate-900 shadow-xl">
                  <AvatarImage
                    src={getUrlImage(dataStudent?.photo?.[0]?.url || '')}
                    alt={dataStudent?.full_name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-3xl font-bold">
                    {dataStudent ? getInitials(dataStudent.full_name) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Content */}
            <div className="pt-20 pb-6 px-6">
              {/* Name */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
                  {loading.fetchDetailUser
                    ? 'Loading...'
                    : dataStudent?.full_name || 'Unknown User'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {dataStudent?.department?.name || 'No Department'}
                </p>
              </div>

              <Separator className="my-4" />

              {/* Student Info */}
              <div className="space-y-4">
                <SidebarItem
                  icon={<User size={18} className="text-blue-500" />}
                  label="NIS / NISN"
                  value={`${dataStudent?.nis || '-'} / ${dataStudent?.nisn || '-'}`}
                />

                <SidebarItem
                  icon={<Calendar size={18} className="text-blue-500" />}
                  label="Tempat, Tanggal Lahir"
                  value={`${dataStudent?.birth_place || '-'}, ${
                    dataStudent?.birth_date ? formatDate(dataStudent.birth_date) : '-'
                  }`}
                />

                <SidebarItem
                  icon={<MapPin size={18} className="text-blue-500" />}
                  label="Alamat"
                  value={dataStudent?.address || '-'}
                />

                <SidebarItem
                  icon={<Phone size={18} className="text-blue-500" />}
                  label="Telepon"
                  value={dataStudent?.phone || '-'}
                />

                <SidebarItem
                  icon={<Mail size={18} className="text-blue-500" />}
                  label="Email"
                  value={dataStudent?.email || '-'}
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
