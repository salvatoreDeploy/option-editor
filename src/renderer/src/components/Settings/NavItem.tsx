import { ReactNode } from 'react'

interface NavItemProps {
  icon: ReactNode
  children: ReactNode
  onClick: () => void
}

export function NavItem({ icon, children, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
    >
      {icon}
      <span className="flex-1 truncate">{children}</span>
    </button>
  )
}
