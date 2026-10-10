import { AuthStatusResponse } from '@shared/types/ipc'

export async function fetchAuthStatus(): Promise<AuthStatusResponse> {
  return window.api.fetchAuthStatus()
}
