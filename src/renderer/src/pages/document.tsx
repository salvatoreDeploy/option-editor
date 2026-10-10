import { useParams } from 'react-router-dom'
import {
  Editor,
  EditorHandle,
  DocumentStats,
  OnContentUpdatedParams,
} from '../components/Editor'
import { ToC } from '../components/ToC'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchDocument } from '../api/fetchDocument'
import { useEffect, useMemo, useRef, useState } from 'react'
import { saveDocument } from '../api/saveDocument'
import { fetchShortcuts } from '../api/fetchShortcuts'
import { fetchSettings } from '../api/fetchSettings'
import { Document as DocumentIPC } from '@shared/types/ipc'
import { useDebouncedCallback } from '../hooks/useDebouncedCallback'
import {
  formatAcceleratorForDisplay,
  matchesAccelerator,
} from '../lib/keyboardShortcut'

const AUTOSAVE_DEBOUNCE_MS = 600
const SAVED_LABEL_VISIBLE_MS = 2000
const MANUAL_SAVE_ACCELERATOR = 'CommandOrControl+S'

export type SaveStatus = 'saving' | 'saved' | 'unsaved' | 'error' | null

export function Document() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const idDocument = id ?? ''

  const { data: result, isFetching } = useQuery({
    queryKey: ['document', id],
    queryFn: () => fetchDocument(idDocument),
  })

  const { data: shortcuts } = useQuery({
    queryKey: ['shortcuts'],
    queryFn: fetchShortcuts,
  })

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
  })

  const autosaveEnabled = settings?.data.autosaveEnabled ?? true

  const {
    mutate: saveDocumentFn,
    isPending: isSaving,
    isError: hasSaveError,
    isSuccess: isSaved,
  } = useMutation({
    mutationFn: ({ title, content }: OnContentUpdatedParams) =>
      saveDocument(idDocument, title, content),
    onError(error) {
      console.error('Erro ao salvar documento:', error)
    },
    onSuccess(savedDocument) {
      queryClient.setQueryData<DocumentIPC>(['document', idDocument], (doc) =>
        doc ? { ...doc, updatedAt: savedDocument.updatedAt } : doc,
      )
      queryClient.setQueryData<DocumentIPC[]>(['documents'], (documents) => {
        return documents?.map((document) => {
          if (document.id === idDocument) {
            return { ...document, updatedAt: savedDocument.updatedAt }
          }
          return document
        })
      })
    },
  })

  const lastSavedRef = useRef<OnContentUpdatedParams | null>(null)
  const lastEmittedTitleRef = useRef<string | null>(null)
  const editorRef = useRef<EditorHandle>(null)

  // Se o título mudar por uma via externa (ex. renomear pelo Header/Sidebar,
  // spec 010c) e não pela própria digitação, o <h1> ainda visível no editor
  // ficaria desatualizado e a próxima edição reverteria a renomeação (o
  // autosave extrai o título do próprio <h1>). Forçar o editor a remontar
  // com o `initialContent` atualizado resolve isso.
  const [editorKey, setEditorKey] = useState(0)

  useEffect(() => {
    if (!result) return

    const isExternalTitleChange =
      lastEmittedTitleRef.current !== null &&
      result.title !== lastEmittedTitleRef.current

    if (isExternalTitleChange) {
      setEditorKey((key) => key + 1)
    }

    lastSavedRef.current = { title: result.title, content: result.content }
    lastEmittedTitleRef.current = result.title
  }, [result])

  function hasUnsavedChanges(params: OnContentUpdatedParams) {
    const last = lastSavedRef.current

    return (
      !last || last.title !== params.title || last.content !== params.content
    )
  }

  // Reflete "há uma edição aguardando o debounce disparar" — sem isso, o
  // indicador de status fica preso em "Salvo" (ou some) durante toda a
  // espera do debounce, mesmo com o usuário digitando.
  const [hasPendingEdit, setHasPendingEdit] = useState(false)

  const debouncedSave = useDebouncedCallback(
    (params: OnContentUpdatedParams) => {
      setHasPendingEdit(false)

      if (!hasUnsavedChanges(params)) {
        return
      }

      lastSavedRef.current = params
      saveDocumentFn(params)
    },
    autosaveEnabled ? AUTOSAVE_DEBOUNCE_MS : null,
  )

  // Ctrl+S/Cmd+S sempre funciona, com ou sem autosave — com autosave ligado
  // só adianta o que já ia salvar sozinho; com autosave desligado, é o único
  // jeito de persistir (ver spec 010i, revisão 2026-10-06).
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!matchesAccelerator(event, MANUAL_SAVE_ACCELERATOR)) return

      event.preventDefault()
      debouncedSave.flush()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [debouncedSave])

  const initialContent = useMemo(() => {
    if (result) {
      return `<h1>${result.title}</h1>${result.content ?? '<p></p>'}`
    }

    return ''
  }, [result])

  function handleEditorContentUpdated(params: OnContentUpdatedParams) {
    if (hasUnsavedChanges(params)) {
      setHasPendingEdit(true)
    }

    // Título reflete no breadcrumb (Header) e na Sidebar em tempo real,
    // independente do debounce do autosave — só o salvamento em disco espera
    // o debounce, a exibição não precisa.
    if (params.title !== lastEmittedTitleRef.current) {
      lastEmittedTitleRef.current = params.title

      queryClient.setQueryData<DocumentIPC>(['document', idDocument], (doc) =>
        doc ? { ...doc, title: params.title } : doc,
      )
      queryClient.setQueryData<DocumentIPC[]>(['documents'], (documents) =>
        documents?.map((document) =>
          document.id === idDocument
            ? { ...document, title: params.title }
            : document,
        ),
      )
    }

    debouncedSave(params)
  }

  const [stats, setStats] = useState<DocumentStats>({
    headings: [],
    wordCount: 0,
  })

  // "Salvo" some sozinho depois de um tempo — o React Query não reseta
  // isSuccess automaticamente entre uma mutation e a próxima.
  const [showSavedConfirmation, setShowSavedConfirmation] = useState(false)

  useEffect(() => {
    if (!isSaved) return undefined

    setShowSavedConfirmation(true)

    const timeout = setTimeout(() => {
      setShowSavedConfirmation(false)
    }, SAVED_LABEL_VISIBLE_MS)

    return () => clearTimeout(timeout)
  }, [isSaved])

  const saveStatus: SaveStatus = isSaving
    ? 'saving'
    : hasSaveError
      ? 'error'
      : hasPendingEdit
        ? autosaveEnabled
          ? 'saving'
          : 'unsaved'
        : showSavedConfirmation
          ? 'saved'
          : null

  // O Header (componente irmão, fora desta página) mostra o status de
  // salvamento e não tem acesso direto a este estado local — publicado no
  // cache do React Query, que o Header lê via useQuery na mesma chave.
  useEffect(() => {
    queryClient.setQueryData(['document-save-status', idDocument], saveStatus)
  }, [queryClient, idDocument, saveStatus])

  if (isFetching && !result) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Carregando documento...</p>
      </main>
    )
  }

  if (!result) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">
          Documento não encontrado.
        </p>
      </main>
    )
  }

  return (
    <main className="flex-1 flex gap-8 px-8 py-10 min-h-0 overflow-hidden">
      <aside className="hidden lg:block h-full flex-shrink-0 overflow-y-auto">
        <ToC.Root>
          {stats.headings.length === 0 ? (
            <p className="text-[13px] text-muted-foreground/50">Sem seções</p>
          ) : (
            stats.headings.map((heading) => (
              <ToC.Item
                key={heading.pos}
                onClick={() => editorRef.current?.scrollToHeading(heading.pos)}
              >
                {heading.text}
              </ToC.Item>
            ))
          )}
        </ToC.Root>
      </aside>

      <section className="flex-1 flex flex-col items-center overflow-y-auto min-h-0">
        <Editor
          key={editorKey}
          ref={editorRef}
          onContentUpdated={handleEditorContentUpdated}
          onStatsChanged={setStats}
          content={initialContent}
        />
      </section>

      <aside className="hidden lg:block h-full w-[150px] flex-shrink-0 overflow-y-auto">
        <div className="flex flex-col gap-3.5">
          <span className="text-[11px] font-bold text-muted-foreground">
            Estado
          </span>

          <InspectorRow
            label="Palavras"
            value={stats.wordCount.toLocaleString('pt-BR')}
          />
          <InspectorRow
            label="Salvo"
            value={showSavedConfirmation ? 'Agora' : '—'}
          />
          <InspectorRow label="Origem" value="Local" />
          <InspectorRow
            label="Atalho"
            value={
              shortcuts
                ? formatAcceleratorForDisplay(shortcuts.newDocument)
                : '—'
            }
          />
        </div>
      </aside>
    </main>
  )
}

interface InspectorRowProps {
  label: string
  value: string
}

function InspectorRow({ label, value }: InspectorRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  )
}
