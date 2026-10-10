import clsx from 'clsx'
import { ReactNode } from 'react'

interface RootProps {
  children: ReactNode
  className?: string
}

export function Root({ className, ...props }: RootProps) {
  return <nav className={clsx('flex flex-col gap-6', className)} {...props} />
}
