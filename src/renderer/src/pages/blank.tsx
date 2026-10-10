import { useQuery } from '@tanstack/react-query'
import { FilePlus } from 'phosphor-react'
import { useCreateDocument } from '../hooks/useCreateDocument'
import { useSearchDialog } from '../contexts/SearchDialogContext'
import { fetchShortcuts } from '../api/fetchShortcuts'
import { formatAcceleratorForDisplay } from '../lib/keyboardShortcut'

export function Blank() {
  const { mutate: createDocumentFn, isPending: isCreatingNewDocument } =
    useCreateDocument()
  const { open: openSearch } = useSearchDialog()

  const { data: shortcuts } = useQuery({
    queryKey: ['shortcuts'],
    queryFn: fetchShortcuts,
  })

  return (
    <main className="flex flex-1 flex-col gap-6 overflow-y-auto px-8 py-8 min-h-0">
      <div className="flex h-11 items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">
          Nenhum documento aberto
        </span>

        <button
          onClick={() => createDocumentFn()}
          disabled={isCreatingNewDocument}
          className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          Criar documento
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-[18px]">
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[20px] border border-border bg-secondary">
          <FilePlus className="h-[30px] w-[30px] text-foreground" />
        </div>

        <div className="flex w-[520px] max-w-full flex-col items-center gap-2 text-center">
          <h1 className="text-[28px] font-extrabold text-foreground">
            Crie seu primeiro documento
          </h1>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Use o editor para registrar decisões, notas técnicas e rascunhos com
            salvamento local automático.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => createDocumentFn()}
            disabled={isCreatingNewDocument}
            className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            Criar documento
          </button>
          <button
            onClick={openSearch}
            className="rounded-md border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground hover:opacity-90"
          >
            Abrir busca rápida
          </button>
        </div>

        {shortcuts && (
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-muted px-2.5 py-1.5 font-mono text-xs text-muted-foreground">
              {formatAcceleratorForDisplay(shortcuts.newDocument)} cria
              documento
            </span>
            <span className="rounded-full bg-muted px-2.5 py-1.5 font-mono text-xs text-muted-foreground">
              {formatAcceleratorForDisplay(shortcuts.quickSearch)} busca
            </span>
          </div>
        )}
      </div>
    </main>
  )
}
