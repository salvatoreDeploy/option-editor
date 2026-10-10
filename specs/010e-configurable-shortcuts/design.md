# Spec 010e — Configurable Shortcuts — Design

## Estado

`done`

## Resumo Técnico

Atalhos configuráveis viram um objeto `shortcuts: { newDocument: string; quickSearch: string }` no `electron-store` (formato de string igual ao `Accelerator` do Electron, ex. `"CommandOrControl+1"`). `src/main/shortcuts.ts` lê esse valor em vez do literal fixo, e reage a mudanças via `store.onDidChange('shortcuts', ...)` pra re-registrar o `globalShortcut` sem reiniciar o app. Uma nova `ShortcutsDialog` no renderer permite gravar e salvar; o `SearchBar` lê o valor salvo pra saber qual combinação abre a busca.

## Arquivos Afetados

- `src/shared/types/ipc.ts` (`ShortcutsConfig`, `FetchShortcutsResponse`, `SaveShortcutsRequest`, `SaveShortcutsResponse`)
- `src/shared/constants/ipc.ts` (namespace `IPC.SHORTCUTS`)
- `src/main/store.ts` (campo `shortcuts` com defaults)
- `src/main/shortcuts.ts` (lê do store, reage a mudanças, valida retorno de `register`)
- `src/main/ipc.ts` (handlers `FETCH`/`SAVE` de atalhos)
- `src/preload/index.ts` (`fetchShortcuts`, `saveShortcuts`)
- Novos: `src/renderer/src/api/fetchShortcuts.ts`, `saveShortcuts.ts`
- Novo: `src/renderer/src/lib/keyboardShortcut.ts` (capturar evento → string accelerator, formatar pra exibição, comparar evento com accelerator salvo)
- Novo: `src/renderer/src/components/ShortcutsDialog/index.tsx`
- `src/renderer/src/components/SearchBar/index.tsx` (listener usa o valor salvo em vez do literal fixo)
- `src/renderer/src/pages/blank.tsx` (dica dinâmica)
- `src/renderer/src/components/Sidebar/index.tsx` (novo botão de entrada pro diálogo, no rodapé)

## Decisões Técnicas

| ID | Decisão | Motivo |
|---|---|---|
| `DEC-001` | Formato armazenado é o `Accelerator` do próprio Electron (`"CommandOrControl+1"`) | O main process já usa esse formato pro `globalShortcut.register`; reaproveitar evita conversão de formato em dois lugares |
| `DEC-002` | Re-registro reativo via `store.onDidChange('shortcuts', ...)` no main, não uma segunda mensagem IPC dedicada a "atalho mudou" | `electron-store`/`conf` já expõe esse mecanismo; um handler `SAVE` que só grava e deixa o watcher reagir é mais simples que coordenar duas responsabilidades no mesmo handler |
| `DEC-003` | Diálogo, não uma tela de rota nova | Consistente com `RenameDialog` (spec `010c`) pra uma ação de escopo pequeno; evita construir navegação/rota só pra isso |
| `DEC-004` | Captura de tecla: um botão "Gravar" que entra em modo de escuta (`onKeyDown` no próprio elemento, `event.preventDefault()`) até o primeiro keydown com modificador; ícones/nomes de tecla não são traduzidos (mostra `Ctrl`, não `⌃`) — mais simples e já é o padrão usado nas dicas existentes (`"Ctrl+1 cria documento"`) | Consistência com o texto já usado no app; suporte a símbolos de teclado por plataforma é complexidade extra não pedida |
| `DEC-005` | Validação (modificador obrigatório, sem colisão) roda no renderer antes de chamar `saveShortcuts`, e de novo no handler `SAVE` do main (não confiar só no client) | Mesma postura já usada nos outros handlers (main é a fonte de verdade) |

## Contratos

```ts
export interface ShortcutsConfig {
  newDocument: string
  quickSearch: string
}

export interface FetchShortcutsResponse { data: ShortcutsConfig }
export type SaveShortcutsRequest = ShortcutsConfig
export interface SaveShortcutsResponse { data: ShortcutsConfig }
```

`IPC.SHORTCUTS = { FETCH: 'shortcuts:fetch', SAVE: 'shortcuts:save' }`.

Defaults: `{ newDocument: 'CommandOrControl+1', quickSearch: 'CommandOrControl+K' }` — iguais aos valores fixos atuais (`NFR-001`).

## Alternativas Consideradas

- Construir a `Screen / Settings` inteira agora e só a seção de atalhos funcional: descartado — as outras seções (nome do workspace, toggles do editor, zona sensível) ficariam com aparência de funcionais sem fazer nada, o que contraria o padrão já seguido neste projeto de não deixar UI decorativa fingindo ser funcional.

## Research Hooks

- Confirmar que `electron-store` (`Store extends Conf`) expõe `onDidChange` com a mesma assinatura do `conf` puro (já visto no type dump da lib durante a spec `005`).

## Impactos

- Main: `store.ts`, `shortcuts.ts`, `ipc.ts`.
- Preload: 2 métodos novos.
- Renderer: novo diálogo, novo helper de teclado, `SearchBar` e `blank.tsx` passam a ler o valor configurado.
- Persistência: novo campo `shortcuts`, com default — não quebra stores existentes sem esse campo (`get` com fallback dos defaults do `electron-store`).

## Plano De Validação

- `npm run build`
- `npm run lint`
- Fluxo manual: abrir o diálogo, gravar um novo atalho de "novo documento", testar (janela sem foco, atalho global), gravar um novo atalho de busca, testar dentro do app; tentar gravar sem modificador; tentar salvar os dois atalhos iguais; conferir que as dicas em `blank.tsx`/`SearchBar` mudaram.
