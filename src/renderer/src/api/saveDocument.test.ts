import { beforeEach, describe, expect, it, vi } from 'vitest'
import { saveDocument } from './saveDocument'
import { mockWindowApi } from './testWindowApi'

describe('saveDocument', () => {
  const api = mockWindowApi({ saveDocument: vi.fn() })

  beforeEach(() => {
    api.saveDocument.mockReset()
  })

  it('envia id, título e conteúdo pro IPC', async () => {
    api.saveDocument.mockResolvedValue({
      data: { id: '1', title: 'T', content: 'C' },
    })

    await saveDocument('1', 'T', 'C')

    expect(api.saveDocument).toHaveBeenCalledWith({
      id: '1',
      title: 'T',
      content: 'C',
    })
  })

  it('aceita conteúdo undefined', async () => {
    api.saveDocument.mockResolvedValue({ data: { id: '1', title: 'T' } })

    await saveDocument('1', 'T', undefined)

    expect(api.saveDocument).toHaveBeenCalledWith({
      id: '1',
      title: 'T',
      content: undefined,
    })
  })

  it('devolve o documento salvo', async () => {
    const saved = { id: '1', title: 'T', content: 'C' }
    api.saveDocument.mockResolvedValue({ data: saved })

    await expect(saveDocument('1', 'T', 'C')).resolves.toBe(saved)
  })
})
