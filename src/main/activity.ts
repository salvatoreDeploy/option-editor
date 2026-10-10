import { randomUUID } from 'crypto'
import { ipcMain } from 'electron'
import { IPC } from '../shared/constants/ipc'
import { ActivityAction, FetchActivityResponse } from '../shared/types/ipc'
import { store } from './store'

const MAX_ACTIVITY_ENTRIES = 20

/**
 * Registra uma ação no feed de atividade do Perfil (spec 010j-local-profile).
 * Lista capada — mantém só as entradas mais recentes (RISK-003).
 */
export function pushActivity(
  action: ActivityAction,
  documentTitle: string,
): void {
  const current = store.get('activity')

  store.set(
    'activity',
    [
      {
        id: randomUUID(),
        action,
        documentTitle,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ].slice(0, MAX_ACTIVITY_ENTRIES),
  )
}

export function createActivityHandlers() {
  ipcMain.handle(
    IPC.ACTIVITY.FETCH,
    async (): Promise<FetchActivityResponse> => {
      return { data: store.get('activity') }
    },
  )
}
