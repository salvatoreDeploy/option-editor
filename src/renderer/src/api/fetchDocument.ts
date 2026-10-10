import { Document } from '@shared/types/ipc'

export async function fetchDocument(id: string): Promise<Document | undefined> {
  const response = await window.api.fetchDocument({ id })

  return response.data
}
