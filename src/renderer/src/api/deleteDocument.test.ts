import { beforeEach, describe, expect, it, vi } from 'vitest'
import { deleteDocument } from './deleteDocument'
import { mockWindowApi } from './testWindowApi'

describe('deleteDocument', () => {
  const api = mockWindowApi({ deleteDocument: vi.fn() })

  beforeEach(() => {
    api.deleteDocument.mockReset().mockResolvedValue(undefined)
  })

  it('chama o IPC com o id e não devolve nada', async () => {
    await expect(deleteDocument('doc-1')).resolves.toBeUndefined()

    expect(api.deleteDocument).toHaveBeenCalledWith({ id: 'doc-1' })
  })
})
