# Spec 007 — UX Essentials — Design

## Estado

`done`

## Resumo Técnico

Migração dos tokens de design (cor, fonte, raio) para os valores de `openeditor.pen`, seguida da reconstrução visual de Sidebar, Header do editor, diálogo de exclusão, busca rápida e ToC, mais a adição do Inspector Panel (novo). As melhorias comportamentais (foco, loading, a11y, responsividade) são implementadas junto, já usando o visual novo.

## Arquivos Afetados

- `src/renderer/tailwind.config.js` (tokens de cor/raio/fonte)
- `src/renderer/src/styles/global.css` (import da fonte Geist)
- `src/renderer/index.html` (preconnect/link de fonte, se necessário)
- `src/renderer/src/components/Sidebar/*` (reconstrução)
- `src/renderer/src/components/Header/*` (reconstrução)
- `src/renderer/src/components/SearchBar/index.tsx`, `Sidebar/Search.tsx` (Command Dialog)
- `src/renderer/src/components/ToC/*` (ToC real)
- `src/renderer/src/pages/blank.tsx` (tela vazia)
- `src/renderer/src/pages/document.tsx` (Inspector Panel, status de salvamento movido pro header)
- `src/renderer/src/pages/layout/default.tsx` (possível ajuste de layout de 3 colunas no editor)
- Novo: `src/renderer/src/components/Editor/getHeadings.ts` (extrair headings do doc pro ToC)

## Tokens Migrados (`openeditor.pen` → Tailwind)

| Token Pencil | Valor | Uso Tailwind proposto |
|---|---|---|
| `--background` | `#09090B` | `bg-background` |
| `--foreground` | `#FAFAFA` | `text-foreground` |
| `--card` | `#0F0F11` | `bg-card` |
| `--card-foreground` | `#FAFAFA` | `text-card-foreground` |
| `--popover` | `#0F0F11` | `bg-popover` |
| `--popover-foreground` | `#FAFAFA` | `text-popover-foreground` |
| `--primary` | `#FAFAFA` | `bg-primary` |
| `--primary-foreground` | `#09090B` | `text-primary-foreground` |
| `--secondary` | `#18181B` | `bg-secondary` |
| `--secondary-foreground` | `#FAFAFA` | `text-secondary-foreground` |
| `--muted` | `#18181B` | `bg-muted` |
| `--muted-foreground` | `#A1A1AA` | `text-muted-foreground` |
| `--accent` | `#27272A` | `bg-accent` |
| `--accent-foreground` | `#FAFAFA` | `text-accent-foreground` |
| `--destructive` | `#EF4444` | `bg-destructive` |
| `--destructive-foreground` | `#FFFFFF` | `text-destructive-foreground` |
| `--success` | `#22C55E` | `text-success`/`bg-success` |
| `--warning` | `#F59E0B` | `text-warning`/`bg-warning` |
| `--border` | `#27272A` | `border-border` |
| `--input` | `#27272A` | `border-input` |
| `--ring` | `#D4D4D8` | `ring-ring` |
| `--radius-sm/md/lg` | `6/8/12` | `rounded-sm/md/lg` |
| `--space-2..8` | `8/12/16/24/32` | espaçamento via classes padrão do Tailwind (`2`=0.5rem já bate por padrão; conferir na config) |
| `--font-sans` | `Geist` | `font-sans` |
| `--font-mono` | `Geist Mono` | `font-mono` |

`rotion-*` é removido do `tailwind.config.js` depois que nenhum componente mais o referenciar (`RISK-001`: migrar tudo antes de remover, não deixar telas mistas).

## Decisões Técnicas

| ID | Decisão | Motivo |
|---|---|---|
| `DEC-001` | Tokens entram no Tailwind como cores nomeadas (`theme.extend.colors.background`, etc.), lendo de CSS custom properties (`:root { --background: #09090B; ... }`) em vez de hex direto no config | Permite eventualmente suportar tema claro/escuro (Sprint 8) trocando só as CSS vars, sem reescrever classes |
| `DEC-002` | Fonte Geist carregada via Google Fonts (mesma abordagem já usada pro Roboto em `index.html`), não self-hosted | Consistente com o padrão já existente no projeto; evita configurar pipeline de fontes local |
| `DEC-003` | Badge de status de salvamento (`Salvo`/`Salvando`/`Erro`) migra do corpo do editor (posição atual) para o Header, ao lado dos botões "Mais"/"Excluir", como `Save Status` no Pencil | Local mais visível e consistente com o design; states de erro mais graves usam o padrão "Inline Error Example" do Pencil (banner com botão "Tentar novamente"), não cabimento no Header |
| `DEC-004` | ToC real extrai headings via `editor.state.doc.descendants`, filtrando nós do tipo `heading` além do primeiro (que é o título) | Reaproveita a mesma API do ProseMirror já usada em `parseContent.ts` (spec `008`); título (primeiro heading) não entra na lista do ToC, só sub-headings dentro do corpo — mas o schema atual (`heading block*`) só permite um heading (o título) e blocos comuns depois, sem sub-headings aninhados; ver Research Hook |
| `DEC-005` | Inspector Panel é read-only, sem interação — só exibe `Palavras`, `Salvo`, `Origem` (fixo "Local"), `Atalho` (fixo "Ctrl+1") | Nenhum desses campos precisa de estado novo: palavras vêm de contar o texto do doc, salvo vem do estado de mutation já existente, origem e atalho são estáticos (app é local, atalho já existe desde a spec `003`) |
| `DEC-006` | Command Dialog da busca reaproveita `cmdk` (já dependência), só reestilizando classes e adicionando o rodapé de atalhos e subtítulo "Documento · editado" nos itens | Não troca de lib, só visual — `cmdk` já suporta os elementos necessários (`Command.Input`, `Command.List`, `Command.Item`, `Command.Empty`) |

## Contratos

Nenhum contrato IPC muda. `OnContentUpdatedParams` inalterado. Mudança de contrato interno: `Editor` (Tiptap) passa a expor os headings do doc para o `ToC` — via um novo helper `getHeadings(doc)` chamado a partir de `document.tsx` (mesmo padrão de `parseEditorContent`).

## Alternativas Consideradas

- Manter `rotion-*` e adicionar os tokens novos em paralelo, migrando tela por tela ao longo do tempo: descartado pelo `RISK-001` — gera inconsistência visual prolongada; a spec só é considerada `done` com a migração completa.
- Self-host da fonte Geist: descartado por ora, mesma razão do `DEC-002`.

## Research Hooks

- Confirmar se `heading block*` deveria virar algo como `heading (heading | block)*` para permitir sub-headings reais dentro do corpo (necessário pro ToC ter mais de um nível). Por ora, com o schema atual, o ToC lista apenas o título — o conteúdo de exemplo do Pencil (`Visão geral`, `IPC e preload`, ...) é ilustrativo; **decisão**: manter o schema atual nesta spec (mudar o schema é escopo do `008`, já `done`) e o ToC exibe headings encontrados no corpo caso existam (nenhum hoje), sem forçar mudança de schema aqui.

## Impactos

- Renderer: praticamente todos os componentes de navegação, header e páginas principais.
- Nenhum impacto em main/preload/persistência.

## Plano De Validação

- `npm run build`
- `npm run lint`
- Fluxo manual: abrir o app sem documentos (tela vazia nova), criar documento (foco, header, inspector), buscar (Command Dialog, estado vazio), excluir (diálogo novo), redimensionar a janela, navegar só com teclado.
