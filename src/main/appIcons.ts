import { nativeTheme } from 'electron'
import iconDark from '../../resources/icon.png?asset'
import iconLight from '../../resources/icon-white.png?asset'
import trayIconDark from '../../resources/iconTryv3-black.png?asset'
import trayIconLight from '../../resources/iconTryv3-white.png?asset'

/**
 * Ícone da janela/tray reage ao tema do sistema operacional
 * (`nativeTheme.shouldUseDarkColors`), não ao tema interno do app
 * (`ThemeContext`, puramente renderer/CSS e independente disso) — ver pedido
 * do usuário em 2026-09-19.
 */
export function resolveWindowIconPath(): string {
  return nativeTheme.shouldUseDarkColors ? iconDark : iconLight
}

export function resolveTrayIconPath(): string {
  return nativeTheme.shouldUseDarkColors ? trayIconDark : trayIconLight
}
