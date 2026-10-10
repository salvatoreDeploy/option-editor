const MODIFIER_KEYS = new Set(['Control', 'Meta', 'Alt', 'Shift'])

/**
 * Converte um keydown em uma string no formato Accelerator do Electron
 * (ex. "CommandOrControl+1"). Retorna `null` se a tecla pressionada não tem
 * nenhum modificador — atalho sem modificador colidiria com digitação normal.
 */
export function captureAccelerator(event: KeyboardEvent): string | null {
  if (MODIFIER_KEYS.has(event.key)) return null

  const parts: string[] = []

  if (event.ctrlKey || event.metaKey) parts.push('CommandOrControl')
  if (event.altKey) parts.push('Alt')
  if (event.shiftKey) parts.push('Shift')

  if (parts.length === 0) return null

  const key = event.key.length === 1 ? event.key.toUpperCase() : event.key

  parts.push(key)

  return parts.join('+')
}

/** Formata um Accelerator pra exibição, adaptando "CommandOrControl" à plataforma. */
export function formatAcceleratorForDisplay(accelerator: string): string {
  const isMac = process.platform === 'darwin'

  return accelerator.replace('CommandOrControl', isMac ? 'Cmd' : 'Ctrl')
}

/** Compara um keydown com um Accelerator salvo (usado pelo listener local do SearchBar). */
export function matchesAccelerator(
  event: KeyboardEvent,
  accelerator: string,
): boolean {
  const parts = accelerator.split('+')
  const key = parts[parts.length - 1]
  const modifiers = parts.slice(0, -1)

  const needsCtrlOrCmd = modifiers.includes('CommandOrControl')
  const needsAlt = modifiers.includes('Alt')
  const needsShift = modifiers.includes('Shift')

  if (needsCtrlOrCmd !== (event.ctrlKey || event.metaKey)) return false
  if (needsAlt !== event.altKey) return false
  if (needsShift !== event.shiftKey) return false

  const eventKey = event.key.length === 1 ? event.key.toUpperCase() : event.key

  return eventKey === key
}
