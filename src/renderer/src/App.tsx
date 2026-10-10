import './styles/global.css'
import { Routes } from './Routes'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/react-query'
import { AuthGate } from './components/AuthGate'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate>
        <Routes />
      </AuthGate>
    </QueryClientProvider>
  )
}
