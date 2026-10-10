import * as Dialog from '@radix-ui/react-dialog'
import { FormEvent, useEffect, useState } from 'react'

interface RenameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialTitle: string
  onSave: (title: string) => void
}

export function RenameDialog({
  open,
  onOpenChange,
  initialTitle,
  onSave,
}: RenameDialogProps) {
  const [title, setTitle] = useState(initialTitle)

  useEffect(() => {
    if (open) {
      setTitle(initialTitle)
    }
  }, [open, initialTitle])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const trimmedTitle = title.trim()

    if (!trimmedTitle) return

    onSave(trimmedTitle)
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-xs -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-popover p-5 text-popover-foreground shadow-2xl">
          <Dialog.Title className="text-sm font-bold">
            Renomear documento
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3.5">
            <input
              autoFocus
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />

            <div className="flex justify-end gap-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-md border border-border bg-secondary px-3 py-1.5 text-[13px] font-medium text-secondary-foreground hover:opacity-90"
                >
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={!title.trim()}
                className="rounded-md bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                Salvar
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
