import { useQuery } from '@tanstack/react-query'
import { Command } from 'cmdk'
import { FilePlus, FileText, MagnifyingGlass } from 'phosphor-react'
import { useEffect, useMemo, useState } from 'react'
import { fetchDocuments } from '../../api/fetchDocuments'
import { fetchShortcuts } from '../../api/fetchShortcuts'
import { useCreateDocument } from '../../hooks/useCreateDocument'
import { useNavigate } from 'react-router-dom'
import { searchDocuments } from '../../lib/searchDocuments'
import { formatRelativeTime } from '../../lib/formatRelativeTime'
import { matchesAccelerator } from '../../lib/keyboardShortcut'

interface SearchBarProps {
  open: boolean
  onOpenChange: (isOpen: boolean) => void
}

export function SearchBar({ onOpenChange, open }: SearchBarProps) {
  const navigate = useNavigate()

  const { mutate: createDocumentFn } = useCreateDocument()

  const [query, setQuery] = useState('')

  const { data: shortcuts } = useQuery({
    queryKey: ['shortcuts'],
    queryFn: fetchShortcuts,
  })

  useEffect(() => {
    if (!shortcuts) return

    const down = (e: KeyboardEvent) => {
      if (matchesAccelerator(e, shortcuts.quickSearch)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [onOpenChange, open, shortcuts])

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const { data: result, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => fetchDocuments(),
  })

  const searchResults = useMemo(
    () => searchDocuments(result ?? [], query),
    [result, query],
  )

  function handleOpenDocument(id: string) {
    navigate(`/document/${id}`)
    onOpenChange(false)
  }

  function handleCreateDocument() {
    createDocumentFn()
    onOpenChange(false)
  }

  return (
    <Command.Dialog
      shouldFilter={false}
      className="fixed left-1/2 top-24 w-[560px] max-w-[90vw] -translate-x-1/2 rounded-lg border border-border bg-popover text-popover-foreground shadow-2xl"
      overlayClassName="fixed inset-0 bg-background/80"
      open={open}
      onOpenChange={onOpenChange}
      label="Busca rápida"
    >
      <div className="flex items-center gap-3 border-b border-border px-[18px] py-[18px]">
        <MagnifyingGlass className="h-[18px] w-[18px] flex-shrink-0 text-muted-foreground" />
        <Command.Input
          autoFocus
          value={query}
          onValueChange={setQuery}
          placeholder="Buscar documentos..."
          className="w-full bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      <Command.List className="scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent max-h-72 overflow-y-auto p-2.5">
        {!isLoading && query.trim() && searchResults.length === 0 && (
          <div className="px-3.5 py-6 text-center text-sm text-muted-foreground">
            Nenhum documento encontrado.
          </div>
        )}

        {searchResults.map(({ document, matchedIn, excerpt }) => (
          <Command.Item
            key={document.id}
            value={document.id}
            onSelect={() => handleOpenDocument(document.id)}
            className="flex items-center gap-3 rounded-md px-3.5 py-3 text-sm text-foreground aria-selected:bg-accent"
          >
            <FileText className="h-[17px] w-[17px] flex-shrink-0" />
            <span className="flex flex-1 flex-col gap-0.5 truncate">
              <span className="truncate font-semibold">{document.title}</span>
              <span className="truncate text-xs text-muted-foreground">
                {matchedIn === 'content'
                  ? excerpt
                  : `Documento · ${formatRelativeTime(document.updatedAt)}`}
              </span>
            </span>
          </Command.Item>
        ))}

        <Command.Item
          value="criar-novo-documento"
          onSelect={handleCreateDocument}
          className="flex items-center gap-3 rounded-md px-3.5 py-3 text-sm text-foreground aria-selected:bg-accent"
        >
          <FilePlus className="h-[17px] w-[17px] flex-shrink-0" />
          Criar novo documento
        </Command.Item>
      </Command.List>

      <div className="flex items-center gap-3.5 border-t border-border px-[18px] py-3">
        <span className="font-mono text-[11px] text-muted-foreground">
          Enter abre
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">
          Esc fecha
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">
          ↑↓ navega
        </span>
      </div>
    </Command.Dialog>
  )
}
