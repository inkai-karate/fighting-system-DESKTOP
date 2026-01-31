import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  getMyConfig: async () => {
    return await ipcRenderer.invoke('get-my-config')
  },

  getImage: async () => {
    return await ipcRenderer.invoke('get-assets-path')
  },

  getImageBase64: async (filename: string) => ipcRenderer.invoke('get-image-base64', filename),

  sendToScoring: (data: unknown) => ipcRenderer.send('send-message-to-scoring', data),
  onMessageFromMain: (callback: (data: unknown) => void) => {
    ipcRenderer.on('main-to-scoring', (_, data) => callback(data))
  },
  sendToMain: (data: unknown) => ipcRenderer.send('scoring-to-main', data),
  removeMessageListener: () => {
    ipcRenderer.removeAllListeners('main-to-scoring')
  },

  windowControl: {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close')
  },

  auth: {
    loginSuccess: () => ipcRenderer.send('login-success'),
    logout: () => ipcRenderer.send('logout')
  },

  reload: {
    toLogin: () => ipcRenderer.send('reload-to-login'),
    restartToLogin: () => ipcRenderer.invoke('restart-to-login')
  },

  screen: {
    getSize: () => ipcRenderer.invoke('get-screen-size'),
    getDisplayInfo: () => ipcRenderer.invoke('get-display-info'),
    onSizeChanged: (callback: (size: { width: number; height: number }) => void) => {
      ipcRenderer.on('screen-size-changed', (_, size) => callback(size))
    }
  },

  getDeviceLabel: () => ipcRenderer.invoke('get-device-label'),

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (_, ...args) => callback(...args))
  }
}

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
