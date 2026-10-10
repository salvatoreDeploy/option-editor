import { Document } from '@shared/types/ipc'

export async function saveDocument(
  id: string,
  title: string,
  content: string | undefined,
): Promise<Document> {
  const response = await window.api.saveDocument({ id, title, content })

  return response.data
}
