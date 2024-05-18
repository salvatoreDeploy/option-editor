export async function getDocuments() {
  const response = await window.api.fetchDocuments()

  return response.data
}
