import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setPassword } from './setPassword'
import { mockWindowApi } from './testWindowApi'

describe('setPassword', () => {
  const api = mockWindowApi({ setPassword: vi.fn() })

  beforeEach(() => {
    api.setPassword.mockReset().mockResolvedValue(undefined)
  })

  it('envia a senha dentro de um objeto pro IPC', async () => {
    await setPassword('nova-senha')

    expect(api.setPassword).toHaveBeenCalledWith({ password: 'nova-senha' })
  })
})
