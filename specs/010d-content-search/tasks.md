# Spec 010d — Content Search — Tasks

## Estado

`done`

## Tarefas

- [x] `TASK-001`: Criar `src/renderer/src/lib/searchDocuments.ts`.
  - Refs: `REQ-001`, `REQ-002`, `REQ-004`, `DEC-001`, `DEC-002`, `DEC-003`, `DEC-004`, `RISK-001`.
  - Verificação: `npx tsc --noEmit` — ok.

- [x] `TASK-002`: Criar `src/renderer/src/lib/formatRelativeTime.ts`.
  - Refs: `REQ-003`, `DEC-005`.
  - Verificação: `npx tsc --noEmit` — ok.

- [x] `TASK-003`: Atualizar `SearchBar` para busca controlada (`shouldFilter={false}`, `searchDocuments`, subtítulo dinâmico por resultado).
  - Refs: `REQ-001`, `REQ-002`, `REQ-003`, `REQ-004`, `AC-001` a `AC-005`.
  - Verificação: `npm run build`/`npm run lint` — ok.
  - Nota: como o filtro passou a ser próprio (`shouldFilter={false}`), o `Command.Empty` do `cmdk` deixou de funcionar (com `shouldFilter=false`, o `filtered.count` interno do cmdk conta todos os itens montados, não os visíveis — nunca chegaria a zero, já que "Criar novo documento" sempre está montado). Substituído por uma condição própria (`query.trim() && searchResults.length === 0`).

## Validação Final

- [x] `npm run build` executado — passa (mesmo erro de tipo pré-existente e não relacionado ao ícone).
- [x] `npm run lint` executado — 0 erros, 0 warnings.
- [x] Fluxo manual afetado validado (`AC-001` a `AC-005`).
- [x] Spec atualizada com decisões finais.

## Registro De Execução

| Data | Tarefa | Resultado |
|---|---|---|
| 2026-09-19 | `TASK-001` a `TASK-003` | Implementadas. `npm run build`, `npm run lint` e `tsc --noEmit` passam sem novos erros. |
| 2026-09-19 | Validação manual | Usuário confirmou: "testado e aprovado". Spec concluída. |
