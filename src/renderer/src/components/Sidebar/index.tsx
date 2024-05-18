import * as Navigation from './Navigation'
import clsx from 'clsx'
import { CaretDoubleLeft } from 'phosphor-react'
import { CreatePage } from './CreatePage'
import { Profile } from './Profile'
import { Search } from './Search'
import * as Collapsible from '@radix-ui/react-collapsible'
import { useQuery } from '@tanstack/react-query'
import { getDocuments } from '../../api/getDocuments'

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function Sidebar() {
  const navigate = useNavigate()

  const isMacOS = process.platform === 'darwin'

  const { data: result } = useQuery({
    queryKey: ['documents'],
    queryFn: () => getDocuments(),
  })

  async function getDocumentsfn() {
    try {
      const response = await getDocuments()

      window.api.onGetDocumentRequest(response)
    } catch (error) {
      console.error('Erro ao buscar e lidar com documentos:', error)
      throw new Error('Erro ao buscar e lidar com documentos')
    }
  }

  getDocumentsfn()

  useEffect(() => {
    window.api.onOpenDocumentRequest((documentId) => {
      navigate(`/document/${documentId}`)
    })
  }, [])

  return (
    <Collapsible.Content className="bg-rotion-800 flex-shrink-0 border-r border-rotion-600 h-screen relative group data-[state=open]:animate-slideIn data-[state=closed]:animate-slideOut overflow-hidden">
      <Collapsible.Trigger
        className={clsx(
          'absolute h-5 w-5 right-4 text-rotion-200 hover:text-rotion-50 inline-flex items-center justify-center',
          {
            'top-[1.125rem]': isMacOS,
            'top-6': !isMacOS,
          },
        )}
      >
        <CaretDoubleLeft className="h-4 w-4" />
      </Collapsible.Trigger>

      <div
        className={clsx('region-drag h-14', {
          block: isMacOS,
          hidden: !isMacOS,
        })}
      ></div>

      <div
        className={clsx(
          'flex-1 flex flex-col gap-8 h-full w-[240px] group-data-[state=open]:opacity-100 group-data-[state=closed]:opacity-0 transition-opacity duration-200',
          {
            'pt-6': !isMacOS,
          },
        )}
      >
        <Profile />
        <Search />

        <Navigation.Root>
          <Navigation.Section>
            <Navigation.SectionTitle>Workspace</Navigation.SectionTitle>
            <Navigation.SectionContent>
              {result &&
                result.map((document) => {
                  return (
                    <Navigation.Link
                      to={`/document/${document.id}`}
                      key={document.id}
                    >
                      {document.title}
                    </Navigation.Link>
                  )
                })}
            </Navigation.SectionContent>
          </Navigation.Section>
        </Navigation.Root>

        <CreatePage />
      </div>
    </Collapsible.Content>
  )
}
