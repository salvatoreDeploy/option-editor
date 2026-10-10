import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchDocuments } from './fetchDocuments'
import { mockWindowApi } from './testWindowApi'

describe('fetchDocuments', () => {
  const api = mockWindowApi({ fetchDocuments: vi.fn() })

  beforeEach(() => {
    api.fetchDocuments.mockReset()
  })

  it('devolve a lista de documentos, sem o wrapper { data }', async () => {
    const documents = [
      { id: '1', title: 'A' },
      { id: '2', title: 'B' },
    ]
    api.fetchDocuments.mockResolvedValue({ data: documents })

    await expect(fetchDocuments()).resolves.toBe(documents)
  })
})
