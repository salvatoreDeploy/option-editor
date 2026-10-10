import clsx from 'clsx'
import { CaretDoubleRight, DotsThree, TrashSimple } from 'phosphor-react'
import * as Breadcrumbs from './Breadcrumbs'
import * as Collapsible from '@radix-ui/react-collapsible'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { deleteDocument } from '../../api/deleteDocument'
import { fetchDocument } from '../../api/fetchDocument'
import { fetchSettings } from '../../api/fetchSettings'
import { restoreDocument } from '../../api/restoreDocument'
import { queryClient } from '../../lib/react-query'
import { Document } from '@shared/types/ipc'
import { SaveStatus } from '../../pages/document'
import { useUndoToast } from '../../contexts/UndoToastContext'
import { DocumentActionsMenu } from '../DocumentActionsMenu'

interface HeaderProps {
  isSidebarOpen: boolean
}

const SAVE_STATUS_STYLE: Record<
  Exclude<SaveStatus, null>,
  { label: string; dotClassName: string }
> = {
  saving: { label: 'Salvando...', dotClassName: 'bg-warning' },
  saved: { label: 'Salvo agora', dotClassName: 'bg-success' },
  unsaved: { label: 'Não salvo', dotClassName: 'bg-muted-foreground' },
  error: { label: 'Erro ao salvar', dotClassName: 'bg-destructive' },
}

export function Header({ isSidebarOpen }: HeaderProps) {
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()

  const idDocument = id ?? ''

  const isMacOS = process.platform === 'darwin'

  const { showUndoToast } = useUndoToast()

  const { data: currentDocument } = useQuery({
    queryKey: ['document', idDocument],
    queryFn: () => fetchDocument(idDocument),
    enabled: !!idDocument,
  })

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
    enabled: !!idDocument,
  })

  const { data: saveStatus } = useQuery({
    queryKey: ['document-save-status', idDocument],
    queryFn: () => null as SaveStatus,
    enabled: false,
    initialData: null as SaveStatus,
  })

  const { mutateAsync: restoreDocumentFn } = useMutation({
    mutationFn: (documentId: string) => restoreDocument(documentId),
    onSuccess: (restoredDocument) => {
      queryClient.setQueryData<Document[]>(['documents'], (documents) => {
        if (!documents) return documents
        if (documents.some((document) => document.id === restoredDocument.id)) {
          return documents
        }
        return [...documents, restoredDocument]
      })

      navigate(`/document/${restoredDocument.id}`)
    },
    onError(error) {
      console.error('Erro ao restaurar documento:', error)
    },
  })

  const { mutateAsync: deleteDocumentFn, isPending: isDeletingDocument } =
    useMutation({
      mutationFn: () => deleteDocument(idDocument),
      onSuccess: () => {
        const deletedTitle = currentDocument?.title ?? 'Sem título'

        queryClient.setQueryData<Document[]>(['documents'], (documents) => {
          return documents?.filter((document) => document.id !== idDocument)
        })
        queryClient.removeQueries({ queryKey: ['document', idDocument] })

        navigate('/')

        showUndoToast(`"${deletedTitle}" excluído`, () => {
          restoreDocumentFn(idDocument)
        })
      },
    })

  const statusStyle = saveStatus ? SAVE_STATUS_STYLE[saveStatus] : null

  return (
    <div
      id="header"
      className={clsx(
        'border-b h-16 border-border px-7 flex items-center gap-4 leading-tight transition-all duration-250 region-drag',
        {
          'pl-24': !isSidebarOpen && isMacOS,
          'w-screen': !isSidebarOpen,
          'w-[calc(100vw-280px)]': isSidebarOpen,
        },
      )}
    >
      <Collapsible.Trigger
        aria-label="Expandir barra lateral"
        className={clsx('h-5 w-5 text-muted-foreground hover:text-foreground', {
          hidden: isSidebarOpen,
          block: !isSidebarOpen,
        })}
      >
        <CaretDoubleRight className="h-4 w-4" />
      </Collapsible.Trigger>

      {idDocument && (
        <>
          <Breadcrumbs.Root>
            <Breadcrumbs.Item>
              {settings?.data.workspaceName ?? 'Workspace'}
            </Breadcrumbs.Item>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Item isActive>
              {currentDocument?.title ?? 'Sem título'}
            </Breadcrumbs.Item>
          </Breadcrumbs.Root>

          <div className="inline-flex items-center gap-2.5 region-no-drag">
            {statusStyle && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                <span
                  className={clsx(
                    'h-1.5 w-1.5 rounded-full',
                    statusStyle.dotClassName,
                  )}
                />
                {statusStyle.label}
              </span>
            )}

            <DocumentActionsMenu
              documentId={idDocument}
              documentTitle={currentDocument?.title ?? 'Sem título'}
              documentContent={currentDocument?.content}
              isFavorite={currentDocument?.favorite}
              trigger={
                <button
                  aria-label="Mais ações do documento"
                  className="inline-flex items-center justify-center rounded-md bg-transparent p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <DotsThree weight="bold" className="h-4 w-4" />
                </button>
              }
            />

            <AlertDialog.Root>
              <AlertDialog.Trigger asChild>
                <button
                  disabled={isDeletingDocument}
                  className="inline-flex items-center gap-2 rounded-md bg-destructive px-3.5 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90 disabled:opacity-60"
                >
                  <TrashSimple className="h-4 w-4" />
                  Excluir
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
                        Excluir documento?
                      </AlertDialog.Title>
                      <AlertDialog.Description className="text-sm leading-relaxed text-muted-foreground">
                        O documento “{currentDocument?.title ?? 'Sem título'}”
                        será removido do armazenamento local. Você poderá
                        desfazer por alguns segundos logo após a exclusão.
                      </AlertDialog.Description>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 rounded-md border border-border bg-secondary p-3.5">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Documento selecionado
                    </span>
                    <span className="text-sm font-semibold">
                      {currentDocument?.title ?? 'Sem título'}
                    </span>
                  </div>

                  <div className="mt-5 flex justify-end gap-3">
                    <AlertDialog.Cancel asChild>
                      <button className="rounded-md border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground hover:opacity-90">
                        Cancelar
                      </button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                      <button
                        disabled={isDeletingDocument}
                        onClick={() => deleteDocumentFn()}
                        className="rounded-md bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground hover:opacity-90 disabled:opacity-60"
                      >
                        Excluir documento
                      </button>
                    </AlertDialog.Action>
                  </div>
                </AlertDialog.Content>
              </AlertDialog.Portal>
            </AlertDialog.Root>
          </div>
        </>
      )}
    </div>
  )
}
