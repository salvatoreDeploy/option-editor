import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { importMarkdown } from '../api/importMarkdown'
import { createDocument } from '../api/createDocument'
import { saveDocument } from '../api/saveDocument'
import { markdownToHtml } from '../lib/markdownToHtml'
import { Document } from '@shared/types/ipc'

/**
 * Importa um arquivo `.md`: lê o arquivo (main, via diálogo nativo), converte
 * pro formato interno do editor e reaproveita o fluxo de criar + salvar
 * documento já existente (`useCreateDocument`) — ver spec
 * 010h-markdown-import, DEC-004. Cancelar o diálogo resolve como `null`, sem
 * criar nada.
 */
export function useImportMarkdown() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (): Promise<Document | null> => {
      const result = await importMarkdown()

      if (result.canceled || result.content === undefined) {
        return null
      }

      const { title, content } = markdownToHtml(
        result.content,
        result.fileName ?? 'Sem título',
      )

      const created = await createDocument()

      return saveDocument(created.id, title, content)
    },
    onSuccess: (data) => {
      if (!data) return

      queryClient.setQueryData<Document[]>(['documents'], (documents) => {
        if (documents && documents.length >= 0) {
          return [...documents, data]
        }

        return [data]
      })

      navigate(`/document/${data.id}`)
    },
    onError: (error) => {
      console.error('Erro ao importar Markdown:', error)
    },
  })
}
