import { Document } from '@shared/types/ipc'

export async function createDocument(): Promise<Document> {
  const response = await window.api.createDocument()

  return response.data
}
