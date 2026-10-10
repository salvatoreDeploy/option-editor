# Spec 010b — Trash / Recovery — Tasks

## Estado

`done`

## Tarefas

- [x] `TASK-001`: Adicionar `deletedAt?: string` a `Document` e o par `RestoreDocumentRequest`/`RestoreDocumentResponse`.
  - Refs: `REQ-001`, `REQ-005`.
  - Verificação: `npx tsc --noEmit` — ok.

- [x] `TASK-002`: Adicionar `IPC.DOCUMENTS.RESTORE` em `src/shared/constants/ipc.ts`.
  - Refs: `REQ-005`.
  - Verificação: revisão de código.

- [x] `TASK-003`: Transformar o handler `DELETE` em soft-delete.
  - Refs: `REQ-001`, `AC-001`, `DEC-001`.
  - Verificação: revisão de código — `store.set` com `deletedAt`, não mais remoção da chave.

- [x] `TASK-004`: Filtrar `deletedAt` em `FETCH_ALL` e `FETCH`.
  - Refs: `REQ-002`, `AC-001`, `AC-005`, `DEC-002`.
  - Verificação: revisão de código.

- [x] `TASK-005`: Criar handler `RESTORE` (limpa `deletedAt`).
  - Refs: `REQ-005`, `AC-003`.
  - Verificação: revisão de código.

- [x] `TASK-006`: Expor `restoreDocument` no preload e criar `src/renderer/src/api/restoreDocument.ts`.
  - Refs: `REQ-005`.
  - Verificação: `npx tsc --noEmit` — ok.

- [x] `TASK-007`: Criar `UndoToastContext` + componente `UndoToast`.
  - Refs: `REQ-003`, `NFR-001`, `DEC-003`, `DEC-004`, `RISK-002`.
  - Verificação: revisão de código — `UNDO_WINDOW_MS = 6000`, timer com cleanup em `useEffect`/na troca de toast; toast é um elemento posicionado (`fixed`), não um modal — não bloqueia o resto da tela.

- [x] `TASK-008`: Renderizar o provider/toast em `default.tsx`, disparar do `Header` após excluir com sucesso.
  - Refs: `REQ-003`, `REQ-004`, `AC-002`, `AC-003`, `AC-004`, `DEC-005`.
  - Verificação: revisão de código. Texto do `AlertDialog.Description` de exclusão atualizado (não dizia mais "não pode ser desfeita", já que agora pode).

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
