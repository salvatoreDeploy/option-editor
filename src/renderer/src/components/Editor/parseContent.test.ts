import { describe, expect, it } from 'vitest'
import { EMPTY_TITLE_FALLBACK, parseEditorContent } from './parseContent'
import { createTestEditor } from './testEditor'

describe('parseEditorContent', () => {
  it('extrai o título do heading (primeiro nó) e o resto como conteúdo', () => {
    const editor = createTestEditor('<h1>Meu título</h1><p>Corpo do texto</p>')

    const { title, content } = parseEditorContent(
      editor.state.doc,
      editor.schema,
    )

    expect(title).toBe('Meu título')
    expect(content).toContain('Corpo do texto')
    expect(content).not.toContain('Meu título')

    editor.destroy()
  })

  it('usa o fallback quando o título está vazio', () => {
    const editor = createTestEditor('<h1></h1><p>Corpo</p>')

    const { title } = parseEditorContent(editor.state.doc, editor.schema)

    expect(title).toBe(EMPTY_TITLE_FALLBACK)

    editor.destroy()
  })

  it('não quebra com HTML inesperado no título (tags são ignoradas, só o texto conta)', () => {
    const editor = createTestEditor(
      '<h1>Título com <strong>negrito</strong></h1><p>Corpo</p>',
    )

    const { title } = parseEditorContent(editor.state.doc, editor.schema)

    expect(title).toBe('Título com negrito')

    editor.destroy()
  })
})
