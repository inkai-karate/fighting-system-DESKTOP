import { ElectronAPI } from '@electron-toolkit/preload'
import { IDeviceConfigPC } from '@renderer/interface/config.interface'
import { IConfigAsset } from '@renderer/interface/configAsset.interface'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getMyConfig: () => Promise<IConfigAsset>
      getImage: () => Promise<string>
      getImageBase64: (filename: string) => Promise<string>
      windowControl: {
        minimize: () => void
        maximize: () => void
        close: () => void
      }
      auth: {
        loginSuccess: () => void
        logout: () => void
      }
      exam: {
        enterFullscreen: () => void
        exitFullscreen: () => void
        checkIsFullscreen: () => void
      }
      reload: {
        toLogin: () => void
        restartToLogin: () => Promise<boolean>
      }
      getDeviceLabel: () => Promise<IDeviceConfigPC>

      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      on: (channel: string, callback: Function) => void
    }
  }
}
