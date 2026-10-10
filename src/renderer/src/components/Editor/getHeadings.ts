import type { Node as ProseMirrorNode } from '@tiptap/pm/model'

export interface HeadingItem {
  pos: number
  level: number
  text: string
}

/**
 * Lista os headings do corpo do documento, para o ToC. O primeiro nó do doc
 * (pos 0) é sempre o heading de título — não entra na lista, só os headings
 * que aparecem depois, dentro do corpo (o schema `heading block*` permite
 * isso, já que `heading` pertence ao grupo `block`).
 */
export function getHeadings(doc: ProseMirrorNode): HeadingItem[] {
  const headings: HeadingItem[] = []

  doc.descendants((node, pos) => {
    if (pos === 0) return true

    if (node.type.name === 'heading') {
      const text = node.textContent.trim()

      if (text) {
        headings.push({ pos, level: node.attrs.level ?? 1, text })
      }
    }

    return true
  })

  return headings
}

export function countWords(doc: ProseMirrorNode): number {
  // `doc.textContent` concatena o texto de blocos diferentes sem separador
  // (ex. "Dois" + "Três" vira "DoisTrês"), subcontando palavras na fronteira
  // entre blocos. `textBetween` com separador de bloco evita isso.
  const text = doc.textBetween(0, doc.content.size, ' ').trim()

  if (!text) return 0

  return text.split(/\s+/).length
}
