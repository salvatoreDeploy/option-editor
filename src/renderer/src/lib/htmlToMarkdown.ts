/**
 * Converte o HTML produzido pelo editor deste app (schema fechado, ver
 * `Editor/index.tsx`) para Markdown. Não é um conversor HTML→Markdown
 * genérico — só precisa cobrir as tags que o Tiptap deste app realmente gera
 * (heading, parágrafo, negrito, itálico, tachado, código, bloco de código,
 * citação, listas, divisor, quebra de linha, destaque) — ver spec
 * 010g-document-export.
 */
export function htmlToMarkdown(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')

  return `${convertChildren(doc.body).trim()}\n`
}

function convertChildren(node: ParentNode): string {
  return Array.from(node.childNodes).map(convertNode).join('')
}

function convertNode(node: ChildNode): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? ''
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return ''

  const element = node as HTMLElement
  const tag = element.tagName.toLowerCase()
  const inner = convertChildren(element)

  switch (tag) {
    case 'h1':
      return `# ${inner.trim()}\n\n`
    case 'h2':
      return `## ${inner.trim()}\n\n`
    case 'h3':
      return `### ${inner.trim()}\n\n`
    case 'h4':
      return `#### ${inner.trim()}\n\n`
    case 'h5':
      return `##### ${inner.trim()}\n\n`
    case 'h6':
      return `###### ${inner.trim()}\n\n`
    case 'p':
      return inner.trim() ? `${inner.trim()}\n\n` : ''
    case 'strong':
    case 'b':
      return `**${inner}**`
    case 'em':
    case 'i':
      return `*${inner}*`
    case 's':
    case 'strike':
    case 'del':
      return `~~${inner}~~`
    case 'mark':
      return `==${inner}==`
    case 'code':
      return `\`${inner}\``
    case 'br':
      return '  \n'
    case 'hr':
      return '---\n\n'
    case 'a': {
      const href = element.getAttribute('href') ?? ''
      return `[${inner}](${href})`
    }
    case 'blockquote': {
      const text = inner.replace(/\n{2,}/g, '\n').trim()
      return `${text
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n')}\n\n`
    }
    case 'pre': {
      const codeElement = element.querySelector('code')
      const language = codeElement?.className.match(/language-(\w+)/)?.[1] ?? ''
      const codeText = codeElement?.textContent ?? element.textContent ?? ''
      return `\`\`\`${language}\n${codeText}\n\`\`\`\n\n`
    }
    case 'ul':
      return `${convertList(element, false)}\n`
    case 'ol':
      return `${convertList(element, true)}\n`
    default:
      return inner
  }
}

function convertList(listElement: HTMLElement, ordered: boolean): string {
  const items = Array.from(listElement.children).filter(
    (child) => child.tagName.toLowerCase() === 'li',
  )

  return items
    .map((item, index) => {
      const marker = ordered ? `${index + 1}.` : '-'
      const text = convertChildren(item)
        .replace(/\n{2,}/g, ' ')
        .trim()
      return `${marker} ${text}`
    })
    .join('\n')
}
