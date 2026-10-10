import { FileText, Gear, User } from 'phosphor-react'
import { useNavigate } from 'react-router-dom'
import { Brand } from '../Sidebar/Brand'
import { NavItem } from '../Settings/NavItem'

export function ProfileSidebar() {
  const navigate = useNavigate()

  return (
    <aside className="flex h-screen w-[280px] flex-shrink-0 flex-col gap-5 border-r border-border bg-sidebar px-4 py-6">
      <Brand />

      <div className="flex flex-col gap-2">
        <span className="px-1 text-[11px] font-bold text-muted-foreground">
          Conta
        </span>

        <NavItem
          icon={<User className="h-4 w-4 flex-shrink-0" />}
          onClick={() => navigate('/profile')}
        >
          Perfil
        </NavItem>
        <NavItem
          icon={<Gear className="h-4 w-4 flex-shrink-0" />}
          onClick={() => navigate('/settings')}
        >
          Configurações
        </NavItem>
        <NavItem
          icon={<FileText className="h-4 w-4 flex-shrink-0" />}
          onClick={() => navigate('/')}
        >
          Documentos
        </NavItem>
      </div>
    </aside>
  )
}
