import { Document } from '@shared/types/ipc'
import { stripHtml } from './htmlText'

export interface DocumentSearchResult {
  document: Document
  matchedIn: 'title' | 'content' | 'none'
  excerpt?: string
}

const EXCERPT_CONTEXT_CHARS = 40

function buildExcerpt(
  plainText: string,
  matchIndex: number,
  queryLength: number,
): string {
  const start = Math.max(0, matchIndex - EXCERPT_CONTEXT_CHARS)
  const end = Math.min(
    plainText.length,
    matchIndex + queryLength + EXCERPT_CONTEXT_CHARS,
  )

  const prefix = start > 0 ? '…' : ''
  const suffix = end < plainText.length ? '…' : ''

  return `${prefix}${plainText.slice(start, end).trim()}${suffix}`
}

/**
 * Busca por título e conteúdo (texto plano, sem tags HTML). Não usa o filtro
 * fuzzy do cmdk porque precisamos saber *onde* o match aconteceu (título ou
 * conteúdo) para decidir o que mostrar no subtítulo do resultado — ver spec
 * 010d-content-search.
 */
export function searchDocuments(
  documents: Document[],
  query: string,
): DocumentSearchResult[] {
  const normalizedQuery = query.trim().toLowerCase()

  const results: DocumentSearchResult[] = []

  for (const document of documents) {
    if (!normalizedQuery) {
      results.push({ document, matchedIn: 'none' })
      continue
    }

    const title = document.title.toLowerCase()

    if (title.includes(normalizedQuery)) {
      results.push({ document, matchedIn: 'title' })
      continue
    }

    if (!document.content) continue

    const plainContent = stripHtml(document.content)
    const matchIndex = plainContent.toLowerCase().indexOf(normalizedQuery)

    if (matchIndex >= 0) {
      results.push({
        document,
        matchedIn: 'content',
        excerpt: buildExcerpt(plainContent, matchIndex, normalizedQuery.length),
      })
    }
  }

  const matchRank: Record<DocumentSearchResult['matchedIn'], number> = {
    title: 0,
    content: 1,
    none: 2,
  }

  return results.sort((a, b) => {
    const matchDiff = matchRank[a.matchedIn] - matchRank[b.matchedIn]
    if (matchDiff !== 0) return matchDiff

    return (b.document.updatedAt ?? '').localeCompare(
      a.document.updatedAt ?? '',
    )
  })
}
