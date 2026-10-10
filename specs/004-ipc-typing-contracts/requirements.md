# Spec 004 — IPC Typing & Contracts — Requirements

## Estado

`done`

## Sizing

`Medium`

## Problema

A fronteira entre main, preload e renderer é fracamente tipada: `src/preload/index.d.ts` declara `Window.api: unknown`, o que conflita com a declaração global de `Window.api: typeof api` feita em `src/preload/index.ts`. Contratos de request/resposta em `src/shared/types/ipc.ts` não cobrem o caso de documento inexistente, e os canais em `src/shared/constants/ipc.ts` têm espaços literais nos valores (ex. `'documents: fetch-all'`).

## Objetivo

Depende de `003-technical-stabilization` estar concluída (nomes de evento corrigidos). Fortalecer a tipagem de ponta a ponta entre main, preload e renderer, e padronizar os contratos IPC, sem mudar o comportamento observável do app.

## Fora De Escopo

- Renomear domínio ou textos de UI (spec `006-domain-organization`).
- Qualquer novo canal IPC ou funcionalidade.

## Requisitos

| ID | Descrição | Origem |
|---|---|---|
| `REQ-001` | Remover `api: unknown` de `src/preload/index.d.ts`; a tipagem de `Window.api` deve vir de um único lugar | Explícito (BACKLOG Sprint 2) |
| `REQ-002` | Criar um tipo explícito exportado para a API exposta pelo preload (`PreloadApi` ou equivalente) e reutilizá-lo em `index.d.ts` e `index.ts` | Explícito (BACKLOG Sprint 2) |
| `REQ-003` | Padronizar os valores de `IPC` em `src/shared/constants/ipc.ts` sem espaços (ex. `'documents:fetch-all'`) | Explícito (BACKLOG Sprint 3, movido para cá por ser tipagem/contrato) |
| `REQ-004` | Tipar `FetchDocumentResponse.data` como `Document | undefined`, refletindo que o documento pode não existir | Explícito (achado na análise) |
| `REQ-005` | Tipar os retornos das funções em `src/renderer/src/api/*` explicitamente (sem depender apenas de inferência do `window.api`) | Explícito (BACKLOG Sprint 2) |
| `REQ-006` | Remover eslint disables relacionados a tipos que ficarem desnecessários após esta spec | Explícito (BACKLOG Sprint 2) |
| `REQ-007` | Revisar uso misto dos aliases `~/*` e `@*` (`tsconfig.json`) e padronizar um deles para imports internos | Explícito (achado na análise) |

## Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| `NFR-001` | `npm run build` deve passar sem erros de tipo ao final da spec |
| `NFR-002` | Nenhuma mudança de tipo pode alterar o formato dos dados persistidos no `electron-store` |

## Restrições

- Não introduzir um gerador de schema (ex. zod) a menos que registrado como decisão no `design.md`; o objetivo é tipagem estática, não validação em runtime.

## Critérios De Aceite

| ID | Critério |
|---|---|
| `AC-001` | `Window.api` é declarado em um único lugar com tipo explícito, sem `unknown` |
| `AC-002` | Renderer reconhece `window.api.fetchDocuments`, `createDocument`, `saveDocument` e `deleteDocument` com tipos corretos no editor/TS |
| `AC-003` | `npm run build` passa sem erros de tipo |
| `AC-004` | Nenhum valor em `IPC` contém espaço |
| `AC-005` | O código que consome `fetchDocument` trata explicitamente o caso `undefined` |

## Riscos

| ID | Risco | Mitigação |
|---|---|---|
| `RISK-001` | Mudar o valor das constantes `IPC` sem atualizar os três lados (main, preload, renderer) quebra a comunicação | Os valores já são centralizados em `src/shared/constants/ipc.ts` e importados por todos os lados; validar com build antes de considerar concluído |
| `RISK-002` | Tipar `fetchDocument` como possivelmente `undefined` pode expor erros de tipo em código que hoje assume presença do documento | Tratar cada ponto de consumo (`document.tsx`) como parte desta mesma spec, não deixar solto |
