export async function deleteDocument(id: string): Promise<void> {
  await window.api.deleteDocument({ id })
}
