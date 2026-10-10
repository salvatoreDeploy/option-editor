import { escapeHtml } from './htmlText'

export interface ParsedMarkdown {
  title: string
  content: string
}

const TITLE_HEADING_RE = /^#\s+(.+)$/

/**
 * Converte Markdown bruto pro formato interno do editor (título + HTML do
 * corpo) — caminho inverso de `htmlToMarkdown` (spec 010g-document-export).
 * Cobre só os nós que o editor deste app sabe representar (ver spec
 * 010h-markdown-import, DEC-002): heading, parágrafo, negrito, itálico,
 * tachado, destaque, código inline, bloco de código com linguagem, citação,
 * listas de um nível, divisor e quebra de linha. Não é um parser CommonMark
 * completo.
 */
export function markdownToHtml(
  rawMarkdown: string,
  fallbackTitle: string,
): ParsedMarkdown {
  const lines = rawMarkdown.replace(/\r\n/g, '\n').split('\n')

  const firstNonEmptyIndex = lines.findIndex((line) => line.trim() !== '')
  const firstLine =
    firstNonEmptyIndex >= 0 ? lines[firstNonEmptyIndex].trim() : undefined
  const titleMatch = firstLine ? TITLE_HEADING_RE.exec(firstLine) : null

  const title = titleMatch
    ? titleMatch[1].trim() || fallbackTitle
    : fallbackTitle.trim() || 'Sem título'

  const bodyLines = titleMatch ? lines.slice(firstNonEmptyIndex + 1) : lines

  return { title, content: convertBlocks(bodyLines) }
}

function isBlockStart(line: string): boolean {
  const trimmed = line.trim()

  return (
    /^```/.test(trimmed) ||
    /^#{1,6}\s+/.test(trimmed) ||
    /^(-{3,}|\*{3,}|_{3,})\s*$/.test(trimmed) ||
    /^>\s?/.test(trimmed) ||
    /^[-*+]\s+/.test(trimmed) ||
    /^\d+\.\s+/.test(trimmed)
  )
}

function convertBlocks(lines: string[]): string {
  const blocks: string[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    const trimmed = line.trim()

    if (trimmed === '') {
      index++
      continue
    }

    if (/^```/.test(trimmed)) {
      const language = trimmed.slice(3).trim()
      const codeLines: string[] = []
      index++

      while (index < lines.length && !/^```/.test(lines[index].trim())) {
        codeLines.push(lines[index])
        index++
      }

      index++ // pula a linha de fechamento ```

      blocks.push(
        `<pre><code${language ? ` class="language-${language}"` : ''}>${escapeHtml(
          codeLines.join('\n'),
        )}</code></pre>`,
      )
      continue
    }

    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(trimmed)
    if (headingMatch) {
      const level = headingMatch[1].length
      blocks.push(`<h${level}>${convertInline(headingMatch[2])}</h${level}>`)
      index++
      continue
    }

    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(trimmed)) {
      blocks.push('<hr>')
      index++
      continue
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines: string[] = []

      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ''))
        index++
      }

      blocks.push(
        `<blockquote><p>${convertParagraphLines(quoteLines)}</p></blockquote>`,
      )
      continue
    }

    const isOrderedItem = (candidate: string): boolean =>
      /^\d+\.\s+/.test(candidate.trim())
    const isUnorderedItem = (candidate: string): boolean =>
      /^[-*+]\s+/.test(candidate.trim())

    if (isOrderedItem(trimmed) || isUnorderedItem(trimmed)) {
      const ordered = isOrderedItem(trimmed)
      const itemRe = ordered ? /^\d+\.\s+(.+)$/ : /^[-*+]\s+(.+)$/
      const items: string[] = []

      while (index < lines.length) {
        const itemMatch = itemRe.exec(lines[index].trim())
        if (!itemMatch) break

        items.push(convertInline(itemMatch[1]))
        index++
      }

      const tag = ordered ? 'ol' : 'ul'
      blocks.push(
        `<${tag}>${items.map((item) => `<li>${item}</li>`).join('')}</${tag}>`,
      )
      continue
    }

    const paragraphLines: string[] = []
    while (
      index < lines.length &&
      lines[index].trim() !== '' &&
      (paragraphLines.length === 0 || !isBlockStart(lines[index]))
    ) {
      paragraphLines.push(lines[index])
      index++
    }

    blocks.push(`<p>${convertParagraphLines(paragraphLines)}</p>`)
  }

  return blocks.join('')
}

function convertParagraphLines(lines: string[]): string {
  return lines
    .map((line, i) => {
      const hasHardBreak = /  +$/.test(line) && i < lines.length - 1
      const converted = convertInline(line.trimEnd())
      return hasHardBreak ? `${converted}<br>` : converted
    })
    .join('\n')
}

// Caractere da área de uso privado do Unicode, improvável de aparecer em
// texto real — usado como marcador temporário pra proteger trechos de código
// inline das substituições de negrito/itálico/etc. logo abaixo.
const CODE_SPAN_SENTINEL = ''

function convertInline(rawText: string): string {
  const codeSpans: string[] = []
  let text = escapeHtml(rawText)

  text = text.replace(/`([^`]+)`/g, (_match, code: string) => {
    codeSpans.push(code)
    return `${CODE_SPAN_SENTINEL}${codeSpans.length - 1}${CODE_SPAN_SENTINEL}`
  })

  text = text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/(\*\*|__)([^*_]+)\1/g, '<strong>$2</strong>')
    .replace(/~~([^~]+)~~/g, '<s>$1</s>')
    .replace(/==([^=]+)==/g, '<mark>$1</mark>')
    .replace(/(\*|_)([^*_]+)\1/g, '<em>$2</em>')

  return text.replace(
    new RegExp(`${CODE_SPAN_SENTINEL}(\\d+)${CODE_SPAN_SENTINEL}`, 'g'),
    (_match, i: string) => `<code>${codeSpans[Number(i)]}</code>`,
  )
}
