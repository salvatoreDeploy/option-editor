export async function saveStateDocument(
  id: string,
  title: string,
  content: string | undefined,
) {
  await window.api.saveDocument({ id, title, content })
}
