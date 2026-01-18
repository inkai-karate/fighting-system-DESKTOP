import { create } from 'zustand'
import type { IConfigAsset } from '@renderer/interface/configAsset.interface'

interface ConfigState {
  config?: IConfigAsset
  assetsPathConfig: string
  isLoading: boolean
  fetchConfig: () => Promise<void>
  setConfig: (cfg: IConfigAsset) => void
}

export const useConfigStore = create<ConfigState>((set) => ({
  config: undefined,
  assetsPathConfig: '',
  isLoading: true,

  // 🔄 fetch config dari preload API (Electron)
  fetchConfig: async () => {
    try {
      const cfg = await window.api.getMyConfig()
      const img = await window.api.getImage()
      set({ config: cfg, assetsPathConfig: img, isLoading: false })
    } catch (err) {
      console.error('Failed to load config:', err)
      set({ isLoading: false })
    }
  },

  setConfig: (cfg) => set({ config: cfg })
}))
