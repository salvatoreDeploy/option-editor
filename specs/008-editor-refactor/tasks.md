# Spec 008 — Editor Refactor — Tasks

## Estado

`done`

## Tarefas

- [x] `TASK-001`: Criar `parseContent.ts` com a extração de título/conteúdo a partir do estado do editor.
  - Refs: `REQ-001`, `REQ-002`, `AC-001`, `DEC-001`, `DEC-002`.
  - Aceite: função pura, sem depender de regex sobre HTML.
  - Verificação: `npx tsc --noEmit` — ok. `src/renderer/src/components/Editor/parseContent.ts` recebe `(doc, schema)` do ProseMirror (não o `Editor` completo do Tiptap/React), ficando testável sem montar um editor real.

- [x] `TASK-002`: Substituir o uso da regex em `Editor/index.tsx` pela nova função.
  - Refs: `REQ-001`, `AC-001`, `AC-002`.
  - Verificação: `npm run build`/`npm run lint` — ok. Validado pelo usuário.

- [x] `TASK-003`: Revisar `Document.extend({ content: 'heading block*' })` e garantir que o contrato é respeitado em todos os fluxos de criação/carregamento.
  - Refs: `REQ-003`, `AC-003`.
  - Verificação: revisão de código — ver seção "Revisão Do `Document.extend`" em `design.md`. Nenhuma mudança necessária, só confirmação da garantia que `parseContent.ts` já assume.

- [x] `TASK-004`: Tratar título vazio com fallback consistente.
  - Refs: `REQ-004`, `AC-004`, `DEC-003`.
  - Verificação: `EMPTY_TITLE_FALLBACK = 'Sem título'` exportado de `parseContent.ts` e reaproveitado no placeholder do editor (`DEC-004`). Validado pelo usuário.

- [x] `TASK-005`: Avaliar suporte a Markdown e code blocks.
  - Refs: `REQ-005`.
  - Verificação: avaliação registrada em `design.md` ("Avaliação De Markdown E Code Blocks"). Sem mudança de código — input rules de Markdown já vêm do `StarterKit`; conversão completa doc↔`.md` fica para a spec `010-controlled-expansion`.

- [x] `TASK-006`: Melhorar o placeholder do editor.
  - Refs: `REQ-006`.
  - Verificação: `DEC-004` — placeholder agora diferencia heading (`'Sem título'`) de blocos de corpo (`'Escreva algo...'`). Validado pelo usuário.

- [x] `TASK-007`: Revisar comportamento de autofocus.
  - Refs: `REQ-007`.
  - Verificação: `DEC-005` — `autofocus: 'end'` → `'start'`. Validado pelo usuário.

## Validação Final

- [x] `npm run build` executado — passa (mesmo erro de tipo pré-existente e não relacionado ao ícone).
- [x] `npm run lint` executado — 0 erros, 1 warning pré-existente e fora de escopo.
- [x] Fluxo manual afetado validado (editar título/conteúdo com formatação variada, carregar documento antigo, título vazio, placeholder, autofocus, ToC com headings reais).
- [x] Spec atualizada com decisões finais.

## Registro De Execução

| Data | Tarefa | Resultado |
|---|---|---|
| 2026-09-14 | `TASK-001` a `TASK-007` | Implementadas. `npm run build`, `npm run lint` e `tsc --noEmit` passam sem novos erros. |
| 2026-09-14 | Validação manual | Usuário confirmou a extração de título, ToC com headings reais (implementado via `007-ux-essentials`/`TASK-007`, que reconstruiu `document.tsx`), placeholder e autofocus. Spec concluída. |
