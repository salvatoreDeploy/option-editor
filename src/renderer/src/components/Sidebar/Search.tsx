import { MagnifyingGlass } from 'phosphor-react'
import { useSearchDialog } from '../../contexts/SearchDialogContext'

export function Search() {
  const { open } = useSearchDialog()

  return (
    <button
      onClick={open}
      className="flex items-center gap-2.5 rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-muted-foreground hover:border-ring"
    >
      <MagnifyingGlass className="h-4 w-4 flex-shrink-0" />
      <span className="flex-1 text-left">Buscar documentos...</span>
    </button>
  )
}
