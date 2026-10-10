# Spec 003 — Technical Stabilization — Tasks

## Estado

`done`

## Tarefas

- [x] `TASK-001`: Mover a sincronização do `Sidebar` com o tray para `useEffect`.
  - Refs: `REQ-001`, `AC-001`.
  - Subtarefas:
    - Remover a chamada direta a `getDocumentsfn()` no corpo do componente.
    - Disparar a sincronização em um `useEffect` que reage a `result` (dado do `useQuery`).
  - Aceite: nenhuma chamada IPC ocorre fora de `useEffect` ou de interação do usuário.
  - Verificação: revisar o componente e abrir o app observando os logs do processo main.
  - Nota: a implementação eliminou também a busca duplicada de documentos (antes `getDocumentsfn` chamava `getDocuments()` de novo, além do `useQuery`); agora o `useEffect` reaproveita o `result` do próprio `useQuery`.

- [x] `TASK-002`: Adicionar confirmação antes de excluir documento.
  - Refs: `REQ-002`, `AC-002`, `RISK-002`.
  - Subtarefas:
    - Instalar `@radix-ui/react-alert-dialog`.
    - Criar o diálogo de confirmação e conectar ao botão "Apagar" em `Header`.
    - Garantir que cancelar não chama `deleteDocumentFn`.
  - Aceite: exclusão só ocorre após confirmação explícita; cancelar mantém o documento.
  - Verificação: fluxo manual de exclusão (cancelar e confirmar) — validado localmente pelo usuário.

- [x] `TASK-003`: Remover `console.log(store.path)` de `src/main/store.ts`.
  - Refs: `REQ-003`, `AC-003`.
  - Aceite: nenhum log de debug no terminal do processo main ao iniciar o app.
  - Verificação: `npm run dev` e observar o terminal.

- [x] `TASK-004`: Remover o handler de teste `ipcMain.on('ping', ...)` de `src/main/index.ts`.
  - Refs: `REQ-004`, `AC-004`.
  - Aceite: canal `'ping'` não existe mais no código.
  - Verificação: `grep -r "ping" src/main`.

- [x] `TASK-005`: Renomear `shortcurts.ts` → `shortcuts.ts` e `createShortcurts` → `createShortcuts`.
  - Refs: `REQ-005`, `AC-005`.
  - Subtarefas:
    - Renomear o arquivo.
    - Renomear a função exportada.
    - Atualizar o import em `src/main/index.ts`.
  - Aceite: nenhuma ocorrência de `shortcurts`/`createShortcurts` no repositório.
  - Verificação: `grep -ri "shortcurts" src` — sem resultados.

- [x] `TASK-006`: Renomear evento `abir-documento` → `open-document`.
  - Refs: `REQ-006`, `AC-006`, `RISK-001`.
  - Subtarefas:
    - Atualizar `tray.ts` (`window.webContents.send`).
    - Atualizar `preload/index.ts` (`onOpenDocumentRequest`).
  - Aceite: nenhuma ocorrência de `abir-documento`; abrir documento pelo tray continua funcionando.
  - Verificação: `grep -r "abir-documento" src` — sem resultados. Fluxo manual pelo tray — validado localmente pelo usuário.

- [x] `TASK-007`: Renomear evento `all-documento` → `documents:tray-sync`.
  - Refs: `REQ-007`, `AC-006`, `RISK-001`.
  - Subtarefas:
    - Atualizar `tray.ts` (`ipcMain.on`).
    - Atualizar `preload/index.ts` (`onGetDocumentRequest`).
    - Atualizar o `Sidebar` (chamada feita via `useEffect` da `TASK-001`).
  - Aceite: nenhuma ocorrência de `all-documento`; o menu de "Documentos recentes" do tray continua atualizando.
  - Verificação: `grep -r "all-documento" src` — sem resultados. Fluxo manual do tray — validado localmente pelo usuário.

- [x] `TASK-008`: Remover `@ts-ignore` e `eslint-disable @typescript-eslint/ban-ts-comment` de `src/main/ipc.ts`.
  - Refs: `REQ-008`, `AC-007`, `DEC-004`.
  - Aceite: `store.delete` tipado corretamente, sem supressões de lint/TS no arquivo.
  - Verificação: `npm run build` e `npm run lint` sem erros nesse arquivo — confirmado.
  - Nota: a implementação final difere do `design.md` original — em vez de tipar a chave como `` `documents.${string}` `` para `store.delete`, o handler passou a ler `store.get('documents')`, apagar a chave via `delete documents[id]` e regravar com `store.set('documents', documents)`. Motivo: o tipo de `delete<Key extends keyof T>` da lib `conf`/`electron-store` não tem overload para strings arbitrárias (diferente de `set`, que tem `set(key: string, value: unknown): void`), então não existe forma de tipar corretamente uma chave em dot-notation para `delete`. Operar no nível do `documents` (que é `keyof StoreType`) é type-safe sem cast algum.

- [x] `TASK-009`: Remover `eslint-disable @typescript-eslint/no-unused-vars` de `src/renderer/src/pages/document.tsx`.
  - Refs: `REQ-009`, `AC-008`.
  - Aceite: import não utilizado removido ou uso corrigido; sem supressão de lint no arquivo.
  - Verificação: `npm run lint` — sem erros.
  - Nota: o problema real não era um import solto, e sim os parâmetros `content` (desestruturado e não usado) e `__context` (não usado) do `onSuccess` da mutation; removidos.

## Validação Final

- [x] `npm run build` executado — passa (mesmo erro de tipo pré-existente e não relacionado: `src/main/index.ts` não encontra tipos para `../../resources/icon.png?asset`; registrado como achado de Sprint 0 em `specs/000-foundation/tasks.md`).
- [x] `npm run lint` executado — 0 erros, 1 warning pré-existente e fora de escopo (`react-hooks/exhaustive-deps` em `CreatePage.tsx`, não coberto por nenhum `REQ` desta spec).
- [x] Fluxo manual afetado validado (criar, abrir pelo tray, editar, excluir com confirmação) — validado localmente pelo usuário.
- [x] Spec atualizada com decisões finais.

## Registro De Execução

| Data | Tarefa | Resultado |
|---|---|---|
| 2026-09-11 | `TASK-001` a `TASK-009` | Implementadas. `npm run build` e `npm run lint` passam. |
| 2026-09-11 | Validação manual | Usuário validou localmente (Electron rodando de verdade, fora do sandbox). Spec concluída. |
