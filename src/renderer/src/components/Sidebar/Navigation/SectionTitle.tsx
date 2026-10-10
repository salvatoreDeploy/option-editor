import { ReactNode } from 'react'

interface SectionTitleProps {
  children: ReactNode
}

export function SectionTitle(props: SectionTitleProps) {
  return (
    <div
      className="px-1 text-[11px] font-bold text-muted-foreground"
      {...props}
    />
  )
}
