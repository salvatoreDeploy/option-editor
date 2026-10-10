import { describe, expect, it } from 'vitest'
import { countWords, getHeadings } from './getHeadings'
import { createTestEditor } from './testEditor'

describe('getHeadings', () => {
  it('não inclui o heading de título (primeiro nó)', () => {
    const editor = createTestEditor('<h1>Título</h1><p>Corpo</p>')

    const headings = getHeadings(editor.state.doc)

    expect(headings).toHaveLength(0)

    editor.destroy()
  })

  it('lista headings do corpo, com nível e texto', () => {
    const editor = createTestEditor(
      '<h1>Título</h1><h2>Seção um</h2><p>Texto</p><h3>Seção dois</h3>',
    )

    const headings = getHeadings(editor.state.doc)

    expect(headings.map((heading) => heading.text)).toEqual([
      'Seção um',
      'Seção dois',
    ])
    expect(headings.map((heading) => heading.level)).toEqual([2, 3])

    editor.destroy()
  })

  it('ignora headings vazios', () => {
    const editor = createTestEditor('<h1>Título</h1><h2></h2><p>Texto</p>')

    const headings = getHeadings(editor.state.doc)

    expect(headings).toHaveLength(0)

    editor.destroy()
  })
})

describe('countWords', () => {
  it('conta zero palavras pra documento vazio', () => {
    const editor = createTestEditor('<h1></h1><p></p>')

    expect(countWords(editor.state.doc)).toBe(0)

    editor.destroy()
  })

  it('conta palavras do título e do corpo', () => {
    const editor = createTestEditor('<h1>Um Dois</h1><p>Três quatro cinco</p>')

    expect(countWords(editor.state.doc)).toBe(5)

    editor.destroy()
  })
})
