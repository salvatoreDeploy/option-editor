# Spec 002 — Account Settings Screens Design

## Estado

`done`

## Resultado

O arquivo `openeditor.pen` contém as telas de conta e configurações alinhadas ao design-kit shadcn-like.

Telas criadas:

- `Screen / Login`
- `Screen / Profile`
- `Screen / Settings`

Decisões aplicadas:

- Login orientado a workspace local.
- Perfil com identidade local e estatísticas de documentos.
- Configurações agrupadas por geral, editor, atalhos, dados locais e zona sensível.
- Ações destrutivas representadas com estilo distinto.

## Resumo Técnico

Serão criadas três telas no Pencil para orientar futuras rotas ou dialogs do app: login, perfil e configurações.

## Arquivos Afetados

- `openeditor.pen`
- `specs/002-account-settings-screens/requirements.md`
- `specs/002-account-settings-screens/design.md`
- `specs/002-account-settings-screens/tasks.md`

## Decisões Técnicas

| ID | Decisão | Motivo |
|---|---|---|
| `DEC-001` | Login terá foco em acesso local | O projeto atual salva dados localmente |
| `DEC-002` | Perfil mostrará estatísticas locais | Dá utilidade sem depender de servidor |
| `DEC-003` | Configurações serão agrupadas por app, editor, atalhos e dados | Reflete capacidades atuais e próximas refatorações |
| `DEC-004` | Ações sensíveis usam estilo destrutivo | Mantém consistência com confirmação de exclusão |

## Contratos Visuais

- Login card centralizado.
- Perfil com sidebar e painel principal.
- Configurações com navegação lateral e seções de formulário.
- Estados de conta local e armazenamento local visíveis.

## Plano De Validação

- Criar as telas no `openeditor.pen`.
- Rodar `snapshot_layout` por tela.
- Atualizar checklist da spec.
