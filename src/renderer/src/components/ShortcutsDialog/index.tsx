import * as Dialog from '@radix-ui/react-dialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { KeyboardEvent as ReactKeyboardEvent, useEffect, useState } from 'react'
import { ShortcutsConfig } from '@shared/types/ipc'
import { fetchShortcuts } from '../../api/fetchShortcuts'
import { saveShortcuts } from '../../api/saveShortcuts'
import {
  captureAccelerator,
  formatAcceleratorForDisplay,
} from '../../lib/keyboardShortcut'

interface ShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ShortcutField = keyof ShortcutsConfig

export function ShortcutsDialog({ open, onOpenChange }: ShortcutsDialogProps) {
  const queryClient = useQueryClient()

  const { data: shortcuts } = useQuery({
    queryKey: ['shortcuts'],
    queryFn: fetchShortcuts,
    enabled: open,
  })

  const [draft, setDraft] = useState<ShortcutsConfig | null>(null)
  const [recordingField, setRecordingField] = useState<ShortcutField | null>(
    null,
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (open && shortcuts) {
      setDraft(shortcuts)
      setErrorMessage(null)
      setRecordingField(null)
    }
  }, [open, shortcuts])

  const { mutate: save, isPending } = useMutation({
    mutationFn: saveShortcuts,
    onSuccess: (saved) => {
      queryClient.setQueryData(['shortcuts'], saved)
      onOpenChange(false)
    },
    onError(error: Error) {
      setErrorMessage(error.message || 'Erro ao salvar atalhos.')
    },
  })

  function handleRecord(field: ShortcutField) {
    setRecordingField(field)
    setErrorMessage(null)
  }

  function handleKeyDown(event: ReactKeyboardEvent) {
    if (!recordingField) return

    event.preventDefault()
    event.stopPropagation()

    if (event.key === 'Escape') {
      setRecordingField(null)
      return
    }

    const accelerator = captureAccelerator(event.nativeEvent)

    if (!accelerator) {
      setErrorMessage('Use pelo menos um modificador (Ctrl/Cmd/Alt).')
      return
    }

    setDraft((current) =>
      current ? { ...current, [recordingField]: accelerator } : current,
    )
    setRecordingField(null)
  }

  function handleSave() {
    if (!draft) return

    if (draft.newDocument === draft.quickSearch) {
      setErrorMessage('Os dois atalhos não podem ser iguais.')
      return
    }

    save(draft)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80" />
        <Dialog.Content
          onKeyDown={handleKeyDown}
          className="fixed left-1/2 top-1/2 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-popover p-5 text-popover-foreground shadow-2xl"
        >
          <Dialog.Title className="text-sm font-bold">Atalhos</Dialog.Title>

          <div className="mt-4 flex flex-col gap-3.5">
            <ShortcutRow
              label="Novo documento"
              value={draft?.newDocument}
              isRecording={recordingField === 'newDocument'}
              onRecord={() => handleRecord('newDocument')}
            />
            <ShortcutRow
              label="Busca rápida"
              value={draft?.quickSearch}
              isRecording={recordingField === 'quickSearch'}
              onRecord={() => handleRecord('quickSearch')}
            />

            <div className="flex items-center justify-between border-t border-border pt-3.5">
              <span className="text-[13px] text-muted-foreground">
                Fechar modal
              </span>
              <span className="rounded-[6px] bg-secondary px-2 py-1 font-mono text-[11px] text-muted-foreground">
                Esc
              </span>
            </div>
          </div>

          {errorMessage && (
            <p className="mt-3 text-[13px] text-destructive">{errorMessage}</p>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-md border border-border bg-secondary px-3 py-1.5 text-[13px] font-medium text-secondary-foreground hover:opacity-90"
              >
                Cancelar
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || !draft}
              className="rounded-md bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              Salvar
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

interface ShortcutRowProps {
  label: string
  value?: string
  isRecording: boolean
  onRecord: () => void
}

function ShortcutRow({
  label,
  value,
  isRecording,
  onRecord,
}: ShortcutRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <button
        type="button"
        onClick={onRecord}
        className={clsx(
          'rounded-[6px] px-2 py-1 font-mono text-[11px]',
          isRecording
            ? 'bg-accent text-foreground'
            : 'bg-secondary text-foreground hover:opacity-90',
        )}
      >
        {isRecording
          ? 'Pressione uma tecla...'
          : value
            ? formatAcceleratorForDisplay(value)
            : '—'}
      </button>
    </div>
  )
}
