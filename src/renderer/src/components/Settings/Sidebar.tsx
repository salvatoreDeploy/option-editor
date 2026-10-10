import { ArrowLeft, Database, Gear, Keyboard, NotePencil } from 'phosphor-react'
import { Brand } from '../Sidebar/Brand'
import { NavItem } from './NavItem'
import { SettingsSection } from '../../pages/settings'

interface SettingsSidebarProps {
  onNavigate: (section: SettingsSection) => void
  onBack: () => void
}

export function SettingsSidebar({ onNavigate, onBack }: SettingsSidebarProps) {
  return (
    <aside className="flex h-screen w-[280px] flex-shrink-0 flex-col gap-5 border-r border-border bg-sidebar px-4 py-6">
      <Brand />

      <div className="flex flex-col gap-2">
        <span className="px-1 text-[11px] font-bold text-muted-foreground">
          Configurações
        </span>

        <NavItem
          icon={<Gear className="h-4 w-4 flex-shrink-0" />}
          onClick={() => onNavigate('general')}
        >
          Geral
        </NavItem>
        <NavItem
          icon={<NotePencil className="h-4 w-4 flex-shrink-0" />}
          onClick={() => onNavigate('editor')}
        >
          Editor
        </NavItem>
        <NavItem
          icon={<Keyboard className="h-4 w-4 flex-shrink-0" />}
          onClick={() => onNavigate('shortcuts')}
        >
          Atalhos
        </NavItem>
        <NavItem
          icon={<Database className="h-4 w-4 flex-shrink-0" />}
          onClick={() => onNavigate('local-data')}
        >
          Dados locais
        </NavItem>
      </div>

      <div className="flex-1" />

      <button
        type="button"
        onClick={onBack}
        className="flex items-center justify-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:opacity-90"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar aos documentos
      </button>
    </aside>
  )
}
