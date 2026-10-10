import { FetchActivityResponse } from '@shared/types/ipc'

export async function fetchActivity(): Promise<FetchActivityResponse> {
  return window.api.fetchActivity()
}
