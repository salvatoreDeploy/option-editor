/* eslint-disable @typescript-eslint/no-unused-vars */
import { useParams } from 'react-router-dom'
import { Editor, OnContentUpdatedParams } from '../components/Editor'
import { ToC } from '../components/ToC'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchDocument } from '../api/fetchDocument'
import { useMemo } from 'react'
import { saveStateDocument } from '../api/saveStateDocument'
import { Document as DocumentIPC } from '~/src/shared/types/ipc'

export function Document() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const idDocument = id ?? ''

  const { data: result, isFetching } = useQuery({
    queryKey: ['document', id],
    queryFn: () => fetchDocument(idDocument),
  })

  const { mutateAsync: saveStateDocumentFn } = useMutation({
    mutationFn: ({ title, content }: OnContentUpdatedParams) =>
      saveStateDocument(idDocument, title, content),
    onSuccess(_data, { title, content }, __context) {
      queryClient.setQueryData<DocumentIPC[]>(['documents'], (documents) => {
        return documents?.map((document) => {
          if (document.id === idDocument) {
            return { ...document, title }
          }
          return document
        })
      })
    },
  })

  const initialContent = useMemo(() => {
    if (result) {
      return `<h1>${result.title}</h1>${result.content ?? '<p></p>'}`
    }

    return ''
  }, [result])

  function handleEditorContentUpdated({
    title,
    content,
  }: OnContentUpdatedParams) {
    saveStateDocumentFn({ title, content })
  }

  /* console.log(result) */

  return (
    <main className="flex-1 flex py-12 px-10 gap-8">
      <aside className="hidden lg:block sticky top-0">
        <span className="text-rotion-300 font-bold text-xs ">
          TABLE OF CONTENTS
        </span>

        <ToC.Root>
          <ToC.Link>Back-end</ToC.Link>
          <ToC.Section>Banco de Dados</ToC.Section>
        </ToC.Root>
      </aside>

      <section className="flex-1 flex flex-col items-center">
        {!isFetching && result && (
          <Editor
            onContentUpdated={handleEditorContentUpdated}
            content={initialContent}
          />
        )}
      </section>
    </main>
  )
}
