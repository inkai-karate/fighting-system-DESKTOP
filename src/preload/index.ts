import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getMyConfig: async () => {
    return await ipcRenderer.invoke('get-my-config')
  },

  getImage: async () => {
    return await ipcRenderer.invoke('get-assets-path')
  },
  getImageBase64: async (filename: string) => ipcRenderer.invoke('get-image-base64', filename),

  windowControl: {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close')
  },

  auth: {
    loginSuccess: () => ipcRenderer.send('login-success'),
    logout: () => ipcRenderer.send('logout')
  },

  exam: {
    enterFullscreen: () => ipcRenderer.send('exam-enter-fullscreen'),
    exitFullscreen: () => ipcRenderer.send('exam-exit-fullscreen'),
    checkIsFullscreen: () => ipcRenderer.invoke('exam-check-fullscreen')
  },

  // Tambahan untuk reload ke login
  reload: {
    toLogin: () => ipcRenderer.send('reload-to-login'),
    restartToLogin: () => ipcRenderer.invoke('restart-to-login')
  },

  getDeviceLabel: () => ipcRenderer.invoke('get-device-label'),

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (_, ...args) => callback(...args))
  }
}

// Gunakan contextBridge
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.electron = electronAPI
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.api = api
}
