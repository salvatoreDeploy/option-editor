import { ShortcutsConfig } from '@shared/types/ipc'

export async function fetchShortcuts(): Promise<ShortcutsConfig> {
  const response = await window.api.fetchShortcuts()

  return response.data
}
