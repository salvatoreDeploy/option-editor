import { FormEvent, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Check } from 'phosphor-react'
import { fetchSettings } from '../api/fetchSettings'
import { unlock } from '../api/unlock'

interface LockProps {
  onUnlocked: () => void
}

const TRUST_NOTES = [
  'Dados salvos localmente',
  'Compatível com autosave',
  'Trava não criptografa os documentos',
]

export function Lock({ onUnlocked }: LockProps) {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
  })

  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { mutate: unlockFn, isPending } = useMutation({
    mutationFn: unlock,
    onSuccess: (result) => {
      if (result.success) {
        onUnlocked()
        return
      }

      setErrorMessage('Senha incorreta.')
    },
    onError() {
      setErrorMessage('Erro ao verificar a senha.')
    },
  })

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setErrorMessage(null)
    unlockFn(password)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <div className="hidden w-[520px] flex-shrink-0 flex-col justify-between gap-7 bg-[#050505] p-12 lg:flex">
        <div className="flex flex-col gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
            <span className="text-lg font-extrabold text-primary-foreground">
              O
            </span>
          </div>
          <h1 className="text-[38px] font-extrabold leading-[1.08]">
            Seu editor local, pronto para continuar.
          </h1>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Acesse o workspace deste dispositivo, proteja suas notas e mantenha
            o fluxo de escrita sem depender de sincronização remota.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {TRUST_NOTES.map((note) => (
            <div key={note} className="flex items-center gap-2.5">
              <Check className="h-4 w-4 flex-shrink-0 text-success" />
              <span className="text-[13px] text-muted-foreground">{note}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-12">
        <div className="w-full max-w-[430px] rounded-lg border border-border bg-card p-7">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl font-bold">Entrar no OptionEditor</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Use a senha local para desbloquear{' '}
              {settings?.data.workspaceName ?? 'este workspace'} neste
              dispositivo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="lock-password"
                className="text-[13px] font-semibold"
              >
                Senha local
              </label>
              <input
                id="lock-password"
                type="password"
                autoFocus
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Digite sua senha"
                className="rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {errorMessage && (
              <p className="text-[13px] text-destructive">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={isPending || !password}
              className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {isPending ? 'Verificando...' : 'Entrar no workspace'}
            </button>

            <p className="text-xs leading-relaxed text-muted-foreground">
              A senha local é uma camada de bloqueio visual — não criptografa os
              documentos deste dispositivo.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
