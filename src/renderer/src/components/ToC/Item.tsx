import { ReactNode } from 'react'

interface ToCItemProps {
  children: ReactNode
  onClick?: () => void
}

export function ToCItem({ children, onClick }: ToCItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="truncate text-left text-[13px] leading-snug text-muted-foreground hover:text-foreground"
    >
      {children}
    </button>
  )
}
