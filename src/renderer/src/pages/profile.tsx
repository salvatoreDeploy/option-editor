import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'phosphor-react'
import { ProfileSidebar } from '../components/Profile/Sidebar'
import {
  RemovePasswordDialog,
  SetPasswordDialog,
} from '../components/Profile/PasswordDialogs'
import { fetchSettings } from '../api/fetchSettings'
import { fetchDocuments } from '../api/fetchDocuments'
import { fetchActivity } from '../api/fetchActivity'
import { fetchAuthStatus } from '../api/fetchAuthStatus'
import { setPassword } from '../api/setPassword'
import { removePassword } from '../api/removePassword'
import { lock } from '../api/lock'
import { stripHtml } from '../lib/htmlText'
import { formatRelativeTimeFragment } from '../lib/formatRelativeTime'
import { ActivityAction } from '@shared/types/ipc'

const ACTIVITY_LABEL: Record<ActivityAction, string> = {
  created: 'Documento criado',
  renamed: 'Documento renomeado',
  deleted: 'Documento excluído',
  restored: 'Documento restaurado',
  duplicated: 'Documento duplicado',
}

function countWords(html: string | undefined): number {
  const text = stripHtml(html ?? '').trim()

  if (!text) return 0

  return text.split(/\s+/).length
}

export function Profile() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
  })

  const { data: documents } = useQuery({
    queryKey: ['documents'],
    queryFn: fetchDocuments,
  })

  const { data: activity } = useQuery({
    queryKey: ['activity'],
    queryFn: fetchActivity,
  })

  const { data: authStatus } = useQuery({
    queryKey: ['auth-status'],
    queryFn: fetchAuthStatus,
  })

  const stats = useMemo(() => {
    if (!documents)
      return {
        documentCount: 0,
        totalWords: 0,
        lastSavedAt: undefined as string | undefined,
      }

    const totalWords = documents.reduce(
      (sum, document) => sum + countWords(document.content),
      0,
    )

    const lastSavedAt = documents.reduce<string | undefined>(
      (latest, document) =>
        !latest || (document.updatedAt ?? '') > latest
          ? document.updatedAt
          : latest,
      undefined,
    )

    return { documentCount: documents.length, totalWords, lastSavedAt }
  }, [documents])

  const workspaceName = settings?.data.workspaceName ?? 'Workspace local'
  const initials = workspaceName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('')

  const [isSetPasswordOpen, setIsSetPasswordOpen] = useState(false)
  const [isRemovePasswordOpen, setIsRemovePasswordOpen] = useState(false)
  const [removeErrorMessage, setRemoveErrorMessage] = useState<string | null>(
    null,
  )

  const { mutate: setPasswordFn, isPending: isSettingPassword } = useMutation({
    mutationFn: setPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-status'] })
      setIsSetPasswordOpen(false)
    },
    onError(error) {
      console.error('Erro ao definir senha local:', error)
    },
  })

  const { mutate: removePasswordFn, isPending: isRemovingPassword } =
    useMutation({
      mutationFn: removePassword,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['auth-status'] })
        setIsRemovePasswordOpen(false)
        setRemoveErrorMessage(null)
      },
      onError() {
        setRemoveErrorMessage('Senha atual incorreta.')
      },
    })

  const { mutate: lockFn } = useMutation({
    mutationFn: lock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-status'] })
    },
    onError(error) {
      console.error('Erro ao bloquear workspace:', error)
    },
  })

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <ProfileSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-7 px-10 py-10">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-[28px] font-bold">Perfil</h1>
              <p className="text-sm text-muted-foreground">
                Identidade local usada para organizar este workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="rounded-md border border-border bg-secondary px-3.5 py-2 text-sm font-medium text-secondary-foreground hover:opacity-90"
            >
              Editar perfil
            </button>
          </div>

          <div className="flex gap-6">
            <section className="flex w-[360px] flex-shrink-0 flex-col gap-5 rounded-lg border border-border bg-card p-6">
              <div className="flex h-[78px] w-[78px] items-center justify-center rounded-full bg-secondary">
                <span className="text-xl font-extrabold">
                  {initials || 'OE'}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xl font-bold">{workspaceName}</span>
                <span className="text-sm text-muted-foreground">
                  Sem conta remota conectada
                </span>
              </div>

              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                <CheckCircle weight="fill" className="h-3 w-3" />
                Modo local
              </span>

              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Este perfil identifica o workspace neste dispositivo. Recursos
                de sincronização podem ser adicionados sem alterar a organização
                local.
              </p>
            </section>

            <div className="flex flex-1 flex-col gap-5">
              <div className="flex gap-4">
                <StatCard
                  label="Documentos"
                  value={String(stats.documentCount)}
                />
                <StatCard
                  label="Palavras"
                  value={stats.totalWords.toLocaleString('pt-BR')}
                />
                <StatCard
                  label="Último salvamento"
                  value={
                    stats.lastSavedAt
                      ? formatRelativeTimeFragment(stats.lastSavedAt)
                      : '—'
                  }
                />
              </div>

              <section className="flex flex-col gap-3.5 rounded-lg border border-border bg-card p-5">
                <h2 className="text-base font-bold">Atividade recente</h2>

                {!activity || activity.data.length === 0 ? (
                  <p className="text-[13px] text-muted-foreground/50">
                    Nenhuma atividade ainda.
                  </p>
                ) : (
                  activity.data.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-muted-foreground" />
                      <span className="flex-1 truncate text-sm text-muted-foreground">
                        {ACTIVITY_LABEL[entry.action]}: &quot;
                        {entry.documentTitle}&quot;
                      </span>
                      <span className="flex-shrink-0 text-xs text-muted-foreground/70">
                        {formatRelativeTimeFragment(entry.createdAt)}
                      </span>
                    </div>
                  ))
                )}
              </section>

              <section className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                <button
                  type="button"
                  onClick={() => navigate('/settings')}
                  className="rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Abrir configurações
                </button>

                {authStatus?.hasPassword ? (
                  <>
                    <button
                      type="button"
                      onClick={() => lockFn()}
                      className="rounded-md border border-border bg-secondary px-3.5 py-2 text-sm font-medium text-secondary-foreground hover:opacity-90"
                    >
                      Bloquear workspace
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRemovePasswordOpen(true)}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      Remover senha local
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsSetPasswordOpen(true)}
                    className="rounded-md border border-border bg-secondary px-3.5 py-2 text-sm font-medium text-secondary-foreground hover:opacity-90"
                  >
                    Definir senha local
                  </button>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>

      <SetPasswordDialog
        open={isSetPasswordOpen}
        onOpenChange={setIsSetPasswordOpen}
        onSave={(password) => setPasswordFn(password)}
        isPending={isSettingPassword}
      />

      <RemovePasswordDialog
        open={isRemovePasswordOpen}
        onOpenChange={(open) => {
          setIsRemovePasswordOpen(open)
          if (!open) setRemoveErrorMessage(null)
        }}
        onConfirm={(password) => removePasswordFn(password)}
        isPending={isRemovingPassword}
        errorMessage={removeErrorMessage}
      />
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="flex flex-1 flex-col gap-2 rounded-lg border border-border bg-card p-5">
      <span className="text-xs font-semibold text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-2xl font-bold">{value}</span>
    </div>
  )
}
