import { AppSettings } from '@shared/types/ipc'

export async function saveSettings(
  settings: AppSettings,
): Promise<AppSettings> {
  const response = await window.api.saveSettings(settings)

  return response.data
}
