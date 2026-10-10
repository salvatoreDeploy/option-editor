# Spec 010e — Configurable Shortcuts — Tasks

## Estado

`done`

## Tarefas

- [x] `TASK-001`: Adicionar `ShortcutsConfig` e os contratos de request/response ao `shared/types/ipc.ts`, e `IPC.SHORTCUTS` a `shared/constants/ipc.ts`.
  - Refs: `REQ-001`, `DEC-001`.
  - Verificação: `npx tsc --noEmit` — ok.

- [x] `TASK-002`: Adicionar `shortcuts` (com defaults) ao schema do `electron-store` em `store.ts`.
  - Refs: `REQ-001`, `NFR-001`.
  - Verificação: revisão de código — defaults iguais aos valores fixos anteriores (`CommandOrControl+1`/`CommandOrControl+K`).

- [x] `TASK-003`: Reescrever `shortcuts.ts` pra ler do store e reagir a `onDidChange`.
  - Refs: `REQ-005`, `RISK-001`, `DEC-002`.
  - Verificação: `globalShortcut.register` checado; log de erro se falhar (ex. atalho já em uso por outro app).

- [x] `TASK-004`: Handlers `FETCH`/`SAVE` de atalhos em `ipc.ts`, com validação (modificador obrigatório, sem colisão).
  - Refs: `REQ-003`, `REQ-004`, `DEC-005`.
  - Verificação: `npx tsc --noEmit` — ok.

- [x] `TASK-005`: Expor no preload e criar as funções de API no renderer.
  - Refs: `REQ-001`.
  - Verificação: `npx tsc --noEmit` — ok.

- [x] `TASK-006`: Criar `src/renderer/src/lib/keyboardShortcut.ts` (captura, formatação, comparação).
  - Refs: `REQ-002`, `REQ-003`, `DEC-004`.
  - Verificação: revisão de código.

- [x] `TASK-007`: Criar `ShortcutsDialog`.
  - Refs: `REQ-002`, `REQ-003`, `REQ-004`, `AC-001` a `AC-004`, `DEC-003`.
  - Verificação: `npm run build` — ok. Linha "Fechar modal · Esc" incluída como informação fixa, não editável (fora de escopo, ver `requirements.md`).

- [x] `TASK-008`: Adicionar entrada pro diálogo na Sidebar; atualizar `SearchBar` (listener dinâmico) e `blank.tsx` (dica dinâmica).
  - Refs: `REQ-006`, `REQ-007`, `AC-002`, `AC-005`.
  - Verificação: `npm run build` — ok.
  - Nota: achado durante a implementação — o Inspector Panel (spec `007`) também tinha "Ctrl+1" fixo numa linha "Atalho"; atualizado pra dinâmico também, mesmo não estando listado no `design.md` original desta spec (mesma categoria de "dica de atalho" do `REQ-007`).

## Validação Final

- [x] `npm run build` executado — passa (mesmo erro de tipo pré-existente e não relacionado ao ícone).
- [x] `npm run lint` executado — 0 erros, 0 warnings.
- [x] Fluxo manual afetado validado (`AC-001` a `AC-005`).
- [x] Spec atualizada com decisões finais.

## Registro De Execução

| Data | Tarefa | Resultado |
|---|---|---|
| 2026-09-19 | `TASK-001` a `TASK-008` | Implementadas. `npm run build`, `npm run lint` e `tsc --noEmit` passam sem novos erros. |
| 2026-09-19 | Validação manual | Usuário confirmou: "testado e aprovado". Spec concluída. |
