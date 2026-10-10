# Spec 003 — Technical Stabilization — Design

## Estado

`done`

## Resumo Técnico

Correções pontuais, sem mudança de arquitetura: mover um side-effect de render para `useEffect`, adicionar um diálogo de confirmação antes da exclusão, remover código de debug/teste, e corrigir nomes com typo (arquivo, função e dois eventos IPC/electron).

## Arquivos Afetados

- `src/renderer/src/components/Sidebar/index.tsx`
- `src/main/store.ts`
- `src/main/index.ts`
- `src/main/shortcurts.ts` → renomeado para `src/main/shortcuts.ts`
- `src/main/tray.ts`
- `src/preload/index.ts`
- `src/renderer/src/components/Header/index.tsx`
- `src/main/ipc.ts`
- `src/renderer/src/pages/document.tsx`

## Decisões Técnicas

| ID | Decisão | Motivo |
|---|---|---|
| `DEC-001` | Mover a sincronização do tray (`getDocumentsfn`) para dentro de um `useEffect` do `Sidebar`, disparado quando `result` (dado do `useQuery`) mudar | Elimina o side-effect no corpo do componente e evita chamadas IPC redundantes a cada render |
| `DEC-002` | Usar `@radix-ui/react-alert-dialog` para a confirmação de exclusão | O projeto já depende de `@radix-ui/react-collapsible`; mantém consistência de acessibilidade (foco, Esc, aria) sem lib nova fora da família Radix |
| `DEC-003` | Renomear os eventos IPC/electron no mesmo commit em main, preload e renderer, sem manter o nome antigo como alias | Main, preload e tray são internos ao mesmo app; não há consumidor externo a preservar |
| `DEC-004` | Remover o `@ts-ignore` em `store.delete` operando no nível do `documents` (`store.get('documents')` → `delete documents[id]` → `store.set('documents', documents)`) em vez de usar dot-notation (`documents.${id}`) | O tipo `delete<Key extends keyof T>` da lib `conf`/`electron-store` não tem overload para strings arbitrárias (diferente de `set`, que tem `set(key: string, value: unknown): void`); `'documents'` é uma chave literal de `StoreType`, então operar nela é type-safe sem nenhum cast |

## Contratos

Nenhum contrato de dado muda de forma. Apenas nomes de canal IPC/electron mudam:

- `abir-documento` → `open-document`
- `all-documento` → `documents:tray-sync`

A padronização completa das constantes IPC (`src/shared/constants/ipc.ts`) fica para a spec `004-ipc-typing-contracts`; aqui só os dois eventos ad-hoc usados por tray/preload são corrigidos.

## Alternativas Consideradas

- `window.confirm` nativo para a confirmação de exclusão: descartado por fugir do estilo visual do app e não se alinhar ao novo design em `openeditor.pen`.

## Research Hooks

Nenhum — sizing `Medium`, sem incerteza técnica relevante.

## Impactos

- Main process: `store.ts`, `index.ts`, `shortcuts.ts`, `tray.ts`, `ipc.ts`.
- Preload: `index.ts` (nomes de evento).
- Renderer: `Sidebar` (efeito colateral), `Header` (confirmação de exclusão), `document.tsx` (limpeza de eslint-disable).
- Persistência: nenhum impacto de schema.

## Plano De Validação

- `npm run build`
- `npm run lint`
- Fluxo manual: abrir o app, criar documento, abrir documento pelo menu do tray, editar, tentar excluir (cancelar) e excluir (confirmar).
