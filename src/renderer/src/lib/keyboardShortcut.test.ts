import { describe, expect, it } from 'vitest'
import {
  captureAccelerator,
  formatAcceleratorForDisplay,
  matchesAccelerator,
} from './keyboardShortcut'

function keydown(init: KeyboardEventInit): KeyboardEvent {
  return new KeyboardEvent('keydown', init)
}

describe('captureAccelerator', () => {
  it('ignora teclas sem modificador', () => {
    expect(captureAccelerator(keydown({ key: 'k' }))).toBeNull()
  })

  it('ignora apertar só o modificador', () => {
    expect(captureAccelerator(keydown({ key: 'Control' }))).toBeNull()
  })

  it('captura Ctrl/Cmd + letra como CommandOrControl', () => {
    expect(captureAccelerator(keydown({ key: 'k', ctrlKey: true }))).toBe(
      'CommandOrControl+K',
    )
  })

  it('captura Meta (Cmd) também como CommandOrControl', () => {
    expect(captureAccelerator(keydown({ key: 's', metaKey: true }))).toBe(
      'CommandOrControl+S',
    )
  })

  it('combina múltiplos modificadores na ordem Ctrl, Alt, Shift', () => {
    expect(
      captureAccelerator(
        keydown({ key: 'p', ctrlKey: true, altKey: true, shiftKey: true }),
      ),
    ).toBe('CommandOrControl+Alt+Shift+P')
  })

  it('preserva teclas de um caractere só em maiúscula', () => {
    expect(captureAccelerator(keydown({ key: '1', ctrlKey: true }))).toBe(
      'CommandOrControl+1',
    )
  })

  it('preserva nomes de tecla com mais de um caractere como estão', () => {
    expect(captureAccelerator(keydown({ key: 'Escape', ctrlKey: true }))).toBe(
      'CommandOrControl+Escape',
    )
  })
})

describe('formatAcceleratorForDisplay', () => {
  it('troca CommandOrControl por Ctrl fora do macOS', () => {
    expect(formatAcceleratorForDisplay('CommandOrControl+K')).toBe('Ctrl+K')
  })
})

describe('matchesAccelerator', () => {
  it('bate quando modificadores e tecla coincidem', () => {
    expect(
      matchesAccelerator(
        keydown({ key: 'k', ctrlKey: true }),
        'CommandOrControl+K',
      ),
    ).toBe(true)
  })

  it('não bate se faltar um modificador', () => {
    expect(
      matchesAccelerator(keydown({ key: 'k' }), 'CommandOrControl+K'),
    ).toBe(false)
  })

  it('não bate se a tecla for diferente', () => {
    expect(
      matchesAccelerator(
        keydown({ key: 'j', ctrlKey: true }),
        'CommandOrControl+K',
      ),
    ).toBe(false)
  })

  it('exige Alt/Shift quando o accelerator pede', () => {
    const accelerator = 'CommandOrControl+Alt+Shift+P'

    expect(
      matchesAccelerator(
        keydown({ key: 'p', ctrlKey: true, altKey: true, shiftKey: true }),
        accelerator,
      ),
    ).toBe(true)

    expect(
      matchesAccelerator(
        keydown({ key: 'p', ctrlKey: true, altKey: true }),
        accelerator,
      ),
    ).toBe(false)
  })
})
