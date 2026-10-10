import { beforeEach, describe, expect, it, vi } from 'vitest'
import { clearAllDocuments } from './clearAllDocuments'
import { mockWindowApi } from './testWindowApi'

describe('clearAllDocuments', () => {
  const api = mockWindowApi({ clearAllDocuments: vi.fn() })

  beforeEach(() => {
    api.clearAllDocuments.mockReset().mockResolvedValue(undefined)
  })

  it('chama o IPC sem argumentos', async () => {
    await clearAllDocuments()

    expect(api.clearAllDocuments).toHaveBeenCalledWith()
  })
})
