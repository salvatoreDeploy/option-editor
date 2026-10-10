import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createDocument } from './createDocument'
import { mockWindowApi } from './testWindowApi'

describe('createDocument', () => {
  const api = mockWindowApi({ createDocument: vi.fn() })

  beforeEach(() => {
    api.createDocument.mockReset()
  })

  it('devolve o documento criado, sem o wrapper { data }', async () => {
    const document = { id: '1', title: 'Sem título' }
    api.createDocument.mockResolvedValue({ data: document })

    await expect(createDocument()).resolves.toBe(document)
  })
})
