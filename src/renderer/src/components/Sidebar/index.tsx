import * as Navigation from './Navigation'
import clsx from 'clsx'
import {
  CaretDoubleLeft,
  Gear,
  Keyboard,
  MoonStars,
  Star,
  Sun,
  User,
} from 'phosphor-react'
import { CreatePage } from './CreatePage'
import { Brand } from './Brand'
import { Search } from './Search'
import { ShortcutsDialog } from '../ShortcutsDialog'
import * as Collapsible from '@radix-ui/react-collapsible'
import { useQuery } from '@tanstack/react-query'
import { fetchDocuments } from '../../api/fetchDocuments'
import { useTheme } from '../../contexts/ThemeContext'

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function Sidebar() {
  const navigate = useNavigate()

  const isMacOS = process.platform === 'darwin'

  const { theme, toggleTheme } = useTheme()

  const [isShortcutsDialogOpen, setIsShortcutsDialogOpen] = useState(false)

  const { data: result, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => fetchDocuments(),
  })

  const sortedDocuments = useMemo(() => {
    if (!result) return result

    return [...result].sort((a, b) => {
      const favoriteDiff = Number(!!b.favorite) - Number(!!a.favorite)
      if (favoriteDiff !== 0) return favoriteDiff

      return (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '')
    })
  }, [result])

  useEffect(() => {
    if (!result) return

    window.api.onGetDocumentRequest(result)
  }, [result])

  useEffect(() => {
    window.api.onOpenDocumentRequest((documentId) => {
      navigate(`/document/${documentId}`)
    })
  }, [navigate])

  return (
    <Collapsible.Content className="bg-sidebar flex-shrink-0 border-r border-border h-screen relative group data-[state=open]:animate-slideIn data-[state=closed]:animate-slideOut overflow-hidden">
      <Collapsible.Trigger
        aria-label="Recolher barra lateral"
        className={clsx(
          'absolute h-5 w-5 right-4 text-muted-foreground hover:text-foreground inline-flex items-center justify-center',
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
          'flex flex-col h-full w-[280px] gap-6 px-4 pb-5 group-data-[state=open]:opacity-100 group-data-[state=closed]:opacity-0 transition-opacity duration-200',
          {
            'pt-6': !isMacOS,
          },
        )}
      >
        <Brand />
        <Search />

        <Navigation.Root className="flex-1 overflow-y-auto">
          <Navigation.Section>
            <Navigation.SectionTitle>Documentos</Navigation.SectionTitle>
            <Navigation.SectionContent>
              {isLoading && (
                <p className="px-1 text-sm text-muted-foreground">
                  Carregando...
                </p>
              )}

              {sortedDocuments &&
                sortedDocuments.map((document) => {
                  return (
                    <Navigation.Link
                      to={`/document/${document.id}`}
                      key={document.id}
                      documentId={document.id}
                      documentTitle={document.title}
                      documentContent={document.content}
                      isFavorite={document.favorite}
                      icon={
                        document.favorite ? (
                          <Star
                            weight="fill"
                            className="h-4 w-4 flex-shrink-0 text-warning"
                          />
                        ) : undefined
                      }
                    >
                      {document.title}
                    </Navigation.Link>
                  )
                })}
            </Navigation.SectionContent>
          </Navigation.Section>
        </Navigation.Root>

        <div className="flex flex-col gap-3">
          <CreatePage />
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs leading-snug text-muted-foreground">
              Dados salvos localmente neste dispositivo.
            </p>
            <div className="flex flex-shrink-0 items-center gap-1">
              <button
                aria-label={
                  theme === 'dark'
                    ? 'Mudar para tema claro'
                    : 'Mudar para tema escuro'
                }
                onClick={toggleTheme}
                className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <MoonStars className="h-4 w-4" />
                )}
              </button>
              <button
                aria-label="Configurar atalhos"
                onClick={() => setIsShortcutsDialogOpen(true)}
                className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <Keyboard className="h-4 w-4" />
              </button>
              <button
                aria-label="Configurações"
                onClick={() => navigate('/settings')}
                className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <Gear className="h-4 w-4" />
              </button>
              <button
                aria-label="Perfil"
                onClick={() => navigate('/profile')}
                className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <User className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ShortcutsDialog
        open={isShortcutsDialogOpen}
        onOpenChange={setIsShortcutsDialogOpen}
      />
    </Collapsible.Content>
  )
}
