import { create } from 'zustand'

interface BreadcrumbItem {
  label: string
  path?: string
}

interface BreadcrumbState {
  title: string
  breadcrumbItems: BreadcrumbItem[]
  setTitle: (title: string) => void
  setBreadcrumb: (items: BreadcrumbItem[]) => void
  clearBreadcrumb: () => void
}

const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
  title: '',
  breadcrumbItems: [],
  setTitle: (title) => set({ title }),
  setBreadcrumb: (items) => set({ breadcrumbItems: items }),
  clearBreadcrumb: () => set({ breadcrumbItems: [], title: '' })
}))

export default useBreadcrumbStore
