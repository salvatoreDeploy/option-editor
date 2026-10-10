# Spec 004 — IPC Typing & Contracts — Tasks

## Estado

`done`

## Tarefas

- [x] `TASK-001`: Exportar `PreloadApi` de `src/preload/index.ts` e usá-lo na declaração global.
  - Refs: `REQ-001`, `REQ-002`, `AC-001`.
  - Aceite: `Window.api` tipado como `PreloadApi`, sem `unknown`.
  - Verificação: `npm run build` — ok.
  - Nota: o `declare global` precisou ficar **depois** de `export type PreloadApi = typeof api` no arquivo (não antes), porque o eslint (`no-use-before-define`) barra a referência a um tipo declarado mais abaixo no mesmo arquivo, mesmo o TypeScript permitindo.

- [x] `TASK-002`: Atualizar `src/preload/index.d.ts` para importar `PreloadApi` em vez de declarar `unknown`.
  - Refs: `REQ-001`, `AC-001`.
  - Aceite: uma única declaração de tipo para `Window.api` no projeto.
  - Verificação: `npm run build` — ok.

- [x] `TASK-003`: Tipar `FetchDocumentResponse.data` como `Document | undefined` e ajustar `document.tsx` para tratar o caso `undefined`.
  - Refs: `REQ-004`, `AC-005`, `RISK-002`.
  - Aceite: TypeScript exige tratamento do caso "documento não encontrado" em todo ponto de consumo.
  - Verificação: `npx tsc --noEmit` — sem novos erros.
  - Nota: `document.tsx` já tratava `result` como possivelmente ausente (por causa do `useQuery` do React Query); o tipo explícito em `FetchDocumentResponse` só torna essa garantia real de ponta a ponta (o handler em `src/main/ipc.ts` também foi ajustado: `store.get<string, Document | undefined>(...)`, já que a chamada podia retornar `undefined` mesmo antes, mas o tipo alegava `Document`). O estado de UI dedicado para "documento não encontrado" é tratado na spec `005-persistence-autosave` (`REQ-005` daquela spec).

- [x] `TASK-004`: Remover espaços dos valores em `src/shared/constants/ipc.ts`.
  - Refs: `REQ-003`, `AC-004`, `RISK-001`.
  - Aceite: nenhum valor de canal contém espaço; app continua funcionando (main/preload usam a mesma constante).
  - Verificação: `grep -n "': '" src/shared/constants/ipc.ts` — sem resultados. Build ok (main/preload/renderer só referenciam a constante, nunca a string literal).

- [x] `TASK-005`: Tipar explicitamente os retornos das funções em `src/renderer/src/api/*.ts`.
  - Refs: `REQ-005`, `AC-002`.
  - Aceite: cada função tem tipo de retorno explícito, sem `any` implícito.
  - Verificação: `npm run build` — ok.

- [x] `TASK-006`: Remover eslint disables de tipo que ficarem desnecessários.
  - Refs: `REQ-006`.
  - Aceite: nenhuma supressão de lint relacionada a tipos sobra sem uso real.
  - Verificação: `grep -rn "eslint-disable" src` — sem resultados (já não sobrava nenhum após a spec `003`).

- [x] `TASK-007`: Padronizar alias de import interno (`@*`) e remover usos de `~/*`.
  - Refs: `REQ-007`.
  - Aceite: nenhum import usa `~/*`; `tsconfig.json` mantém só o alias adotado.
  - Verificação: `grep -rn "from '~/" src` — sem resultados. `tsconfig.json` com só `"@*": ["./src/*"]`. As 3 ocorrências (`CreatePage.tsx`, `Header/index.tsx`, `document.tsx`) passaram a usar `@shared/types/ipc`.

## Validação Final

- [x] `npm run build` executado — passa (mesmo erro de tipo pré-existente e não relacionado ao ícone, já registrado na spec `003`/`000-foundation`).
- [x] `npm run lint` executado — 0 erros, 1 warning pré-existente e fora de escopo (`CreatePage.tsx`).
- [x] Fluxo manual afetado validado (buscar documento existente e um id inexistente).
- [x] Spec atualizada com decisões finais.

## Registro De Execução

| Data | Tarefa | Resultado |
|---|---|---|
| 2026-09-11 | `TASK-001` a `TASK-007` | Implementadas. `npm run build`, `npm run lint` e `tsc --noEmit` passam sem novos erros. |
| 2026-09-11 | Validação manual | Usuário validou rodando o app: chamadas de `window.api` (fetch/create/save/delete) continuam funcionando normalmente. Spec concluída. |
