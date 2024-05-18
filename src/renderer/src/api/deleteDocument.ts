export async function deleteDocument(id: string) {
  await window.api.deleteDocument({ id })
}
