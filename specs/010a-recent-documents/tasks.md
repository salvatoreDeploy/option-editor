# Spec 010a — Recent Documents — Tasks

## Estado

`done`

## Tarefas

- [x] `TASK-001`: Adicionar `updatedAt?: string` ao tipo `Document`.
  - Refs: `REQ-001`, `DEC-001`.
  - Verificação: `npx tsc --noEmit` — ok.

- [x] `TASK-002`: Preencher `updatedAt` no handler `CREATE` de `ipc.ts`.
  - Refs: `REQ-002`.
  - Verificação: revisão de código.

- [x] `TASK-003`: Preencher/atualizar `updatedAt` no handler `SAVE` de `ipc.ts`.
  - Refs: `REQ-003`.
  - Verificação: revisão de código.
  - Nota: o handler `SAVE` passou a retornar o documento salvo (`SaveDocumentResponse`, antes era `Promise<void>`) — necessário pro renderer saber o `updatedAt` real definido no main process, em vez de aproximar com um timestamp do lado do renderer (que violaria o `DEC-001`). Propagado por `preload/index.ts` e `src/renderer/src/api/saveDocument.ts` (que agora retorna o `Document`, não mais `void`).

- [x] `TASK-004`: Ordenar por `updatedAt` decrescente antes do `.slice` em `tray.ts`.
  - Refs: `REQ-004`, `AC-003`, `DEC-002`.
  - Verificação: revisão de código (`[...documents].sort(...).slice(0, 3)`).

- [x] `TASK-005`: Ordenar a lista de documentos da Sidebar por `updatedAt` decrescente.
  - Refs: `REQ-005`, `AC-001`, `DEC-002`.
  - Verificação: revisão de código (`useMemo` em `Sidebar/index.tsx`).
  - Nota: `document.tsx` foi ajustado para propagar `updatedAt` pro cache de `['document', id]` e `['documents']` assim que o salvamento é confirmado (`onSuccess` da mutation) — sem isso a Sidebar só reordenaria após um refetch manual (F5/reabrir o app), não em tempo real.

## Validação Final

- [x] `npm run build` executado — passa (mesmo erro de tipo pré-existente e não relacionado ao ícone).
- [x] `npm run lint` executado — 0 erros, 0 warnings.
- [x] Fluxo manual afetado validado (`AC-001`, `AC-002`, `AC-003`).
- [x] Spec atualizada com decisões finais.

## Registro De Execução

| Data | Tarefa | Resultado |
|---|---|---|
| 2026-09-17 | `TASK-001` a `TASK-005` | Implementadas. `npm run build`, `npm run lint` e `tsc --noEmit` passam sem novos erros. |
| 2026-09-19 | Validação manual | Usuário confirmou: "testado e aprovado". Spec concluída. |
