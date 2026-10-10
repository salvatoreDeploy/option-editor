import * as Dialog from '@radix-ui/react-dialog'
import { FormEvent, useEffect, useState } from 'react'

const MIN_PASSWORD_LENGTH = 4

interface SetPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (password: string) => void
  isPending: boolean
}

export function SetPasswordDialog({
  open,
  onOpenChange,
  onSave,
  isPending,
}: SetPasswordDialogProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setPassword('')
      setConfirmPassword('')
      setErrorMessage(null)
    }
  }, [open])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(`Use pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`)
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não são iguais.')
      return
    }

    onSave(password)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-popover p-5 text-popover-foreground shadow-2xl">
          <Dialog.Title className="text-sm font-bold">
            Definir senha local
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-[13px] text-muted-foreground">
            Trava de acesso visual para este dispositivo — não criptografa os
            documentos.
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3.5">
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Nova senha"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirmar senha"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
            />

            {errorMessage && (
              <p className="text-[13px] text-destructive">{errorMessage}</p>
            )}

            <div className="mt-1 flex justify-end gap-2">
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
                disabled={isPending}
                className="rounded-md bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {isPending ? 'Salvando...' : 'Definir senha'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

interface RemovePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (password: string) => void
  isPending: boolean
  errorMessage: string | null
}

export function RemovePasswordDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
  errorMessage,
}: RemovePasswordDialogProps) {
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (open) setPassword('')
  }, [open])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onConfirm(password)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-popover p-5 text-popover-foreground shadow-2xl">
          <Dialog.Title className="text-sm font-bold">
            Remover senha local
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-[13px] text-muted-foreground">
            Digite a senha atual para confirmar.
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3.5">
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Senha atual"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
            />

            {errorMessage && (
              <p className="text-[13px] text-destructive">{errorMessage}</p>
            )}

            <div className="mt-1 flex justify-end gap-2">
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
                disabled={isPending || !password}
                className="rounded-md bg-destructive px-3 py-1.5 text-[13px] font-medium text-destructive-foreground hover:opacity-90 disabled:opacity-60"
              >
                {isPending ? 'Removendo...' : 'Remover senha'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
