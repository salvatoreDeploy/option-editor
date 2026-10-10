import { Document } from '@shared/types/ipc'

export async function duplicateDocument(id: string): Promise<Document> {
  const response = await window.api.duplicateDocument({ id })

  return response.data
}
