/* eslint-disable react-refresh/only-export-components */
import React from 'react'
import { Badge } from '@renderer/components/ui/badge'
import moment from 'moment/min/moment-with-locales'
import { MD5 } from 'crypto-js'
import { STAT_CONFIG } from './optionsData'
import { useConfigStore } from '@renderer/store/configProvider'

moment.locale('id')

export const formatDate = (dateString: Date | string): string => {
  const date = new Date(dateString)
  const options = new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  })
  return options.format(date)
}

export const formatTime = (isoString: Date | string): string => {
  const date = new Date(isoString)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

export const formatDateTime = (dateString: string | Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }

  const date = new Date(dateString)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const formattedDate = date.toLocaleDateString('id-ID', options).replace(/,/, '')
  const formattedTime = `${hours}:${minutes}`
  return `${formattedDate} ${formattedTime} WIB`
}

export const formatGender = (gender: string): string => {
  switch (gender) {
    case 'L':
      return 'Laki-laki'
    case 'P':
      return 'Perempuan'
    default:
      return ''
  }
}

export const decodeToken = (token: string): Record<string, unknown> => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  )
  return JSON.parse(jsonPayload)
}

export const getDayNow = (): string => moment().format('dddd')
export const getDayMonth = (): string => moment().format('MMMM')

export const toolbarOptions: (string | Record<string, unknown>)[][] = [
  [{ header: '1' }, { header: '2' }, { font: [] }],
  [{ size: ['small', false, 'large', 'huge'] }],
  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
  [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
  ['link', 'image', 'video'],
  [{ align: [] }, { color: [] }, { background: [] }],
  ['clean']
]

export const formatRupiah = (
  angka: number | string | null | undefined,
  valas: number = 1
): string => {
  if (angka === null || angka === undefined || angka === '') {
    return '0'
  }

  const reverse = angka.toString().split('').reverse().join('')
  const ribuan = reverse.match(/\d{1,3}/g)
  const formatted = ribuan?.join('.').split('').reverse().join('') || '0'

  return valas === 0 ? formatted : 'Rp ' + formatted
}

export const formatTitleUrl = (text: string): string => {
  return text
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .toLowerCase()
}

export const getCurrentTime = (): string => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

export const convertStatusVisitor = (status: string): React.ReactNode => {
  const statusMap: Record<string, { label: string; className: string }> = {
    PENDING: { label: 'MENUNGGU', className: 'bg-yellow-500 hover:bg-yellow-600 text-neutral-50' },
    ACTIVE: { label: 'DISETUJUI', className: 'bg-green-500 hover:bg-green-600 text-neutral-50' },
    USED: { label: 'DIGUNAKAN', className: 'bg-blue-500 hover:bg-blue-600 text-neutral-50' },
    DENIED: { label: 'DITOLAK', className: 'bg-red-500 hover:bg-red-600 text-neutral-50' }
  }

  const data = statusMap[status]
  if (!data) return '-'

  return (
    <Badge variant="secondary" className={data.className}>
      {data.label}
    </Badge>
  )
}

export const convertStatusUser = (status: string): React.ReactNode => {
  return status === 'ACTIVE' ? (
    <span className="badge text-bg-primary">Aktif</span>
  ) : (
    <span className="badge text-bg-danger">Tidak Aktif</span>
  )
}

export const getUrlImage = (data: string, placeholder = true): string => {
  const { config } = useConfigStore.getState()
  const api = config?.api_url || 'http://localhost/3003'
  if (!data && placeholder) return ''
  return api.replace('/api', '') + data
}

export const getUrlProfilePartisipant = (data: string, placeholder = true): string => {
  const { config } = useConfigStore.getState()
  const api = `${config?.api_url}/uploads/media/`
  if (!data && placeholder) {
    return ''
  }

  return `${api}/${data}`
}

export const getMyEnv = (key: string): string => {
  const envValue = import.meta.env[key as keyof ImportMetaEnv]
  if (!envValue) {
    console.warn(`⚠️ Environment variable "${key}" tidak ditemukan.`)
    return ''
  }
  return envValue
}

const now = new Date()
const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)

export const formatDateTimeLocal = (date: Date): string => {
  const pad = (num: number): string => num.toString().padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export const defaultTimeReservation = formatDateTimeLocal(oneHourLater)

export const toPlus62 = (phone: string): string | null => {
  if (!phone || typeof phone !== 'string') return null
  const digits = phone.replace(/\D+/g, '')
  if (!digits) return null

  if (digits.startsWith('0')) return '+62' + digits.slice(1)
  if (digits.startsWith('62')) return '+' + digits
  if (digits.startsWith('8')) return '+62' + digits

  const stripped = digits.replace(/^0+/, '')
  if (stripped !== digits) {
    if (stripped.startsWith('62')) return '+' + stripped
    if (stripped.startsWith('8')) return '+62' + stripped
  }

  return '+' + digits
}

export const getStartOfCurrentMonth = (): string => moment().startOf('month').format('YYYY-MM-DD')
export const getEndOfCurrentMonth = (): string => moment().endOf('month').format('YYYY-MM-DD')

export const convertStatusTicket: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: 'MENUNGGU',
    className:
      'px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200'
  },
  ACTIVE: {
    label: 'DISETUJUI',
    className:
      'px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200'
  },
  USED: {
    label: 'DIGUNAKAN',
    className:
      'px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200'
  },
  DENIED: {
    label: 'DITOLAK',
    className:
      'px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200'
  },
  COMPLETE: {
    label: 'SELESAI',
    className:
      'px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 border border-cyan-200'
  }
}

export const getDigitMD5Serial = (nilai: string): string => {
  const onlyNumber = nilai.replace(/\D/g, '')

  // Mengambil 10 digit pertama (jika tersedia)
  const first10Digits = onlyNumber.slice(0, 10)

  // Mengisi dengan 0 jika panjangnya kurang dari 10
  const digitCount = first10Digits.length
  if (digitCount < 10) {
    const sisaDigit = 10 - digitCount
    const nol = '0'.repeat(sisaDigit)
    return first10Digits + nol
  } else {
    return first10Digits
  }
}

export const recursiveMD5 = (text: string, rounds: number): string => {
  if (rounds === 0) {
    return text
  } else {
    return recursiveMD5(MD5(text).toString(), rounds - 1)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-function-return-type
export const generateStats = (statistic?: any) => {
  if (!statistic) return []

  return Object.entries(STAT_CONFIG).map(([key, config]) => ({
    ...config,
    value: statistic.ticket?.[key] ?? statistic.stats?.[key] ?? 0
  }))
}

export const convertStatusLogGate: Record<string, { label: string; className: string }> = {
  ENTER: {
    label: 'IN',
    className:
      'px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200'
  },
  EXIT: {
    label: 'OUT',
    className:
      'px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200'
  }
}

export const formatGenderParticipant = (gender: string): string => {
  if (gender === 'L') {
    return 'Putra'
  } else if (gender === 'P') {
    return 'Putri'
  } else {
    return ''
  }
}
