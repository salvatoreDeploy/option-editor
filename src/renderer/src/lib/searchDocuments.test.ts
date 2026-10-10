import { describe, expect, it } from 'vitest'
import { Document } from '@shared/types/ipc'
import { searchDocuments } from './searchDocuments'

function doc(partial: Partial<Document> & { id: string }): Document {
  return { title: 'Sem título', ...partial }
}

describe('searchDocuments', () => {
  it('sem busca, devolve todos os documentos como "none"', () => {
    const documents = [
      doc({ id: '1', title: 'A' }),
      doc({ id: '2', title: 'B' }),
    ]

    const results = searchDocuments(documents, '')

    expect(results).toHaveLength(2)
    expect(results.every((result) => result.matchedIn === 'none')).toBe(true)
  })

  it('encontra por título, sem diferenciar maiúsculas/minúsculas', () => {
    const documents = [doc({ id: '1', title: 'Roadmap do Produto' })]

    const results = searchDocuments(documents, 'ROADMAP')

    expect(results).toHaveLength(1)
    expect(results[0].matchedIn).toBe('title')
  })

  it('encontra por conteúdo quando o título não bate', () => {
    const documents = [
      doc({
        id: '1',
        title: 'Notas',
        content: '<p>fala sobre arquitetura</p>',
      }),
    ]

    const results = searchDocuments(documents, 'arquitetura')

    expect(results).toHaveLength(1)
    expect(results[0].matchedIn).toBe('content')
    expect(results[0].excerpt).toContain('arquitetura')
  })

  it('não inclui documentos sem match nem no título nem no conteúdo', () => {
    const documents = [
      doc({ id: '1', title: 'Notas', content: '<p>texto qualquer</p>' }),
    ]

    const results = searchDocuments(documents, 'inexistente')

    expect(results).toHaveLength(0)
  })

  it('prioriza match de título sobre match de conteúdo', () => {
    const documents = [
      doc({ id: '1', title: 'Sem relação', content: '<p>editor</p>' }),
      doc({ id: '2', title: 'Editor de texto' }),
    ]

    const results = searchDocuments(documents, 'editor')

    expect(results[0].matchedIn).toBe('title')
    expect(results[0].document.id).toBe('2')
  })

  it('desempata por updatedAt mais recente primeiro', () => {
    const documents = [
      doc({ id: '1', title: 'Doc A', updatedAt: '2026-01-01T00:00:00.000Z' }),
      doc({ id: '2', title: 'Doc B', updatedAt: '2026-06-01T00:00:00.000Z' }),
    ]

    const results = searchDocuments(documents, 'doc')

    expect(results[0].document.id).toBe('2')
    expect(results[1].document.id).toBe('1')
  })
})
