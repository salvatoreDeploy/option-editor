import { UnlockResponse } from '@shared/types/ipc'

export async function unlock(password: string): Promise<UnlockResponse> {
  return window.api.unlock({ password })
}
