import { ImportMarkdownResponse } from '@shared/types/ipc'

export async function importMarkdown(): Promise<ImportMarkdownResponse> {
  return window.api.importMarkdown()
}
