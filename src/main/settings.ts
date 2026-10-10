import { BrowserWindow, ipcMain, shell } from 'electron'
import { dirname } from 'path'
import { IPC } from '../shared/constants/ipc'
import {
  AppSettings,
  FetchSettingsResponse,
  SaveSettingsRequest,
  SaveSettingsResponse,
} from '../shared/types/ipc'
import { store } from './store'

const SETTINGS_DEFAULTS: AppSettings = {
  workspaceName: 'Workspace local',
  autosaveEnabled: true,
  spellCheckEnabled: true,
}

/**
 * `electron-store`/`conf` não faz merge profundo de defaults novos dentro de
 * um objeto já persistido — quem já tinha `settings` salvo antes de
 * `autosaveEnabled`/`spellCheckEnabled` existirem (spec 010i, revisão
 * 2026-10-06) ficaria com esses campos `undefined`. Preenche o que faltar.
 */
function readSettings(): AppSettings {
  return { ...SETTINGS_DEFAULTS, ...store.get('settings') }
}

/**
 * Handlers de configurações do app. Precisam da `window` (diferente dos
 * handlers de documentos/atalhos em `ipc.ts`) porque ligar/desligar o
 * corretor ortográfico é uma propriedade da `session` do `webContents` da
 * janela (não do `webContents` diretamente, nem do `electron-store`) — ver
 * spec 010i-app-settings, revisão 2026-10-06.
 */
export function createSettingsHandlers(window: BrowserWindow) {
  window.webContents.session.setSpellCheckerEnabled(
    readSettings().spellCheckEnabled,
  )

  ipcMain.handle(
    IPC.SETTINGS.FETCH,
    async (): Promise<FetchSettingsResponse> => {
      return {
        data: readSettings(),
        dataFolderPath: dirname(store.path),
      }
    },
  )

  ipcMain.handle(
    IPC.SETTINGS.SAVE,
    async (
      _event,
      settings: SaveSettingsRequest,
    ): Promise<SaveSettingsResponse> => {
      const normalized: AppSettings = {
        ...settings,
        workspaceName: settings.workspaceName.trim() || 'Workspace local',
      }

      store.set('settings', normalized)
      window.webContents.session.setSpellCheckerEnabled(
        normalized.spellCheckEnabled,
      )

      return {
        data: normalized,
      }
    },
  )

  ipcMain.handle(IPC.SETTINGS.OPEN_DATA_FOLDER, async (): Promise<void> => {
    shell.showItemInFolder(store.path)
  })
}
