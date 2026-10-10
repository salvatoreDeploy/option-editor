import { Document } from '@shared/types/ipc'

export async function renameDocument(
  id: string,
  title: string,
): Promise<Document> {
  const response = await window.api.renameDocument({ id, title })

  return response.data
}
