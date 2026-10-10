import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Document } from '@shared/types/ipc'
import { renameDocument } from '../api/renameDocument'
import { duplicateDocument } from '../api/duplicateDocument'
import { toggleFavoriteDocument } from '../api/toggleFavoriteDocument'

export function useDocumentActions() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  function patchDocument(document: Document) {
    queryClient.setQueryData<Document>(['document', document.id], (doc) =>
      doc ? { ...doc, ...document } : doc,
    )
    queryClient.setQueryData<Document[]>(['documents'], (documents) =>
      documents?.map((existing) =>
        existing.id === document.id ? { ...existing, ...document } : existing,
      ),
    )
  }

  const rename = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      renameDocument(id, title),
    onSuccess: patchDocument,
    onError(error) {
      console.error('Erro ao renomear documento:', error)
    },
  })

  const duplicate = useMutation({
    mutationFn: (id: string) => duplicateDocument(id),
    onSuccess: (duplicated) => {
      queryClient.setQueryData<Document[]>(['documents'], (documents) =>
        documents ? [...documents, duplicated] : documents,
      )
      navigate(`/document/${duplicated.id}`)
    },
    onError(error) {
      console.error('Erro ao duplicar documento:', error)
    },
  })

  const toggleFavorite = useMutation({
    mutationFn: (id: string) => toggleFavoriteDocument(id),
    onSuccess: patchDocument,
    onError(error) {
      console.error('Erro ao favoritar documento:', error)
    },
  })

  return { rename, duplicate, toggleFavorite }
}
