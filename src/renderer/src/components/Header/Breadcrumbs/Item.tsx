import { ReactNode } from 'react'
import clsx from 'clsx'

interface ItemProps {
  isActive?: boolean
  children: ReactNode
}

export function Item({ isActive = false, children }: ItemProps) {
  return (
    <span
      className={clsx('inline-flex items-center gap-2', {
        'font-semibold text-foreground': isActive,
        'text-muted-foreground': !isActive,
      })}
    >
      {children}
    </span>
  )
}
