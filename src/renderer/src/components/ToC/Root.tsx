import clsx from 'clsx'
import { ReactNode } from 'react'

interface ToCRootProps {
  children: ReactNode
  className?: string
}

export function ToCRoot({ children, className }: ToCRootProps) {
  return (
    <div
      className={clsx('flex w-[150px] flex-shrink-0 flex-col gap-3', className)}
    >
      <span className="text-[11px] font-bold text-muted-foreground">
        Neste documento
      </span>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}
