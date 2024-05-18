export async function createDocument() {
  const response = await window.api.createDocument()

  return response.data
}
