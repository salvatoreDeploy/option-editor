import { Outlet } from 'react-router-dom'
import { Header } from '../../components/Header'
import { Sidebar } from '../../components/Sidebar'
import { SearchBar } from '../../components/SearchBar'
import { UndoToast } from '../../components/UndoToast'
import * as Collapsible from '@radix-ui/react-collapsible'
import { useState } from 'react'
import {
  SearchDialogProvider,
  useSearchDialog,
} from '../../contexts/SearchDialogContext'
import { UndoToastProvider } from '../../contexts/UndoToastContext'
import { ThemeProvider } from '../../contexts/ThemeContext'

function AppSearchBar() {
  const { isOpen, setIsOpen } = useSearchDialog()

  return <SearchBar open={isOpen} onOpenChange={setIsOpen} />
}

export function Default() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)

  return (
    <ThemeProvider>
      <SearchDialogProvider>
        <UndoToastProvider>
          <Collapsible.Root
            defaultOpen={true}
            onOpenChange={setIsSidebarOpen}
            className="h-screen w-screen bg-background text-foreground flex font-sans"
          >
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen min-h-0 overflow-hidden">
              <Header isSidebarOpen={isSidebarOpen} />

              <Outlet />
            </div>

            <AppSearchBar />
            <UndoToast />
          </Collapsible.Root>
        </UndoToastProvider>
      </SearchDialogProvider>
    </ThemeProvider>
  )
}
