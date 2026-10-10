import { ShortcutsConfig } from '@shared/types/ipc'

export async function saveShortcuts(
  shortcuts: ShortcutsConfig,
): Promise<ShortcutsConfig> {
  const response = await window.api.saveShortcuts(shortcuts)

  return response.data
}
