import { Document } from '@shared/types/ipc'

export async function toggleFavoriteDocument(id: string): Promise<Document> {
  const response = await window.api.toggleFavoriteDocument({ id })

  return response.data
}
