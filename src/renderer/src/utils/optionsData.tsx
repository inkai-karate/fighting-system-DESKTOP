import { CheckCircle, Clock, FileText, Ticket, XCircle } from 'lucide-react'

export const optionsStatus = [
  { value: '1', label: 'Aktif' },
  { value: '0', label: 'Tidak Aktif' }
]

export const optionsStatus2 = [
  { value: 'ACTIVE', label: 'Aktif' },
  { value: 'NONACTIVE', label: 'Tidak Aktif' }
]

export const optionsPrioritas = Array.from({ length: 20 }, (_, index) => ({
  value: (index + 1).toString(),
  label: (index + 1).toString()
}))

export const optionsSatuan = [
  { value: 'Unit', label: 'Unit' },
  { value: 'PCS', label: 'PCS' },
  { value: 'Karton', label: 'Karton' },
  { value: 'Paket', label: 'Paket' },
  { value: 'Gram', label: 'Gram' },
  { value: 'Kilogram', label: 'Kilogram' },
  { value: 'Meter', label: 'Meter' }
]

export const optionsTarif = [
  { value: 'SPD', label: 'Sepeda Motor' },
  { value: 'MOB', label: 'Mobil' }
]

export const optionsValidMember = [
  { value: '0', label: 'Tidak' },
  { value: '1', label: 'Ya' }
]

export const optionsPagination = [10, 25, 50, 100]
export const optionInitialLimit = 25
export const timeDebounce = 500

export const optionsTime30minute = (): string[] => {
  const times: string[] = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = String(h).padStart(2, '0')
      const mm = String(m).padStart(2, '0')
      times.push(`${hh}:${mm}`)
    }
  }
  return times
}

export const toastMessage = {
  loadError: (sub: string) => ({
    title: `Gagal Memuat Data ${sub}`,
    desc: 'Terjadi kesalahan saat memuat data.'
  }),
  createSuccess: (sub: string) => ({
    title: 'Berhasil Menambah Data',
    desc: `Data ${sub} berhasil ditambahkan!`
  }),
  createError: (sub: string) => ({
    title: 'Gagal Menambah Data',
    desc: `Gagal menambah data ${sub}!`
  }),
  updateSuccess: (sub: string) => ({
    title: 'Berhasil Memperbarui Data',
    desc: `Data ${sub} berhasil diperbarui!`
  }),
  updateError: (sub: string) => ({
    title: 'Gagal Memperbarui Data',
    desc: `Gagal memperbarui data ${sub}!`
  }),
  deleteSuccess: (sub: string) => ({
    title: 'Berhasil Menghapus Data',
    desc: `Data ${sub} berhasil dihapus!`
  }),
  deleteError: (sub: string) => ({
    title: 'Gagal Menghapus Data',
    desc: `Gagal menghapus data ${sub}!`
  }),
  validationError: () => ({
    title: 'Validasi Error',
    desc: 'Data yang dimasukkan tidak valid.'
  }),
  serverError: () => ({
    title: 'Error',
    desc: 'Terjadi kesalahan pada server!'
  }),
  idNotFound: () => ({
    title: 'Gagal',
    desc: 'ID tidak ditemukan!'
  }),
  resendSuccess: () => ({
    title: 'Berhasil Mengirim Ulang Tiket',
    desc: 'Tiket berhasil dikirim ulang!'
  }),
  resendError: () => ({
    title: 'Gagal Mengirim Ulang Tiket',
    desc: 'Gagal mengirim ulang tiket!'
  })
}

export const STAT_CONFIG = {
  created: {
    label: 'Total',
    icon: FileText,
    color: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50',
    bgDark: 'dark:bg-blue-950/30',
    textLight: 'text-blue-600',
    textDark: 'dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/50'
  },
  pending: {
    label: 'Menunggu',
    icon: Clock,
    color: 'from-amber-500 to-amber-600',
    bgLight: 'bg-amber-50',
    bgDark: 'dark:bg-amber-950/30',
    textLight: 'text-amber-600',
    textDark: 'dark:text-amber-400',
    iconBg: 'bg-amber-100 dark:bg-amber-900/50'
  },
  approved: {
    label: 'Disetujui',
    icon: CheckCircle,
    color: 'from-emerald-500 to-emerald-600',
    bgLight: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-950/30',
    textLight: 'text-emerald-600',
    textDark: 'dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/50'
  },
  used: {
    label: 'Sedang Digunakan',
    icon: Ticket,
    color: 'from-violet-500 to-violet-600',
    bgLight: 'bg-violet-50',
    bgDark: 'dark:bg-violet-950/30',
    textLight: 'text-violet-600',
    textDark: 'dark:text-violet-400',
    iconBg: 'bg-violet-100 dark:bg-violet-900/50'
  },
  denied: {
    label: 'Ditolak',
    icon: XCircle,
    color: 'from-rose-500 to-rose-600',
    bgLight: 'bg-rose-50',
    bgDark: 'dark:bg-rose-950/30',
    textLight: 'text-rose-600',
    textDark: 'dark:text-rose-400',
    iconBg: 'bg-rose-100 dark:bg-rose-900/50'
  },
  completed: {
    label: 'Selesai',
    icon: CheckCircle,
    color: 'from-cyan-500 to-cyan-600',
    bgLight: 'bg-cyan-50',
    bgDark: 'dark:bg-cyan-950/30',
    textLight: 'text-cyan-600',
    textDark: 'dark:text-cyan-400',
    iconBg: 'bg-cyan-100 dark:bg-cyan-900/50'
  }
} as const

export const statusExamSession: Record<
  string,
  { value: string; label: string; className: string }
> = {
  1: {
    value: '1',
    label: 'Sedang Ujian',
    className:
      'px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200'
  },
  2: {
    value: '2',
    label: 'Dikumpul',
    className:
      'px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200'
  },
  3: {
    value: '3',
    label: 'Habis Waktu',
    className:
      'px-3 py-1 rounded-full text-xs font-medium bg-danger-100 text-danger-800 border border-danger-200'
  }
}
