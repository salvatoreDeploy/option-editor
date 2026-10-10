import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

const UNDO_WINDOW_MS = 6000

interface UndoToastState {
  message: string
  onUndo: () => void
}

interface UndoToastContextValue {
  toast: UndoToastState | null
  showUndoToast: (message: string, onUndo: () => void) => void
  dismiss: () => void
}

const UndoToastContext = createContext<UndoToastContextValue | null>(null)

export function UndoToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<UndoToastState | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const dismiss = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setToast(null)
  }, [])

  const showUndoToast = useCallback((message: string, onUndo: () => void) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    setToast({ message, onUndo })

    timeoutRef.current = setTimeout(() => {
      setToast(null)
    }, UNDO_WINDOW_MS)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <UndoToastContext.Provider value={{ toast, showUndoToast, dismiss }}>
      {children}
    </UndoToastContext.Provider>
  )
}

export function useUndoToast(): UndoToastContextValue {
  const context = useContext(UndoToastContext)

  if (!context) {
    throw new Error(
      'useUndoToast deve ser usado dentro de um UndoToastProvider',
    )
  }

  return context
}
