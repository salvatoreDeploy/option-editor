import { useUndoToast } from '../../contexts/UndoToastContext'

export function UndoToast() {
  const { toast, dismiss } = useUndoToast()

  if (!toast) return null

  function handleUndo() {
    toast?.onUndo()
    dismiss()
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-lg border border-border bg-popover px-4 py-3 text-sm text-popover-foreground shadow-2xl">
      <span>{toast.message}</span>
      <button
        onClick={handleUndo}
        className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground hover:opacity-90"
      >
        Desfazer
      </button>
    </div>
  )
}
