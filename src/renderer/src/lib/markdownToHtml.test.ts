import { describe, expect, it } from 'vitest'
import { markdownToHtml } from './markdownToHtml'

describe('markdownToHtml', () => {
  it('extrai o título de um heading de nível 1 na primeira linha', () => {
    const result = markdownToHtml(
      '# Meu Documento\n\nConteúdo aqui.',
      'arquivo',
    )

    expect(result.title).toBe('Meu Documento')
    expect(result.content).not.toContain('Meu Documento')
  })

  it('usa o nome do arquivo como título quando não há heading', () => {
    const result = markdownToHtml('Só um parágrafo solto.', 'minhas-notas')

    expect(result.title).toBe('minhas-notas')
  })

  it('converte negrito, itálico, tachado e destaque', () => {
    const result = markdownToHtml(
      '# T\n\n**negrito** *itálico* ~~tachado~~ ==destaque==',
      'x',
    )

    expect(result.content).toContain('<strong>negrito</strong>')
    expect(result.content).toContain('<em>itálico</em>')
    expect(result.content).toContain('<s>tachado</s>')
    expect(result.content).toContain('<mark>destaque</mark>')
  })

  it('converte código inline e link', () => {
    const result = markdownToHtml(
      '# T\n\nUse `npm install` e veja [docs](https://example.com).',
      'x',
    )

    expect(result.content).toContain('<code>npm install</code>')
    expect(result.content).toContain('<a href="https://example.com">docs</a>')
  })

  it('converte bloco de código com linguagem', () => {
    const result = markdownToHtml('# T\n\n```ts\nconst x = 1\n```', 'x')

    expect(result.content).toBe(
      '<pre><code class="language-ts">const x = 1</code></pre>',
    )
  })

  it('converte heading de nível 2 dentro do corpo', () => {
    const result = markdownToHtml('# T\n\n## Subtítulo', 'x')

    expect(result.content).toContain('<h2>Subtítulo</h2>')
  })

  it('converte citação', () => {
    const result = markdownToHtml('# T\n\n> uma citação', 'x')

    expect(result.content).toBe('<blockquote><p>uma citação</p></blockquote>')
  })

  it('converte lista não ordenada e ordenada', () => {
    const unordered = markdownToHtml('# T\n\n- um\n- dois', 'x')
    expect(unordered.content).toBe('<ul><li>um</li><li>dois</li></ul>')

    const ordered = markdownToHtml('# T\n\n1. um\n2. dois', 'x')
    expect(ordered.content).toBe('<ol><li>um</li><li>dois</li></ol>')
  })

  it('converte divisor horizontal', () => {
    const result = markdownToHtml('# T\n\n---', 'x')

    expect(result.content).toBe('<hr>')
  })

  it('converte quebra de linha forte (dois espaços no fim da linha)', () => {
    const result = markdownToHtml('# T\n\nLinha um  \nLinha dois', 'x')

    expect(result.content).toBe('<p>Linha um<br>\nLinha dois</p>')
  })

  it('lida com blocos colados sem linha em branco entre eles', () => {
    const result = markdownToHtml(
      '# T\n\nTexto solto\n## Heading colado\n- item colado',
      'x',
    )

    expect(result.content).toBe(
      '<p>Texto solto</p><h2>Heading colado</h2><ul><li>item colado</li></ul>',
    )
  })

  it('escapa HTML dentro de blocos de código', () => {
    const result = markdownToHtml('# T\n\n```html\n<div>oi</div>\n```', 'x')

    expect(result.content).toBe(
      '<pre><code class="language-html">&lt;div&gt;oi&lt;/div&gt;</code></pre>',
    )
  })
})
