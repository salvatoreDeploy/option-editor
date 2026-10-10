import { createContext, ReactNode, useContext, useState } from 'react'

interface SearchDialogContextValue {
  isOpen: boolean
  open: () => void
  setIsOpen: (isOpen: boolean) => void
}

const SearchDialogContext = createContext<SearchDialogContextValue | null>(null)

export function SearchDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <SearchDialogContext.Provider
      value={{ isOpen, open: () => setIsOpen(true), setIsOpen }}
    >
      {children}
    </SearchDialogContext.Provider>
  )
}

export function useSearchDialog(): SearchDialogContextValue {
  const context = useContext(SearchDialogContext)

  if (!context) {
    throw new Error(
      'useSearchDialog deve ser usado dentro de um SearchDialogProvider',
    )
  }

  return context
}
