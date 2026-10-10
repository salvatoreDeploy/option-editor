import { ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAuthStatus } from '../api/fetchAuthStatus'
import { Lock } from '../pages/lock'

interface AuthGateProps {
  children: ReactNode
}

/**
 * Decide entre mostrar a tela de bloqueio (`Lock`) ou o app inteiro,
 * substituindo a árvore inteira em vez de ser "mais uma rota" — ver spec
 * 010j-local-profile, DEC-003.
 */
export function AuthGate({ children }: AuthGateProps) {
  const queryClient = useQueryClient()

  const { data: status } = useQuery({
    queryKey: ['auth-status'],
    queryFn: fetchAuthStatus,
  })

  if (!status) return null

  if (status.hasPassword && !status.isUnlocked) {
    return (
      <Lock
        onUnlocked={() =>
          queryClient.invalidateQueries({ queryKey: ['auth-status'] })
        }
      />
    )
  }

  return <>{children}</>
}
