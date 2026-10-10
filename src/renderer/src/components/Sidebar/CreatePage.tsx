import { Plus, UploadSimple } from 'phosphor-react'
import { useEffect } from 'react'
import { useCreateDocument } from '../../hooks/useCreateDocument'
import { useImportMarkdown } from '../../hooks/useImportMarkdown'

export function CreatePage() {
  const { mutate: createDocumentFn, isPending: isCreatingNewDocument } =
    useCreateDocument()

  const { mutate: importMarkdownFn, isPending: isImportingMarkdown } =
    useImportMarkdown()

  useEffect(() => {
    function onNewDocument() {
      createDocumentFn()
    }

    const unsubscribe = window.api.onNewDocumentRequest(onNewDocument)

    return () => {
      unsubscribe()
    }
  }, [createDocumentFn])

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => createDocumentFn()}
        disabled={isCreatingNewDocument}
        className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
      >
        <Plus className="h-4 w-4" />
        Novo documento
      </button>

      <button
        onClick={() => importMarkdownFn()}
        disabled={isImportingMarkdown}
        className="flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-60"
      >
        <UploadSimple className="h-4 w-4" />
        Importar Markdown
      </button>
    </div>
  )
}
