import { FetchSettingsResponse } from '@shared/types/ipc'

export async function fetchSettings(): Promise<FetchSettingsResponse> {
  return window.api.fetchSettings()
}
