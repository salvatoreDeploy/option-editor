export async function fetchDocument(id: string) {
  const response = await window.api.fetchDocument({ id })

  return response.data
}
