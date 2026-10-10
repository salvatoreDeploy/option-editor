# Spec 007 — UX Essentials — Requirements

## Estado

`done`

## Sizing

`Complex`

## Problema

O uso diário tem pontos ásperos (tela vazia sem orientação, criação de documento sem foco claro, busca sem estado vazio, sem loading states consistentes, acessibilidade e responsividade não revisadas) **e** o visual atual do app (paleta `rotion-*` roxa, fonte Roboto) ficou defasado em relação ao design definido em `openeditor.pen`, que já cobre um design system completo (estilo shadcn/ui, tema escuro neutro) para todas as telas principais.

## Objetivo

Depende de `006-domain-organization` (breadcrumb com dado real) e `008-editor-refactor` (extração de título/ToC via ProseMirror). Com o Pencil MCP conectado, esta spec foi expandida (decisão do usuário em 2026-09-14) para cobrir a migração completa de design — tokens, fonte e reconstrução visual de Sidebar, Header, Editor (com Inspector Panel novo), busca e diálogos — além dos itens comportamentais originais.

## Fora De Escopo

- Novas funcionalidades de produto (spec `010-controlled-expansion`).
- Telas de Login/Perfil/Configurações (`Screen / Login`, `Screen / Profile`, `Screen / Settings` no Pencil) — já registradas como feature futura na Sprint 8 do `BACKLOG.md`.
- `Document Row` (componente do kit) — não aparece em nenhuma tela atual do Pencil; fica disponível para uma futura tela de listagem, não é usado nesta spec.

## Requisitos

| ID | Descrição | Origem |
|---|---|---|
| `REQ-001` | Criar uma tela vazia (nenhum documento aberto) que oriente o usuário sobre o que fazer, seguindo `Screen / Empty State` do Pencil | Explícito (BACKLOG Sprint 5) |
| `REQ-002` | Melhorar a criação de documento, garantindo foco correto no novo documento | Explícito (BACKLOG Sprint 5) |
| `REQ-003` | Adicionar edição clara de título — já resolvido em parte pela spec `008` (heading do Tiptap com placeholder "Sem título"); confirmar que cobre a intenção do design | Explícito (BACKLOG Sprint 5) |
| `REQ-004` | Atualizar breadcrumb com o título real — já implementado na spec `006`; restilizar para bater com `Breadcrumbs` do Pencil (Workspace / documento atual) | Explícito (BACKLOG Sprint 5) |
| `REQ-005` | Melhorar a busca rápida seguindo `Screen / Quick Search` (Command Dialog: ícone, resultado com subtítulo, rodapé de atalhos de teclado) | Explícito (BACKLOG Sprint 5) |
| `REQ-006` | Adicionar estado vazio na busca (sem resultados) | Explícito (BACKLOG Sprint 5) |
| `REQ-007` | Adicionar loading states consistentes (lista de documentos, documento sendo aberto) usando `Badge/Status` do Pencil | Explícito (BACKLOG Sprint 5) |
| `REQ-008` | Revisar acessibilidade básica de botões e diálogos (foco, aria-label, navegação por teclado) | Explícito (BACKLOG Sprint 5) |
| `REQ-009` | Revisar responsividade mínima da janela (redimensionamento) | Explícito (BACKLOG Sprint 5) |
| `REQ-010` | Migrar tokens de design (cor, fonte, raio, espaçamento) do Tailwind para os valores de `openeditor.pen` (paleta shadcn neutra, fontes Geist/Geist Mono) | Explícito (achado ao consultar o Pencil, 2026-09-14) |
| `REQ-011` | Reconstruir a `Sidebar` seguindo o Pencil: bloco de marca (logo + nome), busca inline, navegação/lista de documentos, rodapé com aviso de armazenamento local | Explícito (achado ao consultar o Pencil) |
| `REQ-012` | Reconstruir o `Header` do editor seguindo `Editor Header`: breadcrumbs + ações (status de salvamento como badge, botão "Mais", botão "Excluir") | Explícito (achado ao consultar o Pencil) |
| `REQ-013` | Restilizar o diálogo de exclusão (já funcional desde a spec `003`) para bater com `Screen / Delete Confirmation` (ícone destrutivo, resumo do documento) | Explícito (achado ao consultar o Pencil) |
| `REQ-014` | Implementar `Table of Contents` real (headings do documento atual), substituindo o conteúdo fixo `Back-end`/`Banco de Dados` já registrado como achado na spec `006` | Explícito (achado ao consultar o Pencil; já estava no BACKLOG como pendência da spec `008`) |
| `REQ-015` | Adicionar `Inspector Panel` (novo, não existe hoje): contagem de palavras, quando foi salvo, origem ("Local"), atalho de criação | Explícito (achado ao consultar o Pencil) |

## Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| `NFR-001` | Todo valor de cor/raio/espaçamento novo deve vir de uma variável Tailwind baseada nos tokens do Pencil, não de valores soltos repetidos pelo código |
| `NFR-002` | Nenhuma melhoria de UX pode reintroduzir os problemas já corrigidos nas specs `003`-`006` (ex. side-effects em render) |
| `NFR-003` | A migração visual não pode quebrar nenhum fluxo funcional já validado (criar, editar, salvar, buscar, excluir) |

## Restrições

- Fonte `Geist`/`Geist Mono` precisa ser carregada (Google Fonts já é usado no projeto para Roboto; mesma abordagem via `<link>` ou self-host, o que for mais simples de manter).
- Reaproveitar a paleta `rotion-*` só onde não conflitar visualmente; o objetivo é migrar para os tokens novos, não manter as duas paletas coexistindo indefinidamente.

## Critérios De Aceite

| ID | Critério |
|---|---|
| `AC-001` | Usuário entende o que fazer ao abrir o app sem nenhum documento |
| `AC-002` | Documento criado recebe foco correto (cursor pronto para digitar) |
| `AC-003` | Busca e navegação funcionam de forma fluida, com estado vazio quando não há resultado |
| `AC-004` | Header/breadcrumb mostram informações reais do documento aberto |
| `AC-005` | Botões e diálogos são operáveis via teclado |
| `AC-006` | Cores, fonte e raio usados no app vêm dos tokens migrados de `openeditor.pen`, sem cor/fonte solta divergente |
| `AC-007` | ToC mostra os headings reais do documento aberto, não texto fixo |

## Riscos

| ID | Risco | Mitigação |
|---|---|---|
| `RISK-001` | Migração de tokens pode deixar telas com aparência inconsistente pela metade | Migrar tokens primeiro (fundação), depois reconstruir cada área visível (Sidebar, Header, Editor, diálogos) antes de considerar a spec concluída — não deixar metade do app na paleta antiga |
| `RISK-002` | `Inspector Panel` é funcionalidade nova (não só reskin) — pode expandir escopo além do previsto | Implementar só os 4 campos vistos no Pencil (palavras, salvo, origem, atalho), sem adicionar campos extras não desenhados |
