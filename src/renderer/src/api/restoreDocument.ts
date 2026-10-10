import { Document } from '@shared/types/ipc'

export async function restoreDocument(id: string): Promise<Document> {
  const response = await window.api.restoreDocument({ id })

  return response.data
}
