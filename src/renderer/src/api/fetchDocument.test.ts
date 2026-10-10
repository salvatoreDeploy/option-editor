import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchDocument } from './fetchDocument'
import { mockWindowApi } from './testWindowApi'

describe('fetchDocument', () => {
  const api = mockWindowApi({ fetchDocument: vi.fn() })

  beforeEach(() => {
    api.fetchDocument.mockReset()
  })

  it('chama o IPC com o id pedido', async () => {
    api.fetchDocument.mockResolvedValue({ data: undefined })

    await fetchDocument('doc-1')

    expect(api.fetchDocument).toHaveBeenCalledWith({ id: 'doc-1' })
  })

  it('devolve undefined quando o documento não existe', async () => {
    api.fetchDocument.mockResolvedValue({ data: undefined })

    await expect(fetchDocument('doc-1')).resolves.toBeUndefined()
  })

  it('devolve o documento quando existe', async () => {
    const document = { id: '1', title: 'Doc' }
    api.fetchDocument.mockResolvedValue({ data: document })

    await expect(fetchDocument('1')).resolves.toBe(document)
  })
})
