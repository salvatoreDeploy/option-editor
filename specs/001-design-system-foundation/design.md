# Spec 001 — Design System Foundation Design

## Estado

`done`

## Resultado

O arquivo `openeditor.pen` contém tokens visuais, componentes reutilizáveis e telas base para orientar a refatoração da UI do OptionEditor.

Telas criadas:

- `Screen / Empty State`
- `Screen / Document Editor`
- `Screen / Quick Search`
- `Screen / Delete Confirmation`
- `Screen / System States`

Componentes criados:

- `Button/Primary`
- `Button/Secondary`
- `Button/Ghost`
- `Button/Destructive`
- `Input/Search`
- `Badge/Status`
- `Sidebar Item`
- `Document Row`
- `Dialog/Base`

## Resumo Técnico

Será criado um design-kit no Pencil com tokens inspirados em shadcn/ui e telas principais para guiar a refatoração da UI React.

## Arquivos Afetados

- `openeditor.pen`
- `specs/001-design-system-foundation/requirements.md`
- `specs/001-design-system-foundation/design.md`
- `specs/001-design-system-foundation/tasks.md`

## Decisões Técnicas

| ID | Decisão | Motivo |
|---|---|---|
| `DEC-001` | Usar estética shadcn-like com neutros, bordas sutis e ações claras | Compatível com Tailwind e Radix |
| `DEC-002` | Criar componentes reutilizáveis no Pencil antes das telas | Facilita consistência visual |
| `DEC-003` | Priorizar desktop 1200x760 | O app atual é Electron desktop |
| `DEC-004` | Representar estados críticos como telas/superfícies explícitas | Facilita implementação posterior |

## Contratos Visuais

- `Button/Primary`
- `Button/Secondary`
- `Button/Ghost`
- `Button/Destructive`
- `Input/Search`
- `Badge/Status`
- `Document Row`
- `Dialog`
- `Sidebar Item`

## Impactos Esperados Na Implementação

- Renderer poderá ser refatorado para componentes menores e consistentes.
- Estados de erro, loading e salvamento passam a ter referência visual.
- Exclusão de documentos passa a usar confirmação clara.
- Sidebar e busca rápida terão hierarquia mais previsível.

## Plano De Validação

- Usar `snapshot_layout` para verificar clipping e estrutura.
- Usar screenshot das telas principais para validar contraste e alinhamento.
