import { beforeEach, describe, expect, it, vi } from 'vitest'
import { unlock } from './unlock'
import { mockWindowApi } from './testWindowApi'

describe('unlock', () => {
  const api = mockWindowApi({ unlock: vi.fn() })

  beforeEach(() => {
    api.unlock.mockReset()
  })

  it('envia a senha dentro de um objeto pro IPC', async () => {
    api.unlock.mockResolvedValue({ success: true })

    await unlock('minha-senha')

    expect(api.unlock).toHaveBeenCalledWith({ password: 'minha-senha' })
  })

  it('devolve a resposta completa (success: true/false), sem desembrulhar', async () => {
    api.unlock.mockResolvedValue({ success: false })

    await expect(unlock('errada')).resolves.toEqual({ success: false })
  })
})
