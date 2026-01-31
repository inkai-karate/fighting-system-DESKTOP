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
      sendToScoring: (data: unknown) => void
      onMessageFromMain: (callback: (data: unknown) => void) => void

      windowControl: {
        minimize: () => void
        maximize: () => void
        close: () => void
      }

      sendToMain: (data: unknown) => void
      removeMessageListener: () => void
      auth: {
        loginSuccess: () => void
        logout: () => void
      }
      reload: {
        toLogin: () => void
        restartToLogin: () => Promise<boolean>
      }
      getDeviceLabel: () => Promise<IDeviceConfigPC>
      screen: {
        getSize: () => Promise<{
          width: number
          height: number
        }>

        getDisplayInfo: () => Promise<{
          primary: {
            width: number
            height: number
          }
          all: Array<{
            id: number
            bounds: {
              x: number
              y: number
              width: number
              height: number
            }
            workArea: {
              width: number
              height: number
            }
            scaleFactor: number
          }>
        }>

        onSizeChanged: (callback: (size: { width: number; height: number }) => void) => void
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      on: (channel: string, callback: Function) => void
    }
  }
}
