import { getHTMLFromFragment } from '@tiptap/core'
import type { Node as ProseMirrorNode, Schema } from '@tiptap/pm/model'

export interface ParsedEditorContent {
  title: string
  content: string
}

export const EMPTY_TITLE_FALLBACK = 'Sem título'

/**
 * Extrai título e conteúdo a partir do doc do ProseMirror, em vez de parsear
 * o HTML serializado por regex. O primeiro nó do doc é sempre um `heading`,
 * garantido pelo schema `Document.extend({ content: 'heading block*' })` —
 * ver spec 008-editor-refactor.
 */
export function parseEditorContent(
  doc: ProseMirrorNode,
  schema: Schema,
): ParsedEditorContent {
  const heading = doc.firstChild

  const title = heading?.textContent.trim() || EMPTY_TITLE_FALLBACK

  const contentFragment = heading
    ? doc.content.cut(heading.nodeSize)
    : doc.content

  const content = getHTMLFromFragment(contentFragment, schema)

  return { title, content }
}
