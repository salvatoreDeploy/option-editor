import { describe, expect, it } from 'vitest'
import { htmlToMarkdown } from './htmlToMarkdown'

describe('htmlToMarkdown', () => {
  it('converte headings', () => {
    expect(htmlToMarkdown('<h1>Título</h1>')).toBe('# Título\n')
    expect(htmlToMarkdown('<h2>Sub</h2>')).toBe('## Sub\n')
  })

  it('converte parágrafo', () => {
    expect(htmlToMarkdown('<p>Texto simples.</p>')).toBe('Texto simples.\n')
  })

  it('converte negrito, itálico, tachado e destaque', () => {
    expect(htmlToMarkdown('<p><strong>a</strong></p>')).toBe('**a**\n')
    expect(htmlToMarkdown('<p><em>a</em></p>')).toBe('*a*\n')
    expect(htmlToMarkdown('<p><s>a</s></p>')).toBe('~~a~~\n')
    expect(htmlToMarkdown('<p><mark>a</mark></p>')).toBe('==a==\n')
  })

  it('converte código inline e bloco de código com linguagem', () => {
    expect(htmlToMarkdown('<p><code>x</code></p>')).toBe('`x`\n')

    const result = htmlToMarkdown(
      '<pre><code class="language-ts">const x = 1</code></pre>',
    )
    expect(result).toBe('```ts\nconst x = 1\n```\n')
  })

  it('converte citação', () => {
    expect(htmlToMarkdown('<blockquote>uma citação</blockquote>')).toBe(
      '> uma citação\n',
    )
  })

  it('converte listas não ordenada e ordenada', () => {
    expect(htmlToMarkdown('<ul><li>um</li><li>dois</li></ul>')).toBe(
      '- um\n- dois\n',
    )
    expect(htmlToMarkdown('<ol><li>um</li><li>dois</li></ol>')).toBe(
      '1. um\n2. dois\n',
    )
  })

  it('converte divisor horizontal', () => {
    expect(htmlToMarkdown('<hr>')).toBe('---\n')
  })

  it('converte link', () => {
    expect(htmlToMarkdown('<p><a href="https://x.com">x</a></p>')).toBe(
      '[x](https://x.com)\n',
    )
  })
})
