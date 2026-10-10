import clsx from 'clsx'
import { DotsThreeVertical, FileText } from 'phosphor-react'
import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { DocumentActionsMenu } from '../../DocumentActionsMenu'

interface LinkProps {
  to: string
  children: ReactNode
  icon?: ReactNode
  documentId?: string
  documentTitle?: string
  documentContent?: string
  isFavorite?: boolean
}

export function Link({
  children,
  to,
  icon,
  documentId,
  documentTitle,
  documentContent,
  isFavorite,
}: LinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => {
        return clsx(
          'group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground',
          { 'bg-accent text-foreground': isActive },
        )
      }}
    >
      {icon ?? <FileText className="h-4 w-4 flex-shrink-0" />}
      <span className="flex-1 truncate">{children}</span>

      {documentId && (
        <DocumentActionsMenu
          documentId={documentId}
          documentTitle={documentTitle ?? ''}
          documentContent={documentContent}
          isFavorite={isFavorite}
          trigger={
            <button
              aria-label="Mais ações do documento"
              onClick={(event) => event.preventDefault()}
              className="invisible flex-shrink-0 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground group-hover:visible"
            >
              <DotsThreeVertical weight="bold" className="h-3.5 w-3.5" />
            </button>
          }
        />
      )}
    </NavLink>
  )
}
