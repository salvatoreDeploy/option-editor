# Spec 010h — Markdown Import — Tasks

## Estado

`done`

## Tarefas

- [x] `TASK-001`: Adicionar contrato `ImportMarkdownResponse` em `src/shared/types/ipc.ts` e `IPC.IMPORT.IMPORT_MARKDOWN` em `src/shared/constants/ipc.ts`.
  - Refs: `REQ-002`, `DEC-005`.
  - Aceite: tipos e constante disponíveis para main/preload/renderer.
  - Verificação: `npm run build`.

- [x] `TASK-002`: Criar `src/main/import.ts` com `createImportHandlers(window)` — diálogo nativo `showOpenDialog` filtrado para `.md`/`.markdown`, leitura do arquivo (UTF-8) e retorno de `{ canceled, fileName, content }`; registrar em `src/main/index.ts`.
  - Refs: `REQ-002`, `REQ-006`, `NFR-001`, `NFR-002`.
  - Aceite: cancelar o diálogo retorna `{ canceled: true }` sem lançar erro; escolher um arquivo retorna nome (sem extensão) e conteúdo bruto.
  - Verificação: fluxo manual validado pelo usuário (diálogo nativo, cancelar e escolher arquivo).

- [x] `TASK-003`: Expor `importMarkdown` no preload (`src/preload/index.ts`) e criar `src/renderer/src/api/importMarkdown.ts`.
  - Refs: `REQ-002`.
  - Aceite: `window.api.importMarkdown()` tipado e chamável do renderer.
  - Verificação: `npm run build`.

- [x] `TASK-004`: Exportar `escapeHtml` de `src/renderer/src/lib/htmlText.ts`.
  - Refs: `REQ-004`.
  - Aceite: função reaproveitável por `markdownToHtml.ts` sem duplicar a de `buildExportContent.ts`.
  - Verificação: `npm run build`.

- [x] `TASK-005`: Criar `src/renderer/src/lib/markdownToHtml.ts` — extração de título (`DEC-003`) e conversão de blocos (heading, parágrafo, negrito, itálico, tachado, destaque, código inline, bloco de código com linguagem, citação, listas, divisor, quebra de linha).
  - Refs: `REQ-003`, `REQ-004`, `DEC-002`, `DEC-006`.
  - Aceite: `markdownToHtml(raw, fallbackTitle)` devolve `{ title, content }` cobrindo os casos de `AC-001`–`AC-003`, `AC-006`.
  - Verificação: módulo isolado com `esbuild` (bundle pra Node puro, sem Electron) e executado com casos cobrindo todos os nós listados, título com e sem heading na primeira linha, blocos colados sem linha em branco entre eles, e quebra de linha forte — ver Registro de Execução.

- [x] `TASK-006`: Criar `src/renderer/src/hooks/useImportMarkdown.ts` — chama `importMarkdown()`, converte com `markdownToHtml`, cria documento (`createDocument`) e salva (`saveDocument`), atualiza cache do React Query e navega, igual a `useCreateDocument`.
  - Refs: `REQ-005`, `NFR-002`.
  - Aceite: importar com sucesso cria e abre o documento; cancelar não cria nada; erro de leitura não deixa estado quebrado.
  - Verificação: `npm run build`/`npm run lint`; fluxo manual validado pelo usuário.

- [x] `TASK-007`: Adicionar botão "Importar Markdown" em `src/renderer/src/components/Sidebar/CreatePage.tsx`, usando `useImportMarkdown`.
  - Refs: `REQ-001`.
  - Aceite: botão visível na Sidebar, abaixo/perto de "Novo documento", aciona o fluxo de import.
  - Verificação: `npm run build`/`npm run lint`; fluxo manual validado pelo usuário.

## Validação Final

- [x] `npm run build` executado — sem erros.
- [x] `npm run lint` executado — sem erros (1 erro de `no-control-regex` corrigido durante a implementação, ver Registro de Execução).
- [x] Fluxo manual afetado validado (`AC-001`–`AC-006`) — usuário testou e aprovou.
- [x] Spec atualizada com decisões finais.

## Registro De Execução

| Data | Tarefa | Resultado |
|---|---|---|
| 2026-09-20 | Spec criada | `requirements.md`, `design.md`, `tasks.md` preenchidos a partir do padrão da `010g-document-export` |
| 2026-09-20 | `TASK-001`–`TASK-007` | Implementadas. `npm run build` e `npm run lint` passam sem erros |
| 2026-09-20 | `TASK-005` (correção) | `npm run lint` acusou `no-control-regex` no marcador `\u0000` usado para proteger trechos de código inline; trocado por um sentinela da área de uso privado do Unicode (``), sem controle |
| 2026-09-20 | `TASK-005` (validação isolada) | `markdownToHtml.ts` bundlado com `esbuild` (`--platform=node --format=cjs`) e executado fora do Electron com Markdown cobrindo heading, título por nome de arquivo, parágrafo, negrito, itálico, tachado, destaque, código inline, link, quebra de linha forte, heading nível 2, citação de duas linhas, lista não-ordenada, lista ordenada, bloco de código com linguagem, divisor, e blocos colados sem linha em branco entre eles — todos os casos produziram o HTML esperado |
| 2026-09-20 | Validação manual | Usuário testou o fluxo completo na UI real e aprovou ("testado e aprovado"). Spec concluída. |
