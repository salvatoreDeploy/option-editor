import { ElectronAPI } from '@electron-toolkit/preload'
import { PreloadApi } from './index'

declare global {
  interface Window {
    electron: ElectronAPI
    api: PreloadApi
  }
}
