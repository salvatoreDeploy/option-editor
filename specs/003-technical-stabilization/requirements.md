# Spec 003 — Technical Stabilization — Requirements

## Estado

`done`

## Sizing

`Medium`

## Problema

O app tem riscos de bug e comportamento imprevisível: chamada assíncrona disparada durante a renderização do `Sidebar`, exclusão de documento sem confirmação, logs de debug e um canal IPC de teste (`ping`) ainda ativos em produção, e nomes com typos (`shortcurts`, `abir-documento`, `all-documento`) que dificultam manutenção.

## Objetivo

Eliminar esses riscos sem alterar o comportamento visível ao usuário, exceto a adição da confirmação de exclusão (melhoria de segurança de dados).

## Fora De Escopo

- Retipagem completa dos contratos IPC (spec `004-ipc-typing-contracts`).
- Padronização do domínio `document` e textos da interface (spec `006-domain-organization`).
- Debounce/tratamento de erro no autosave (spec `005-persistence-autosave`).
- Qualquer mudança visual não relacionada à confirmação de exclusão.

## Requisitos

| ID | Descrição | Origem |
|---|---|---|
| `REQ-001` | `Sidebar` não deve disparar chamadas assíncronas durante o corpo da renderização; sincronização com o tray deve ocorrer dentro de `useEffect` | Explícito (BACKLOG Sprint 1) |
| `REQ-002` | Excluir documento deve exigir confirmação explícita do usuário antes de invocar a IPC de exclusão | Explícito (BACKLOG Sprint 1) |
| `REQ-003` | Remover `console.log(store.path)` de `src/main/store.ts` | Explícito (BACKLOG Sprint 1) |
| `REQ-004` | Remover o handler de teste `ipcMain.on('ping', ...)` de `src/main/index.ts` | Explícito (BACKLOG Sprint 1) |
| `REQ-005` | Renomear `src/main/shortcurts.ts` para `shortcuts.ts` e `createShortcurts` para `createShortcuts`, atualizando o import em `index.ts` | Explícito (BACKLOG Sprint 1) |
| `REQ-006` | Renomear o evento `abir-documento` para `open-document` em `tray.ts` e `preload/index.ts` | Explícito (BACKLOG Sprint 1) |
| `REQ-007` | Renomear o evento `all-documento` para `documents:tray-sync` em `tray.ts`, `preload/index.ts` e `Sidebar` | Explícito (BACKLOG Sprint 1) |
| `REQ-008` | Remover `@ts-ignore` e o `eslint-disable @typescript-eslint/ban-ts-comment` de `src/main/ipc.ts` | Explícito (achado na análise) |
| `REQ-009` | Remover `eslint-disable @typescript-eslint/no-unused-vars` de `src/renderer/src/pages/document.tsx`, revisando o import não utilizado | Explícito (achado na análise) |

## Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| `NFR-001` | Nenhuma mudança pode alterar o schema de dados armazenado no `electron-store` de forma que documentos existentes se percam |
| `NFR-002` | Renomeações de evento IPC/electron devem manter main, preload e renderer sincronizados — nenhum lado pode referenciar o nome antigo após a mudança |

## Restrições

- Não introduzir dependências novas além das já usadas no projeto, salvo justificativa registrada em `design.md`.
- Manter a UI atual (o novo design em `openeditor.pen` é tratado em specs de UX/design, não aqui).

## Critérios De Aceite

| ID | Critério |
|---|---|
| `AC-001` | Abrir o app não dispara nenhuma chamada IPC fora de um `useEffect` ou de uma interação do usuário |
| `AC-002` | Clicar em "Apagar" abre uma confirmação; cancelar não exclui; confirmar exclui e navega para fora do documento |
| `AC-003` | Nenhum `console.log` de debug aparece no terminal do processo main ao rodar o app |
| `AC-004` | Não existe handler para o canal `'ping'` no código |
| `AC-005` | Não existe mais nenhuma ocorrência de `shortcurts`/`createShortcurts` no código |
| `AC-006` | Os eventos usados entre tray/preload/renderer são `open-document` e `documents:tray-sync`, sem ocorrência de `abir-documento` ou `all-documento` |
| `AC-007` | `src/main/ipc.ts` não contém `@ts-ignore` nem `eslint-disable @typescript-eslint/ban-ts-comment` |
| `AC-008` | `src/renderer/src/pages/document.tsx` não contém `eslint-disable @typescript-eslint/no-unused-vars` |

## Riscos

| ID | Risco | Mitigação |
|---|---|---|
| `RISK-001` | Renomear eventos IPC pode quebrar a sincronia entre tray, preload e renderer se algum lado não for atualizado | Buscar todas as ocorrências do nome antigo no repositório antes de remover, e validar manualmente o fluxo de abertura pelo tray após a mudança |
| `RISK-002` | Um diálogo de confirmação improvisado pode ficar inacessível (sem foco/teclado/Esc) | Reaproveitar um componente Radix (já dependência do projeto) em vez de um modal customizado do zero |
