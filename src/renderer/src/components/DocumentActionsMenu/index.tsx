import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import clsx from 'clsx'
import {
  CaretRight,
  CopySimple,
  DownloadSimple,
  PencilSimple,
  Star,
} from 'phosphor-react'
import { ReactNode, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useDocumentActions } from '../../hooks/useDocumentActions'
import { RenameDialog } from '../RenameDialog'
import { exportDocument } from '../../api/exportDocument'
import {
  buildHtmlDocument,
  buildMarkdownDocument,
  buildPlainTextDocument,
  sanitizeFileName,
} from '../../lib/buildExportContent'
import { ExportFormat } from '@shared/types/ipc'

interface DocumentActionsMenuProps {
  documentId: string
  documentTitle: string
  documentContent?: string
  isFavorite?: boolean
  trigger: ReactNode
  align?: 'start' | 'end'
}

const EXPORT_FORMAT_LABEL: Record<ExportFormat, string> = {
  html: 'HTML (.html)',
  md: 'Markdown (.md)',
  txt: 'Texto (.txt)',
  pdf: 'PDF (.pdf)',
}

export function DocumentActionsMenu({
  documentId,
  documentTitle,
  documentContent,
  isFavorite,
  trigger,
  align = 'end',
}: DocumentActionsMenuProps) {
  const { rename, duplicate, toggleFavorite } = useDocumentActions()
  const [isRenameOpen, setIsRenameOpen] = useState(false)

  const { mutate: exportDocumentFn } = useMutation({
    mutationFn: async (format: ExportFormat) => {
      const title = documentTitle || 'Sem título'
      const content = documentContent ?? ''
      const suggestedFileName = sanitizeFileName(title)

      const exportedContent =
        format === 'md'
          ? buildMarkdownDocument(title, content)
          : format === 'txt'
            ? buildPlainTextDocument(title, content)
            : buildHtmlDocument(title, content)

      return exportDocument({
        format,
        suggestedFileName,
        content: exportedContent,
      })
    },
    onError: (error) => {
      console.error('Erro ao exportar documento:', error)
    },
  })

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align={align}
            sideOffset={4}
            className="z-50 min-w-[164px] rounded-md border border-border bg-popover p-1 text-[13px] text-popover-foreground shadow-2xl"
          >
            <DropdownMenu.Item
              onSelect={(event) => {
                event.preventDefault()
                setIsRenameOpen(true)
              }}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 outline-none data-[highlighted]:bg-accent"
            >
              <PencilSimple className="h-3.5 w-3.5" />
              Renomear
            </DropdownMenu.Item>

            <DropdownMenu.Item
              onSelect={() => duplicate.mutate(documentId)}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 outline-none data-[highlighted]:bg-accent"
            >
              <CopySimple className="h-3.5 w-3.5" />
              Duplicar
            </DropdownMenu.Item>

            <DropdownMenu.Item
              onSelect={() => toggleFavorite.mutate(documentId)}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 outline-none data-[highlighted]:bg-accent"
            >
              <Star
                className={clsx('h-3.5 w-3.5', { 'text-warning': isFavorite })}
                weight={isFavorite ? 'fill' : 'regular'}
              />
              {isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
            </DropdownMenu.Item>

            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 outline-none data-[highlighted]:bg-accent data-[state=open]:bg-accent">
                <DownloadSimple className="h-3.5 w-3.5" />
                Exportar
                <CaretRight className="ml-auto h-3 w-3" />
              </DropdownMenu.SubTrigger>

              <DropdownMenu.Portal>
                <DropdownMenu.SubContent
                  sideOffset={4}
                  className="z-50 min-w-[164px] rounded-md border border-border bg-popover p-1 text-[13px] text-popover-foreground shadow-2xl"
                >
                  {(Object.keys(EXPORT_FORMAT_LABEL) as ExportFormat[]).map(
                    (format) => (
                      <DropdownMenu.Item
                        key={format}
                        onSelect={() => exportDocumentFn(format)}
                        className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 outline-none data-[highlighted]:bg-accent"
                      >
                        {EXPORT_FORMAT_LABEL[format]}
                      </DropdownMenu.Item>
                    ),
                  )}
                </DropdownMenu.SubContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Sub>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <RenameDialog
        open={isRenameOpen}
        onOpenChange={setIsRenameOpen}
        initialTitle={documentTitle}
        onSave={(title) => rename.mutate({ id: documentId, title })}
      />
    </>
  )
}
