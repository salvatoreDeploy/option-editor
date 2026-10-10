import { useCallback, useEffect, useRef } from 'react'

interface DebouncedCallback<Args extends unknown[]> {
  (...args: Args): void
  flush: () => void
}

export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  /** `null` registra os argumentos mais recentes mas nunca dispara sozinho — só via `flush()` (ver spec 010i, autosave desligável). */
  delayMs: number | null,
): DebouncedCallback<Args> {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const pendingArgsRef = useRef<Args | null>(null)

  const flush = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = undefined

    if (pendingArgsRef.current) {
      const pending = pendingArgsRef.current
      pendingArgsRef.current = null
      callbackRef.current(...pending)
    }
  }, [])

  useEffect(() => {
    return () => {
      flush()
    }
  }, [flush])

  const debounced = useCallback(
    (...args: Args) => {
      pendingArgsRef.current = args

      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      if (delayMs === null) return

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = undefined
        flush()
      }, delayMs)
    },
    [delayMs, flush],
  ) as DebouncedCallback<Args>

  debounced.flush = flush

  return debounced
}
