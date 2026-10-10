import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { createDocument } from '../api/createDocument'
import { Document } from '@shared/types/ipc'

export function useCreateDocument() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: createDocument,
    onSuccess: (data) => {
      queryClient.setQueryData<Document[]>(['documents'], (documents) => {
        if (documents && documents.length >= 0) {
          return [...documents, data]
        }

        return [data]
      })

      navigate(`/document/${data.id}`)
    },
  })
}
