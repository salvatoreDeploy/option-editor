import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { TrashSimple } from 'phosphor-react'
import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { SettingsSidebar } from '../components/Settings/Sidebar'
import { Switch } from '../components/Settings/Switch'
import { ShortcutsDialog } from '../components/ShortcutsDialog'
import { fetchSettings } from '../api/fetchSettings'
import { saveSettings } from '../api/saveSettings'
import { openDataFolder } from '../api/openDataFolder'
import { clearAllDocuments } from '../api/clearAllDocuments'
import { fetchShortcuts } from '../api/fetchShortcuts'
import { formatAcceleratorForDisplay } from '../lib/keyboardShortcut'
import { SUPPORTED_CODE_LANGUAGES } from '../components/Editor'

const MANUAL_SAVE_ACCELERATOR_LABEL =
  formatAcceleratorForDisplay('CommandOrControl+S')

export type SettingsSection = 'general' | 'editor' | 'shortcuts' | 'local-data'

const CLEAR_DATA_CONFIRM_WORD = 'LIMPAR'
const CLEARED_CONFIRMATION_VISIBLE_MS = 3000

export function Settings() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
  })

  const { data: shortcuts } = useQuery({
    queryKey: ['shortcuts'],
    queryFn: fetchShortcuts,
  })

  const [workspaceNameDraft, setWorkspaceNameDraft] = useState('')
  const [autosaveEnabledDraft, setAutosaveEnabledDraft] = useState(true)
  const [spellCheckEnabledDraft, setSpellCheckEnabledDraft] = useState(true)

  useEffect(() => {
    if (!settings) return

    setWorkspaceNameDraft(settings.data.workspaceName)
    setAutosaveEnabledDraft(settings.data.autosaveEnabled)
    setSpellCheckEnabledDraft(settings.data.spellCheckEnabled)
  }, [settings])

  const { mutate: saveSettingsFn, isPending: isSavingSettings } = useMutation({
    mutationFn: saveSettings,
    onSuccess: (saved) => {
      queryClient.setQueryData(['settings'], (current: typeof settings) =>
        current ? { ...current, data: saved } : current,
      )
    },
    onError(error) {
      console.error('Erro ao salvar configurações:', error)
    },
  })

  const hasSettingsChanges =
    !!settings &&
    (workspaceNameDraft.trim() !== settings.data.workspaceName ||
      autosaveEnabledDraft !== settings.data.autosaveEnabled ||
      spellCheckEnabledDraft !== settings.data.spellCheckEnabled)

  const { mutate: openDataFolderFn } = useMutation({
    mutationFn: openDataFolder,
    onError(error) {
      console.error('Erro ao abrir pasta de dados:', error)
    },
  })

  const [isShortcutsDialogOpen, setIsShortcutsDialogOpen] = useState(false)

  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false)
  const [clearConfirmText, setClearConfirmText] = useState('')

  useEffect(() => {
    if (isClearDialogOpen) setClearConfirmText('')
  }, [isClearDialogOpen])

  const {
    mutate: clearAllDocumentsFn,
    isPending: isClearingData,
    isSuccess: didClearData,
  } = useMutation({
    mutationFn: clearAllDocuments,
    onSuccess: () => {
      queryClient.setQueryData(['documents'], [])
      setIsClearDialogOpen(false)
    },
    onError(error) {
      console.error('Erro ao limpar dados locais:', error)
    },
  })

  const [showClearedConfirmation, setShowClearedConfirmation] = useState(false)

  useEffect(() => {
    if (!didClearData) return undefined

    setShowClearedConfirmation(true)

    const timeout = setTimeout(() => {
      setShowClearedConfirmation(false)
    }, CLEARED_CONFIRMATION_VISIBLE_MS)

    return () => clearTimeout(timeout)
  }, [didClearData])

  const generalRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const shortcutsRef = useRef<HTMLDivElement>(null)
  const localDataRef = useRef<HTMLDivElement>(null)

  const sectionRefs: Record<SettingsSection, typeof generalRef> = {
    general: generalRef,
    editor: editorRef,
    shortcuts: shortcutsRef,
    'local-data': localDataRef,
  }

  function scrollToSection(section: SettingsSection) {
    sectionRefs[section].current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <SettingsSidebar
        onNavigate={scrollToSection}
        onBack={() => navigate('/')}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-6 px-10 py-10">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-[28px] font-bold">Configurações</h1>
              <p className="text-sm text-muted-foreground">
                Ajustes locais do app, editor e armazenamento deste dispositivo.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                saveSettingsFn({
                  workspaceName: workspaceNameDraft,
                  autosaveEnabled: autosaveEnabledDraft,
                  spellCheckEnabled: spellCheckEnabledDraft,
                })
              }
              disabled={isSavingSettings || !hasSettingsChanges}
              className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {isSavingSettings ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-1 flex-col gap-[18px]">
              <section
                ref={generalRef}
                className="flex flex-col gap-[18px] rounded-lg border border-border bg-card p-[22px]"
              >
                <h2 className="text-lg font-bold">Geral</h2>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="workspace-name"
                    className="text-[13px] font-semibold"
                  >
                    Nome do workspace
                  </label>
                  <input
                    id="workspace-name"
                    value={workspaceNameDraft}
                    onChange={(event) =>
                      setWorkspaceNameDraft(event.target.value)
                    }
                    className="rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[13px] font-semibold">
                    Pasta de dados
                  </span>
                  <div className="select-text rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground">
                    {settings?.dataFolderPath ?? '—'}
                  </div>
                </div>
              </section>

              <section
                ref={editorRef}
                className="flex flex-col gap-4 rounded-lg border border-border bg-card p-[22px]"
              >
                <h2 className="text-lg font-bold">Editor</h2>

                <div className="flex items-center justify-between border-b border-border py-2">
                  <div className="flex flex-col gap-0.5">
                    <label
                      htmlFor="autosave-enabled"
                      className="text-sm text-foreground"
                    >
                      Autosave com debounce
                    </label>
                    {!autosaveEnabledDraft && (
                      <span className="text-xs text-muted-foreground">
                        Desligado — salve com {MANUAL_SAVE_ACCELERATOR_LABEL}
                      </span>
                    )}
                  </div>
                  <Switch
                    id="autosave-enabled"
                    checked={autosaveEnabledDraft}
                    onCheckedChange={setAutosaveEnabledDraft}
                  />
                </div>

                <div className="flex items-center justify-between border-b border-border py-2">
                  <label
                    htmlFor="spellcheck-enabled"
                    className="text-sm text-foreground"
                  >
                    Verificação ortográfica
                  </label>
                  <Switch
                    id="spellcheck-enabled"
                    checked={spellCheckEnabledDraft}
                    onCheckedChange={setSpellCheckEnabledDraft}
                  />
                </div>

                <SettingRow
                  label="Code blocks"
                  value={SUPPORTED_CODE_LANGUAGES.join(', ')}
                  isLast
                />
              </section>
            </div>

            <div className="flex w-[320px] flex-shrink-0 flex-col gap-[18px]">
              <section
                ref={shortcutsRef}
                className="flex flex-col gap-3.5 rounded-lg border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold">Atalhos</h2>
                  <button
                    type="button"
                    onClick={() => setIsShortcutsDialogOpen(true)}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Editar
                  </button>
                </div>

                <ShortcutRow
                  label="Novo documento"
                  value={
                    shortcuts
                      ? formatAcceleratorForDisplay(shortcuts.newDocument)
                      : '—'
                  }
                />
                <ShortcutRow
                  label="Busca rápida"
                  value={
                    shortcuts
                      ? formatAcceleratorForDisplay(shortcuts.quickSearch)
                      : '—'
                  }
                />
                <ShortcutRow label="Fechar modal" value="Esc" />
              </section>

              <section
                ref={localDataRef}
                className="flex flex-col gap-3.5 rounded-lg border border-border bg-card p-5"
              >
                <h2 className="text-base font-bold">Dados locais</h2>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  Documentos são persistidos localmente usando electron-store.
                </p>
                <button
                  type="button"
                  onClick={() => openDataFolderFn()}
                  className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:opacity-90"
                >
                  Abrir pasta de dados
                </button>
              </section>

              <section className="flex flex-col gap-3.5 rounded-lg border border-destructive bg-destructive/10 p-5">
                <h2 className="text-base font-bold">Zona sensível</h2>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  Limpar dados remove documentos locais deste dispositivo.
                </p>

                <AlertDialog.Root
                  open={isClearDialogOpen}
                  onOpenChange={setIsClearDialogOpen}
                >
                  <AlertDialog.Trigger asChild>
                    <button
                      type="button"
                      className="w-full rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90"
                    >
                      Limpar dados locais
                    </button>
                  </AlertDialog.Trigger>

                  <AlertDialog.Portal>
                    <AlertDialog.Overlay className="fixed inset-0 bg-background/80" />
                    <AlertDialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-popover p-6 text-popover-foreground shadow-2xl">
                      <div className="flex gap-3.5">
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                          <TrashSimple className="h-[22px] w-[22px] text-destructive" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <AlertDialog.Title className="text-[19px] font-bold">
                            Limpar todos os documentos?
                          </AlertDialog.Title>
                          <AlertDialog.Description className="text-sm leading-relaxed text-muted-foreground">
                            Isso apaga permanentemente todos os documentos deste
                            dispositivo, inclusive os que estão na lixeira. Não
                            é possível desfazer.
                          </AlertDialog.Description>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-2">
                        <label
                          htmlFor="clear-data-confirm"
                          className="text-[13px] text-muted-foreground"
                        >
                          Digite <strong>{CLEAR_DATA_CONFIRM_WORD}</strong> para
                          confirmar
                        </label>
                        <input
                          id="clear-data-confirm"
                          value={clearConfirmText}
                          onChange={(event) =>
                            setClearConfirmText(event.target.value)
                          }
                          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
                        />
                      </div>

                      <div className="mt-5 flex justify-end gap-3">
                        <AlertDialog.Cancel asChild>
                          <button className="rounded-md border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground hover:opacity-90">
                            Cancelar
                          </button>
                        </AlertDialog.Cancel>
                        <button
                          disabled={
                            isClearingData ||
                            clearConfirmText.trim() !== CLEAR_DATA_CONFIRM_WORD
                          }
                          onClick={() => clearAllDocumentsFn()}
                          className="rounded-md bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground hover:opacity-90 disabled:opacity-60"
                        >
                          Limpar dados locais
                        </button>
                      </div>
                    </AlertDialog.Content>
                  </AlertDialog.Portal>
                </AlertDialog.Root>

                {showClearedConfirmation && (
                  <p className="text-[13px] font-medium text-foreground">
                    Dados locais limpos.
                  </p>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>

      <ShortcutsDialog
        open={isShortcutsDialogOpen}
        onOpenChange={setIsShortcutsDialogOpen}
      />
    </div>
  )
}

interface SettingRowProps {
  label: string
  value: string
  isLast?: boolean
}

function SettingRow({ label, value, isLast = false }: SettingRowProps) {
  return (
    <div
      className={
        isLast
          ? 'flex items-center justify-between py-2 text-sm'
          : 'flex items-center justify-between border-b border-border py-2 text-sm'
      }
    >
      <span className="text-foreground">{label}</span>
      <span className="text-[13px] text-muted-foreground">{value}</span>
    </div>
  )
}

function ShortcutRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <span className="rounded-md bg-secondary px-2 py-1 font-mono text-[11px] text-foreground">
        {value}
      </span>
    </div>
  )
}
