import { Document } from '@shared/types/ipc'

export async function fetchDocuments(): Promise<Document[]> {
  const response = await window.api.fetchDocuments()

  return response.data
}
