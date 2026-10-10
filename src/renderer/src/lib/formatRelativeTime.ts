const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

/** Só o pedaço de tempo relativo ("agora", "há 5 min", "ontem"...), sem verbo. */
export function formatRelativeTimeFragment(
  isoDate: string | undefined,
): string {
  if (!isoDate) return 'sem data'

  const diffMs = Date.now() - new Date(isoDate).getTime()

  if (diffMs < MINUTE_MS) return 'agora'

  if (diffMs < HOUR_MS) {
    const minutes = Math.floor(diffMs / MINUTE_MS)
    return `há ${minutes} min`
  }

  if (diffMs < DAY_MS) {
    const hours = Math.floor(diffMs / HOUR_MS)
    return `há ${hours}h`
  }

  const days = Math.floor(diffMs / DAY_MS)

  if (days === 1) return 'ontem'

  return `há ${days} dias`
}

export function formatRelativeTime(isoDate: string | undefined): string {
  const fragment = formatRelativeTimeFragment(isoDate)

  return fragment === 'sem data' ? fragment : `editado ${fragment}`
}
