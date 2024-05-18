import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'phosphor-react'
import { createDocument } from '../../api/createDocument'
import { Document } from '~/src/shared/types/ipc'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function CreatePage() {
  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const { mutateAsync: createDocumentFn, isPending: isCreatingNewDocument } =
    useMutation({
      mutationFn: createDocument,
      onSuccess: (data) => {
        queryClient.setQueryData<Document[]>(['documents'], (documents) => {
          if (documents && documents?.length >= 0) {
            return [...documents, data]
          } else {
            return [data]
          }
        })

        navigate(`/document/${data.id}`)
      },
    })

  useEffect(() => {
    function onNewDocument() {
      createDocumentFn()
    }

    const unsubscribe = window.api.onNewDocumentRequest(onNewDocument)

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <button
      onClick={() => createDocumentFn()}
      disabled={isCreatingNewDocument}
      className="flex w-[240px] px-5 items-center text-sm gap-2 absolute bottom-0 left-0 right-0 py-4 border-t border-rotion-600 hover:bg-rotion-700 disabled:opacity-60"
    >
      <Plus className="h-4 w-4" />
      Criar novo documento
    </button>
  )
}
