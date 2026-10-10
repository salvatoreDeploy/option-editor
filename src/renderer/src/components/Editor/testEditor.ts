import { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import StarterKit from '@tiptap/starter-kit'

/**
 * Monta um editor Tiptap real, com o mesmo schema de título usado em
 * produção (`Document.extend({ content: 'heading block*' })`), só pra testes
 * de `parseContent.ts`/`getHeadings.ts` — sem as extensões de UI (code
 * highlight, placeholder, etc.) que não afetam essa lógica.
 */
export function createTestEditor(contentHtml: string): Editor {
  return new Editor({
    extensions: [
      Document.extend({ content: 'heading block*' }),
      StarterKit.configure({ document: false }),
    ],
    content: contentHtml,
  })
}
