import { htmlToMarkdown } from './htmlToMarkdown'
import { stripHtml } from './htmlText'

/**
 * Monta um HTML autocontido (sem dependências externas) a partir do título e
 * do corpo do documento. Usado tanto para exportar `.html` quanto como a
 * página carregada na janela oculta que gera o `.pdf` — ver spec
 * 010g-document-export, DEC-002.
 */
export function buildHtmlDocument(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>${escapeHtml(title)}</title>
    <style>
      body {
        margin: 0;
        padding: 48px;
        background: rgb(255 255 255);
        color: rgb(9 9 11);
        font-family:
          -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
          Arial, sans-serif;
        line-height: 1.6;
      }
      article {
        max-width: 65ch;
        margin: 0 auto;
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        line-height: 1.3;
        margin-top: 1.6em;
        margin-bottom: 0.4em;
      }
      h1:first-child {
        margin-top: 0;
      }
      p {
        margin: 0.8em 0;
      }
      blockquote {
        margin: 0.8em 0;
        padding-left: 1em;
        border-left: 3px solid rgb(228 228 231);
        color: rgb(113 113 122);
      }
      pre {
        background: rgb(244 244 245);
        border-radius: 6px;
        padding: 12px 16px;
        overflow-x: auto;
      }
      code {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 0.9em;
      }
      pre code {
        background: none;
        padding: 0;
      }
      :not(pre) > code {
        background: rgb(244 244 245);
        border-radius: 4px;
        padding: 0.15em 0.4em;
      }
      mark {
        background: rgb(253 224 71);
        color: inherit;
      }
      hr {
        border: none;
        border-top: 1px solid rgb(228 228 231);
        margin: 2em 0;
      }
      a {
        color: rgb(24 24 27);
      }
    </style>
  </head>
  <body>
    <article>
      <h1>${escapeHtml(title)}</h1>
      ${content}
    </article>
  </body>
</html>
`
}

export function buildMarkdownDocument(title: string, content: string): string {
  return `# ${title}\n\n${htmlToMarkdown(content)}`
}

export function buildPlainTextDocument(title: string, content: string): string {
  return `${title}\n\n${stripHtml(content).trim()}\n`
}

/**
 * Nome de arquivo seguro a partir do título do documento: remove caracteres
 * inválidos em Windows/macOS/Linux e colapsa espaços — ver spec
 * 010g-document-export, DEC-006.
 */
export function sanitizeFileName(title: string): string {
  const sanitized = title
    .trim()
    .replace(/[/\\?%*:|"<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  return sanitized || 'Sem título'
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
